"""Rule-based advisor matching (no AI). Pure Python: no Django imports, fully unit-testable.

Rule (project spec):
  candidate = shares >= 1 keyword with the student AND quota not full AND not excluded
  score     = 2 * common_keywords + (1 if same department) + (1 if advisor serves student's class year)
  winner    = highest score; tie -> fewer current students; still tied -> lowest advisor id (deterministic, NFR-04)
GPA is deliberately NOT an input: it never affects the score.
"""
from dataclasses import dataclass
from typing import FrozenSet, Iterable, Optional

from .errors import InvalidProfile

POINTS_PER_COMMON_KEYWORD = 2
POINTS_SAME_DEPARTMENT = 1
POINTS_SERVES_CLASS_YEAR = 1
MIN_KEYWORDS, MAX_KEYWORDS = 1, 5


@dataclass(frozen=True)
class StudentInput:
    class_year: int
    department_id: Optional[int]
    keywords: FrozenSet[int]


@dataclass(frozen=True)
class AdvisorCandidate:
    id: int
    keywords: FrozenSet[int]
    department_id: Optional[int]
    served_years: FrozenSet[int]
    current_students: int
    quota: int


@dataclass(frozen=True)
class MatchResult:
    advisor_id: Optional[int]   # None -> student stays "waiting for match"
    score: Optional[int]

    @property
    def matched(self) -> bool:
        return self.advisor_id is not None


def validate_student(student: StudentInput) -> None:
    if student.class_year not in (1, 2, 3, 4):
        raise InvalidProfile("Sınıf 1-4 arasında olmalıdır.")
    if not (MIN_KEYWORDS <= len(student.keywords) <= MAX_KEYWORDS):
        raise InvalidProfile("1 ile 5 arasında anahtar kelime seçmelisiniz.")


def score(student: StudentInput, advisor: AdvisorCandidate) -> int:
    common = len(student.keywords & advisor.keywords)
    total = common * POINTS_PER_COMMON_KEYWORD
    if student.department_id is not None and student.department_id == advisor.department_id:
        total += POINTS_SAME_DEPARTMENT
    if student.class_year in advisor.served_years:
        total += POINTS_SERVES_CLASS_YEAR
    return total


def is_eligible(student: StudentInput, advisor: AdvisorCandidate, excluded_ids: frozenset = frozenset()) -> bool:
    return (
        advisor.id not in excluded_ids
        and advisor.current_students < advisor.quota
        and len(student.keywords & advisor.keywords) >= 1
    )


def select_advisor(
    student: StudentInput,
    advisors: Iterable[AdvisorCandidate],
    excluded_ids: Iterable[int] = (),
) -> MatchResult:
    validate_student(student)
    excluded = frozenset(excluded_ids)
    eligible = [a for a in advisors if is_eligible(student, a, excluded)]
    if not eligible:
        return MatchResult(advisor_id=None, score=None)
    best = min(eligible, key=lambda a: (-score(student, a), a.current_students, a.id))
    return MatchResult(advisor_id=best.id, score=score(student, best))
