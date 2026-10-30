"""Integration tests for the Django layer. Run inside your Django project:  python manage.py test career_advising
They are skipped automatically when Django is not installed (the pure-domain tests still run)."""
import unittest

try:
    import django  # noqa: F401
    from django.conf import settings
    if not settings.configured:
        raise ImportError
except ImportError:
    raise unittest.SkipTest("Django project not configured; run via `manage.py test`")

from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase
from django.utils import timezone

from career_advising import appointment_service as svc
from career_advising import matching_service
from career_advising.domain import errors as E
from career_advising.models import AdvisorProfile, Department, Keyword, OfficeHourSlot, StudentProfile

User = get_user_model()


def mk_user(name, email):
    return User.objects.create_user(username=name, email=email, password="x", first_name=name)


class FlowTests(TestCase):
    def setUp(self):
        self.dept = Department.objects.create(name="Yazılım Mühendisliği")
        self.kw = [Keyword.objects.create(name=n) for n in ("CV", "Staj", "Mülakat")]
        self.advisor = AdvisorProfile.objects.create(user=mk_user("ayse", "ayse.yilmaz@ankarabilim.edu.tr"),
                                                     department=self.dept, served_years=[3])
        self.advisor.keywords.set(self.kw[:2])
        self.student_user = mk_user("ali", "200101001@ankarabilim.edu.tr")
        self.student = StudentProfile.objects.create(user=self.student_user, class_year=3, department=self.dept, gpa="3.10")
        self.student.keywords.set([self.kw[0]])
        start = timezone.now() + timedelta(days=1)
        self.slot = OfficeHourSlot.objects.create(advisor=self.advisor, start=start, end=start + timedelta(minutes=30))

    def match(self):
        return matching_service.run_matching(self.student_user)

    def test_matching_assigns_advisor(self):
        self.assertTrue(self.match().matched)
        self.student.refresh_from_db()
        self.assertEqual(self.student.advisor_id, self.advisor.id)
        self.assertEqual(self.student.match_status, StudentProfile.MATCHED)

    def test_unmatched_student_cannot_book(self):
        with self.assertRaises(E.NotYourAdvisor):
            svc.request_appointment(self.student_user, self.slot.id, "IN_PERSON")

    def test_request_then_slot_is_locked_and_second_student_gets_409(self):
        self.match()
        with self.captureOnCommitCallbacks(execute=True):
            svc.request_appointment(self.student_user, self.slot.id, "IN_PERSON")
        self.assertEqual(len(mail.outbox), 1)                # advisor notified, no .ics yet
        self.assertEqual(len(mail.outbox[0].attachments), 0)
        other = StudentProfile.objects.create(user=mk_user("veli", "200101002@ankarabilim.edu.tr"), class_year=3,
                                              department=self.dept, gpa="2.50", advisor=self.advisor)
        with self.assertRaises(E.SlotUnavailable):
            svc.request_appointment(other.user, self.slot.id, "IN_PERSON")

    def test_one_active_appointment_per_student(self):
        self.match()
        svc.request_appointment(self.student_user, self.slot.id, "IN_PERSON")
        start = self.slot.start + timedelta(days=1)
        slot2 = OfficeHourSlot.objects.create(advisor=self.advisor, start=start, end=start + timedelta(minutes=30))
        with self.assertRaises(E.ActiveAppointmentExists):
            svc.request_appointment(self.student_user, slot2.id, "IN_PERSON")

    def test_approve_online_needs_link_then_sends_ics_to_both(self):
        self.match()
        appt = svc.request_appointment(self.student_user, self.slot.id, "ONLINE")
        with self.assertRaises(E.MeetingLinkRequired):
            svc.approve(self.advisor.user, appt.id)
        with self.captureOnCommitCallbacks(execute=True):
            svc.approve(self.advisor.user, appt.id, "https://meet.google.com/abc-defg-hij")
        approval = [m for m in mail.outbox if "onaylandı" in m.subject]
        self.assertEqual(len(approval), 2)
        for m in approval:
            self.assertEqual(m.attachments[0].get_content_type(), "text/calendar")

    def test_cancel_requires_reason_and_frees_slot(self):
        self.match()
        appt = svc.request_appointment(self.student_user, self.slot.id, "IN_PERSON")
        with self.assertRaises(E.ReasonRequired):
            svc.cancel(self.student_user, appt.id, "  ")
        svc.cancel(self.student_user, appt.id, "Sınavım var")
        self.assertEqual(list(svc.list_open_slots(self.student_user)), [self.slot])
