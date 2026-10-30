"""Appointment use cases (FR-10..FR-20). Rules live in domain.appointment_rules; this layer adds
transactions, row locks (+ DB constraints as the last line of defence) and notifications."""
from functools import partial

from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError, transaction
from django.utils import timezone

from . import integrations, notifications
from .domain.appointment_rules import (
    ACTIVE_STATUSES, ADVISOR, CONFIRMED, ONLINE, STUDENT, check_can_request, next_status,
)
from .domain.errors import (
    ActiveAppointmentExists, ActorNotAllowed, MeetingLinkRequired, NotFound, SlotUnavailable,
)
from .models import Appointment, OfficeHourSlot, StudentProfile


def _student_of(user):
    try:
        return user.student_profile
    except ObjectDoesNotExist:
        raise ActorNotAllowed("Bu işlem yalnızca öğrenciler içindir.")


def _locked(appt_id) -> Appointment:
    try:
        return (Appointment.objects.select_for_update(of=("self",))
                .select_related("slot__advisor__user", "student__user").get(pk=appt_id))
    except Appointment.DoesNotExist:
        raise NotFound()


def _after_commit(fn, *args):
    transaction.on_commit(partial(fn, *args))


def list_open_slots(student_user):
    """Only the student's own advisor's future slots that have no active appointment (FR-11)."""
    sp = _student_of(student_user)
    if not sp.advisor_id:
        return OfficeHourSlot.objects.none()
    taken = Appointment.objects.filter(status__in=ACTIVE_STATUSES).values("slot_id")
    return (OfficeHourSlot.objects.filter(advisor_id=sp.advisor_id, start__gt=timezone.now())
            .exclude(id__in=taken).order_by("start"))


def request_appointment(student_user, slot_id, meeting_type, location="") -> Appointment:
    sp_pk = _student_of(student_user).pk
    with transaction.atomic():
        sp = StudentProfile.objects.select_for_update().get(pk=sp_pk)   # serialise this student's requests
        try:
            slot = OfficeHourSlot.objects.select_for_update().get(pk=slot_id)
        except OfficeHourSlot.DoesNotExist:
            raise NotFound("Ofis saati bulunamadı.")
        check_can_request(
            student_advisor_id=sp.advisor_id, slot_advisor_id=slot.advisor_id,
            slot_start=slot.start, now=timezone.now(), meeting_type=meeting_type,
            slot_taken=Appointment.objects.filter(slot=slot, status__in=ACTIVE_STATUSES).exists(),
            student_has_active=Appointment.objects.filter(student=sp, status__in=ACTIVE_STATUSES).exists(),
        )
        try:
            with transaction.atomic():
                appt = Appointment.objects.create(student=sp, slot=slot, meeting_type=meeting_type,
                                                  location=(location or "").strip())
        except IntegrityError as exc:   # a concurrent request won the race: the DB constraint decided
            raise (ActiveAppointmentExists() if "student" in str(exc).lower() else SlotUnavailable())
        _after_commit(notifications.send_request_email, appt.pk)
        return appt


def approve(advisor_user, appt_id, meeting_link=None) -> Appointment:
    with transaction.atomic():
        appt = _locked(appt_id)
        _require_advisor_owner(advisor_user, appt)
        new_status = next_status(appt.status, "approve", ADVISOR)
        if appt.meeting_type == ONLINE:
            link = (meeting_link or "").strip() or integrations.try_create_meet_link(appt)
            if not link:
                raise MeetingLinkRequired()
            appt.meeting_link = link
        appt.status, appt.decided_at = new_status, timezone.now()
        appt.save(update_fields=["status", "decided_at", "meeting_link"])
        _after_commit(notifications.send_decision_emails, appt.pk, True)
        return appt


def reject(advisor_user, appt_id) -> Appointment:
    with transaction.atomic():
        appt = _locked(appt_id)
        _require_advisor_owner(advisor_user, appt)
        appt.status, appt.decided_at = next_status(appt.status, "reject", ADVISOR), timezone.now()
        appt.save(update_fields=["status", "decided_at"])
        _after_commit(notifications.send_decision_emails, appt.pk, False)
        return appt


def cancel(user, appt_id, reason) -> Appointment:
    with transaction.atomic():
        appt = _locked(appt_id)
        if user.id == appt.student.user_id:
            actor = STUDENT
        elif user.id == appt.slot.advisor.user_id:
            actor = ADVISOR
        else:
            raise NotFound()          # do not reveal other people's appointments
        was_confirmed = appt.status == CONFIRMED
        appt.status = next_status(appt.status, "cancel", actor, reason=reason)
        appt.cancelled_by, appt.cancel_reason = user, reason.strip()
        appt.save(update_fields=["status", "cancelled_by", "cancel_reason"])
        _after_commit(notifications.send_cancellation_emails, appt.pk, was_confirmed, actor)
        return appt


def mark(advisor_user, appt_id, action) -> Appointment:
    """action: 'complete' | 'no_show' (FR-18)."""
    with transaction.atomic():
        appt = _locked(appt_id)
        _require_advisor_owner(advisor_user, appt)
        appt.status = next_status(appt.status, action, ADVISOR, now=timezone.now(), slot_end=appt.slot.end)
        appt.save(update_fields=["status"])
        return appt


def system_cancel_future(student_profile, old_advisor_profile, reason):
    """Used when a change request is approved: cancels future active appointments with the old advisor."""
    now = timezone.now()
    qs = (Appointment.objects.select_for_update(of=("self",))
          .filter(student=student_profile, slot__advisor=old_advisor_profile,
                  status__in=ACTIVE_STATUSES, slot__start__gt=now))
    for appt in qs:
        was_confirmed = appt.status == CONFIRMED
        appt.status, appt.cancel_reason, appt.cancelled_by = "CANCELLED", reason, None
        appt.save(update_fields=["status", "cancel_reason", "cancelled_by"])
        _after_commit(notifications.send_cancellation_emails, appt.pk, was_confirmed, "system")


def _require_advisor_owner(user, appt):
    if user.id != appt.slot.advisor.user_id:
        raise NotFound()
