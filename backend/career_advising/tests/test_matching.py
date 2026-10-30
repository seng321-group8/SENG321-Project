import unittest

from career_advising.domain.errors import InvalidProfile
from career_advising.domain.matching import AdvisorCandidate as A, StudentInput as S, score, select_advisor


def adv(id, kw, dept=1, years=(1, 2, 3, 4), n=0, quota=30):
    return A(id=id, keywords=frozenset(kw), department_id=dept, served_years=frozenset(years),
             current_students=n, quota=quota)


class MatchingTests(unittest.TestCase):
    def setUp(self):
        self.s = S(class_year=3, department_id=1, keywords=frozenset({10, 20, 30}))

    def test_score_formula(self):
        # 2 common keywords (4) + same dept (1) + serves year 3 (1) = 6
        self.assertEqual(score(self.s, adv(1, {10, 20, 99})), 6)
        # 1 common (2) + other dept (0) + does not serve year 3 (0) = 2
        self.assertEqual(score(self.s, adv(2, {10}, dept=2, years=(1, 2))), 2)

    def test_highest_score_wins(self):
        r = select_advisor(self.s, [adv(1, {10}), adv(2, {10, 20}), adv(3, {10, 20, 30})])
        self.assertEqual((r.advisor_id, r.score), (3, 8))

    def test_tie_goes_to_advisor_with_fewer_students(self):
        r = select_advisor(self.s, [adv(1, {10}, n=12), adv(2, {10}, n=4), adv(3, {10}, n=9)])
        self.assertEqual(r.advisor_id, 2)

    def test_full_tie_is_deterministic_lowest_id(self):
        r1 = select_advisor(self.s, [adv(7, {10}, n=3), adv(5, {10}, n=3)])
        r2 = select_advisor(self.s, [adv(5, {10}, n=3), adv(7, {10}, n=3)])
        self.assertEqual((r1.advisor_id, r2.advisor_id), (5, 5))

    def test_no_common_keyword_is_not_a_candidate(self):
        r = select_advisor(self.s, [adv(1, {99}), adv(2, set())])
        self.assertFalse(r.matched)

    def test_full_quota_is_skipped(self):
        r = select_advisor(self.s, [adv(1, {10, 20, 30}, n=30, quota=30), adv(2, {10})])
        self.assertEqual(r.advisor_id, 2)

    def test_excluded_advisor_is_skipped(self):
        r = select_advisor(self.s, [adv(1, {10, 20, 30}), adv(2, {10})], excluded_ids=[1])
        self.assertEqual(r.advisor_id, 2)

    def test_waiting_when_only_excluded_candidate(self):
        r = select_advisor(self.s, [adv(1, {10})], excluded_ids={1})
        self.assertIsNone(r.advisor_id)

    def test_lower_score_but_fewer_students_does_not_beat_higher_score(self):
        r = select_advisor(self.s, [adv(1, {10, 20}, n=29), adv(2, {10}, n=0)])
        self.assertEqual(r.advisor_id, 1)

    def test_profile_validation(self):
        with self.assertRaises(InvalidProfile):
            select_advisor(S(5, 1, frozenset({1})), [])
        with self.assertRaises(InvalidProfile):
            select_advisor(S(2, 1, frozenset()), [])
        with self.assertRaises(InvalidProfile):
            select_advisor(S(2, 1, frozenset(range(6))), [])

    def test_input_has_no_gpa_field(self):
        self.assertFalse(hasattr(self.s, "gpa"))


if __name__ == "__main__":
    unittest.main()
