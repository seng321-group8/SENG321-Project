import unittest
from datetime import datetime, timedelta, timezone

from career_advising.domain import appointment_rules as R
from career_advising.domain import errors as E

NOW = datetime(2026, 11, 2, 9, 0, tzinfo=timezone.utc)
START = NOW + timedelta(days=1)
END = START + timedelta(minutes=30)


def ok(**kw):
    base = dict(student_advisor_id=1, slot_advisor_id=1, slot_start=START, now=NOW,
                slot_taken=False, student_has_active=False, meeting_type="ONLINE")
    base.update(kw)
    return R.check_can_request(**base)


class RequestRules(unittest.TestCase):
    def test_happy_path(self):
        self.assertIsNone(ok())

    def test_other_advisors_slot_is_403(self):
        with self.assertRaises(E.NotYourAdvisor) as c:
            ok(slot_advisor_id=2)
        self.assertEqual(c.exception.status_code, 403)

    def test_unmatched_student_is_403(self):
        with self.assertRaises(E.NotYourAdvisor):
            ok(student_advisor_id=None)

    def test_taken_slot_is_409(self):
        with self.assertRaises(E.SlotUnavailable) as c:
            ok(slot_taken=True)
        self.assertEqual(c.exception.status_code, 409)

    def test_second_active_appointment_is_409(self):
        with self.assertRaises(E.ActiveAppointmentExists) as c:
            ok(student_has_active=True)
        self.assertEqual(c.exception.status_code, 409)

    def test_past_slot_and_bad_type_are_400(self):
        with self.assertRaises(E.SlotInPast):
            ok(slot_start=NOW - timedelta(minutes=1))
        with self.assertRaises(E.InvalidMeetingType):
            ok(meeting_type="PHONE")


class Transitions(unittest.TestCase):
    def test_flow(self):
        self.assertEqual(R.next_status("REQUESTED", "approve", "advisor"), "CONFIRMED")
        self.assertEqual(R.next_status("REQUESTED", "reject", "advisor"), "REJECTED")
        self.assertEqual(R.next_status("CONFIRMED", "cancel", "student", reason="Sınavım var"), "CANCELLED")
        self.assertEqual(R.next_status("REQUESTED", "cancel", "advisor", reason="İzinliyim"), "CANCELLED")

    def test_student_cannot_approve(self):
        with self.assertRaises(E.ActorNotAllowed):
            R.next_status("REQUESTED", "approve", "student")

    def test_cancel_needs_reason(self):
        for reason in (None, "", "   "):
            with self.assertRaises(E.ReasonRequired):
                R.next_status("CONFIRMED", "cancel", "student", reason=reason)

    def test_terminal_states_are_final(self):
        for st in ("REJECTED", "CANCELLED", "COMPLETED", "NO_SHOW"):
            with self.assertRaises(E.InvalidTransition):
                R.next_status(st, "cancel", "student", reason="x")

    def test_cannot_approve_twice(self):
        with self.assertRaises(E.InvalidTransition):
            R.next_status("CONFIRMED", "approve", "advisor")

    def test_complete_only_after_slot_ends(self):
        with self.assertRaises(E.InvalidTransition):
            R.next_status("CONFIRMED", "complete", "advisor", now=START, slot_end=END)
        self.assertEqual(R.next_status("CONFIRMED", "no_show", "advisor", now=END, slot_end=END), "NO_SHOW")


if __name__ == "__main__":
    unittest.main()
