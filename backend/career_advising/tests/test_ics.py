import unittest
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from career_advising.domain.ics import build_ics, escape_text, fold_line

IST = ZoneInfo("Europe/Istanbul")
START = datetime(2026, 11, 3, 14, 0, tzinfo=IST)
KW = dict(uid="appointment-42@ankarabilim.edu.tr", summary="Kariyer Danışmanlığı Görüşmesi",
          start=START, end=START + timedelta(minutes=30),
          now=datetime(2026, 11, 1, 8, 0, tzinfo=timezone.utc))


def unfold(text):
    return text.replace("\r\n ", "").split("\r\n")


class IcsTests(unittest.TestCase):
    def test_structure_and_crlf(self):
        s = build_ics(**KW)
        self.assertTrue(s.startswith("BEGIN:VCALENDAR\r\n"))
        self.assertTrue(s.endswith("END:VCALENDAR\r\n"))
        self.assertNotIn("\n", s.replace("\r\n", ""))
        lines = unfold(s)
        for needed in ("VERSION:2.0", "METHOD:PUBLISH", "UID:appointment-42@ankarabilim.edu.tr", "STATUS:CONFIRMED"):
            self.assertIn(needed, lines)

    def test_times_are_utc(self):
        lines = unfold(build_ics(**KW))
        self.assertIn("DTSTART:20261103T110000Z", lines)   # 14:00 Istanbul (UTC+3) -> 11:00Z
        self.assertIn("DTEND:20261103T113000Z", lines)

    def test_naive_datetime_rejected(self):
        with self.assertRaises(ValueError):
            build_ics(**{**KW, "start": datetime(2026, 11, 3, 14, 0)})

    def test_end_before_start_rejected(self):
        with self.assertRaises(ValueError):
            build_ics(**{**KW, "end": START})

    def test_text_escaping(self):
        self.assertEqual(escape_text("a,b;c\\d\nE"), "a\\,b\\;c\\\\d\\nE")

    def test_folding_is_75_octets_and_lossless_with_turkish_chars(self):
        long = "DESCRIPTION:" + "Çğıöşü açıklama, " * 20
        folded = fold_line(long)
        for phys in folded.split("\r\n"):
            self.assertLessEqual(len(phys.encode("utf-8")), 75)
        self.assertEqual(folded.replace("\r\n ", ""), long)

    def test_request_has_organizer_attendee_and_alarm(self):
        s = build_ics(**KW, method="REQUEST", organizer=("Dr. Ayşe Yılmaz", "ayse.yilmaz@ankarabilim.edu.tr"),
                      attendees=[("Ali Veli", "200101001@ankarabilim.edu.tr")], location="https://meet.google.com/abc-defg-hij")
        lines = unfold(s)
        self.assertTrue(any(l.startswith("ORGANIZER;CN=\"Dr. Ayşe Yılmaz\":mailto:ayse.yilmaz@") for l in lines))
        self.assertTrue(any("PARTSTAT=NEEDS-ACTION:mailto:200101001@" in l for l in lines))
        self.assertIn("TRIGGER:-PT30M", lines)

    def test_publish_has_no_attendee(self):
        s = build_ics(**KW, organizer=("A", "a@x.edu.tr"), attendees=[("B", "b@x.edu.tr")])
        self.assertNotIn("ATTENDEE", s)
        self.assertNotIn("ORGANIZER", s)

    def test_cancel_method(self):
        s = build_ics(**KW, method="CANCEL", sequence=1, organizer=("A", "a@x.edu.tr"), attendees=[("B", "b@x.edu.tr")])
        lines = unfold(s)
        self.assertIn("METHOD:CANCEL", lines)
        self.assertIn("STATUS:CANCELLED", lines)
        self.assertIn("SEQUENCE:1", lines)
        self.assertNotIn("BEGIN:VALARM", lines)

    def test_unknown_method_rejected(self):
        with self.assertRaises(ValueError):
            build_ics(**KW, method="REPLY")


if __name__ == "__main__":
    unittest.main()
