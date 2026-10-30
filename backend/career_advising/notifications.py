"""E-mail notifications (FR-19, FR-30). Always scheduled with transaction.on_commit by the services,
so a mail failure can never roll back a booking; failures are logged (see README: outbox/retry is a TODO)."""
import logging
from email.mime.text import MIMEText

from django.conf import settings
from django.core.mail import EmailMessage
from django.utils import timezone

from .domain.appointment_rules import ONLINE
from .domain.ics import build_ics
from .models import Appointment

logger = logging.getLogger(__name__)
DOMAIN = "ankarabilim.edu.tr"


def _load(appt_id):
    return Appointment.objects.select_related("slot", "student__user", "student__department",
                                              "slot__advisor__user").get(pk=appt_id)


def _name(user):
    return user.get_full_name() or user.get_username()


def _when(appt):
    return timezone.localtime(appt.slot.start).strftime("%d.%m.%Y %H:%M")


def _type_label(appt):
    return "Online" if appt.meeting_type == ONLINE else "Yüz yüze"


def _where(appt):
    if appt.meeting_type == ONLINE:
        return appt.meeting_link or ""
    return appt.location or "Danışmanın ofisi"


def appointment_ics(appt, method="PUBLISH", sequence=0) -> str:
    advisor, student = appt.slot.advisor.user, appt.student.user
    description = "\n".join(filter(None, [
        f"Görüşme tipi: {_type_label(appt)}",
        f"Bağlantı: {appt.meeting_link}" if appt.meeting_type == ONLINE and appt.meeting_link else "",
        f"Danışman: {_name(advisor)}", f"Öğrenci: {_name(student)}",
    ]))
    return build_ics(
        uid=f"appointment-{appt.pk}@{DOMAIN}",
        summary=f"Kariyer Danışmanlığı: {_name(student)} – {_name(advisor)}",
        start=appt.slot.start, end=appt.slot.end, description=description, location=_where(appt) or None,
        url=appt.meeting_link or None,
        organizer=(_name(advisor), advisor.email), attendees=[(_name(student), student.email)],
        method=method, sequence=sequence,
    )


def _ics_part(ics_text, method):
    part = MIMEText(ics_text, _subtype="calendar", _charset="utf-8")
    part.set_param("method", method)
    part.add_header("Content-Disposition", "attachment", filename="randevu.ics")
    return part


def _send(subject, body, to, ics=None, method=None):
    try:
        msg = EmailMessage(subject, body, getattr(settings, "DEFAULT_FROM_EMAIL", None), to=[to])
        if ics:
            msg.attach(_ics_part(ics, method))
        msg.send()
    except Exception:  # noqa: BLE001 - never break the request because SMTP is down
        logger.exception("E-posta gönderilemedi: %s -> %s", subject, to)


def _link():
    return getattr(settings, "FRONTEND_URL", "")


def send_request_email(appt_id):
    """Advisor gets the new request (no .ics yet: the appointment is not confirmed)."""
    a = _load(appt_id)
    body = (f"{_name(a.student.user)} ({a.student.department or '-'}, {a.student.class_year}. sınıf) "
            f"{_when(a)} için {_type_label(a).lower()} görüşme talep etti.\n\n"
            f"Talebi kabul veya reddetmek için: {_link()}")
    _send(f"Yeni randevu talebi – {_when(a)}", body, a.slot.advisor.user.email)


def send_decision_emails(appt_id, approved):
    a = _load(appt_id)
    advisor, student = a.slot.advisor.user, a.student.user
    if not approved:
        _send(f"Randevu talebiniz reddedildi – {_when(a)}",
              f"{_name(advisor)}, {_when(a)} tarihli randevu talebinizi uygun bulmadı. "
              f"Başka bir ofis saati seçebilirsiniz: {_link()}", student.email)
        return
    ics = appointment_ics(a, method="REQUEST")
    where = _where(a)
    tail = f"\nBağlantı: {where}" if a.meeting_type == ONLINE else f"\nYer: {where}"
    _send(f"Randevunuz onaylandı – {_when(a)}",
          f"{_name(advisor)} ile {_when(a)} tarihli {_type_label(a).lower()} görüşmeniz onaylandı.{tail}\n"
          "Ekteki dosyayı takviminize ekleyebilirsiniz.", student.email, ics, "REQUEST")
    _send(f"Randevu onaylandı – {_when(a)}",
          f"{_name(student)} ile {_when(a)} tarihli {_type_label(a).lower()} görüşme onaylandı.{tail}\n"
          "Ekteki dosyayı takviminize ekleyebilirsiniz.", advisor.email, ics, "REQUEST")


def send_cancellation_emails(appt_id, was_confirmed, actor):
    """actor: 'student' | 'advisor' | 'system'. The other party is told why; whoever has a confirmed
    event in their calendar also receives a METHOD:CANCEL file so the event disappears."""
    a = _load(appt_id)
    advisor, student = a.slot.advisor.user, a.student.user
    reason = a.cancel_reason or "-"
    cancel_ics = appointment_ics(a, method="CANCEL", sequence=1) if was_confirmed else None
    targets = {"student": [(advisor, student)], "advisor": [(student, advisor)],
               "system": [(advisor, None), (student, None)]}[actor]   # (who is told, who cancelled)
    for who, canceller in targets:
        _send(f"Randevu iptal edildi – {_when(a)}",
              f"{_when(a)} tarihli randevu iptal edildi.\nGerekçe: {reason}", who.email, cancel_ics, "CANCEL")
        if canceller is not None and was_confirmed:
            _send(f"Randevunuz iptal edildi – {_when(a)}",
                  "İptal işleminiz tamamlandı. Ekteki dosya takviminizden etkinliği kaldırır.",
                  canceller.email, cancel_ics, "CANCEL")
