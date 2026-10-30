"""Minimal RFC 5545 (iCalendar) writer. No dependencies.

- CRLF line endings, text escaping, 75-octet line folding (UTF-8 safe)
- times are written in UTC ("...Z") so every calendar app shows the correct local time
- METHOD:PUBLISH   -> "Takvime ekle" download
  METHOD:REQUEST   -> invitation attached to the confirmation e-mail
  METHOD:CANCEL    -> removes the event from the recipient's calendar (same UID, higher SEQUENCE)
"""
from datetime import datetime, timezone
from typing import Iterable, Optional, Tuple

CRLF = "\r\n"
METHODS = ("PUBLISH", "REQUEST", "CANCEL")
Person = Tuple[str, str]  # (display name, e-mail)


def escape_text(value: str) -> str:
    return (
        value.replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,")
        .replace("\r\n", "\\n").replace("\n", "\\n").replace("\r", "\\n")
    )


def fold_line(line: str, limit: int = 75) -> str:
    """Fold to <= `limit` octets per physical line; continuation lines start with one space."""
    out, cur, cur_bytes = [], "", 0
    for ch in line:
        size = len(ch.encode("utf-8"))
        if cur_bytes + size > limit:
            out.append(cur)
            cur, cur_bytes = " " + ch, 1 + size
        else:
            cur += ch
            cur_bytes += size
    out.append(cur)
    return CRLF.join(out)


def _utc(dt: datetime) -> str:
    if dt.tzinfo is None:
        raise ValueError("Datetimes must be timezone-aware.")
    return dt.astimezone(timezone.utc).strftime("%Y%m%dT%H%M%SZ")


def _cn(name: str) -> str:
    return name.replace('"', "").replace("\r", " ").replace("\n", " ")


def build_ics(
    *,
    uid: str,
    summary: str,
    start: datetime,
    end: datetime,
    description: str = "",
    location: Optional[str] = None,
    url: Optional[str] = None,
    organizer: Optional[Person] = None,
    attendees: Iterable[Person] = (),
    method: str = "PUBLISH",
    sequence: int = 0,
    now: Optional[datetime] = None,
    alarm_minutes: Optional[int] = 30,
    prodid: str = "-//Ankara Bilim University//Career Advising//TR",
) -> str:
    if method not in METHODS:
        raise ValueError(f"method must be one of {METHODS}")
    if start.tzinfo is None or end.tzinfo is None:
        raise ValueError("Datetimes must be timezone-aware.")
    if end <= start:
        raise ValueError("end must be after start")
    now = now or datetime.now(timezone.utc)
    cancelled = method == "CANCEL"
    partstat = "NEEDS-ACTION" if method == "REQUEST" else "ACCEPTED"

    lines = [
        "BEGIN:VCALENDAR", "VERSION:2.0", f"PRODID:{prodid}", "CALSCALE:GREGORIAN", f"METHOD:{method}",
        "BEGIN:VEVENT",
        f"UID:{uid}",
        f"DTSTAMP:{_utc(now)}",
        f"SEQUENCE:{sequence}",
        f"DTSTART:{_utc(start)}",
        f"DTEND:{_utc(end)}",
        f"SUMMARY:{escape_text(summary)}",
    ]
    if description:
        lines.append(f"DESCRIPTION:{escape_text(description)}")
    if location:
        lines.append(f"LOCATION:{escape_text(location)}")
    if url:
        lines.append(f"URL:{url}")
    if organizer and method != "PUBLISH":
        lines.append(f'ORGANIZER;CN="{_cn(organizer[0])}":mailto:{organizer[1]}')
    if method != "PUBLISH":
        for name, email in attendees:
            lines.append(
                f'ATTENDEE;CN="{_cn(name)}";ROLE=REQ-PARTICIPANT;PARTSTAT={partstat}:mailto:{email}'
            )
    lines += [f"STATUS:{'CANCELLED' if cancelled else 'CONFIRMED'}", "TRANSP:OPAQUE"]
    if alarm_minutes and not cancelled:
        lines += [
            "BEGIN:VALARM", "ACTION:DISPLAY", f"DESCRIPTION:{escape_text(summary)}",
            f"TRIGGER:-PT{int(alarm_minutes)}M", "END:VALARM",
        ]
    lines += ["END:VEVENT", "END:VCALENDAR"]
    return CRLF.join(fold_line(l) for l in lines) + CRLF
