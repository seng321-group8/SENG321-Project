"""Appointment business rules as pure functions + a small state machine.

States:  REQUESTED -> CONFIRMED -> COMPLETED | NO_SHOW
         REQUESTED -> REJECTED
         REQUESTED | CONFIRMED -> CANCELLED
"Active" = REQUESTED or CONFIRMED (a pending request already holds the slot and counts against the
student's one-active-appointment limit).
"""
from datetime import datetime
from typing import Optional

from .errors import (
    ActiveAppointmentExists, ActorNotAllowed, InvalidMeetingType, InvalidTransition,
    NotYourAdvisor, ReasonRequired, SlotInPast, SlotUnavailable,
)

REQUESTED, CONFIRMED, REJECTED = "REQUESTED", "CONFIRMED", "REJECTED"
CANCELLED, COMPLETED, NO_SHOW = "CANCELLED", "COMPLETED", "NO_SHOW"
ACTIVE_STATUSES = (REQUESTED, CONFIRMED)

ONLINE, IN_PERSON = "ONLINE", "IN_PERSON"
MEETING_TYPES = (ONLINE, IN_PERSON)

STUDENT, ADVISOR = "student", "advisor"

# action -> (allowed actors, allowed source states, resulting state)
TRANSITIONS = {
    "approve":  ({ADVISOR},          {REQUESTED},            CONFIRMED),
    "reject":   ({ADVISOR},          {REQUESTED},            REJECTED),
    "cancel":   ({STUDENT, ADVISOR}, {REQUESTED, CONFIRMED}, CANCELLED),
    "complete": ({ADVISOR},          {CONFIRMED},            COMPLETED),
    "no_show":  ({ADVISOR},          {CONFIRMED},            NO_SHOW),
}


def check_can_request(
    *,
    student_advisor_id: Optional[int],
    slot_advisor_id: int,
    slot_start: datetime,
    now: datetime,
    slot_taken: bool,
    student_has_active: bool,
    meeting_type: str,
) -> None:
    """Raises a DomainError (403 / 400 / 409) or returns None when the request is allowed."""
    if student_advisor_id is None or student_advisor_id != slot_advisor_id:
        raise NotYourAdvisor()                       # 403: only own advisor's office hours
    if meeting_type not in MEETING_TYPES:
        raise InvalidMeetingType()                   # 400
    if slot_start <= now:
        raise SlotInPast()                           # 400
    if student_has_active:
        raise ActiveAppointmentExists()              # 409: max 1 active appointment
    if slot_taken:
        raise SlotUnavailable()                      # 409: one appointment per slot


def next_status(
    current: str,
    action: str,
    actor: str,
    *,
    now: Optional[datetime] = None,
    slot_end: Optional[datetime] = None,
    reason: Optional[str] = None,
) -> str:
    if action not in TRANSITIONS:
        raise InvalidTransition("Bilinmeyen işlem.")
    actors, sources, target = TRANSITIONS[action]
    if actor not in actors:
        raise ActorNotAllowed()
    if current not in sources:
        raise InvalidTransition()
    if action == "cancel" and not (reason and reason.strip()):
        raise ReasonRequired()
    if action in ("complete", "no_show") and (now is None or slot_end is None or now < slot_end):
        raise InvalidTransition("Randevu saati bitmeden bu işaretleme yapılamaz.")
    return target
