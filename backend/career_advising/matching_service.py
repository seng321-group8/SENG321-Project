"""DB-facing wrapper around domain.matching: loads candidates, applies the pure rule, saves the result."""
from dataclasses import dataclass
from typing import Optional

from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from django.db.models import Count

from .domain.errors import ActorNotAllowed
from .domain.matching import AdvisorCandidate, MatchResult, StudentInput, select_advisor
from .models import AdvisorProfile, StudentProfile


def _candidates():
    # Lock advisors in id order (no deadlocks) so two concurrent matches cannot both take the last quota seat.
    advisors = list(AdvisorProfile.objects.select_for_update(of=("self",)).order_by("id")
                    .prefetch_related("keywords"))
    counts = dict(StudentProfile.objects.filter(advisor__isnull=False).values("advisor_id")
                  .annotate(n=Count("id")).values_list("advisor_id", "n"))
    return [
        AdvisorCandidate(
            id=a.id, keywords=frozenset(k.id for k in a.keywords.all() if k.is_active),
            department_id=a.department_id, served_years=frozenset(a.served_years or []),
            current_students=counts.get(a.id, 0), quota=a.quota,
        ) for a in advisors
    ]


def _student_input(sp) -> StudentInput:
    return StudentInput(
        class_year=sp.class_year, department_id=sp.department_id,
        keywords=frozenset(sp.keywords.filter(is_active=True).values_list("id", flat=True)),
    )


def _profile_of(user) -> StudentProfile:
    try:
        return user.student_profile
    except ObjectDoesNotExist:
        raise ActorNotAllowed("Bu işlem yalnızca öğrenciler içindir.")


def run_matching(student_user) -> MatchResult:
    """First assignment after the profile is completed. Idempotent: an already matched student keeps their advisor."""
    pk = _profile_of(student_user).pk
    with transaction.atomic():
        sp = StudentProfile.objects.select_for_update().get(pk=pk)
        if sp.advisor_id:
            return MatchResult(advisor_id=sp.advisor_id, score=None)
        result = select_advisor(_student_input(sp), _candidates(), excluded_ids=sp.excluded_advisors.values_list("id", flat=True))
        sp.advisor_id = result.advisor_id
        sp.match_status = StudentProfile.MATCHED if result.matched else StudentProfile.WAITING
        sp.save(update_fields=["advisor", "match_status"])
        return result


@dataclass(frozen=True)
class ReassignResult:
    changed: bool
    new_advisor_id: Optional[int]


def reassign_after_change_approval(student_profile_id: int) -> ReassignResult:
    """Called by the change-request module when the administrator approves a request (FR-26/27).

    The current advisor is excluded for this student. If nobody else is eligible the student simply stays
    with the current advisor and nothing is cancelled. Otherwise future active appointments with the old
    advisor are cancelled and both sides are e-mailed.
    """
    from . import appointment_service  # local import: avoids a cycle

    with transaction.atomic():
        sp = StudentProfile.objects.select_for_update().get(pk=student_profile_id)
        old = sp.advisor
        excluded = set(sp.excluded_advisors.values_list("id", flat=True))
        if old:
            excluded.add(old.id)
        result = select_advisor(_student_input(sp), _candidates(), excluded_ids=excluded)
        if not result.matched:
            return ReassignResult(changed=False, new_advisor_id=old.id if old else None)
        if old:
            sp.excluded_advisors.add(old)
            appointment_service.system_cancel_future(sp, old, "Danışman değişikliği nedeniyle iptal edildi.")
        sp.advisor_id = result.advisor_id
        sp.match_status = StudentProfile.MATCHED
        sp.save(update_fields=["advisor", "match_status"])
        return ReassignResult(changed=True, new_advisor_id=result.advisor_id)
