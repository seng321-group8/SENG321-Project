# Test Scenario Matrix

| Field | Value |
|---|---|
| Owner | Sümeyye Ebrar COMART — QA and Test Automation Engineer |
| Related issue | #17 (backlog), #16 (OpenAPI) |
| Aligned with | `docs/acceptance-criteria-draft.md`, `docs/backlog.md` (US-01 to US-26) |
| Status | Planned. Tests will be executed after the corresponding features are implemented (Sprint 3 onward). |

## 1. Purpose and approach

This matrix lists the planned tests for every acceptance criterion. Each test
names its level:

- **Unit** — pure logic without database or network (matching rules, validation, .ics generation). Target: at least 50 % unit-test coverage (course requirement).
- **Integration** — API endpoint with a real PostgreSQL database and a test mail server.
- **E2E** — a user journey through the web interface.

Time-based rules use a controlled clock. Round 3 of matching uses a fixed random seed.

---

## 2. Registration, Verification and Sign-in (US-01 to US-03)

| Test ID | Scenario | Test data | Expected result | Level | AC / Story |
|---|---|---|---|---|---|
| T-EV-01 | Student registers | `s230205030@ankarabilim.edu.tr` | Account `PENDING_VERIFICATION`, verification e-mail sent | Integration | AC-EV-01 / US-01 |
| T-EV-02 | Wrong domain | `s230205030@gmail.com`, `s230205030@evilankarabilim.edu.tr` | HTTP 400 | Unit | AC-EV-02 / US-01 |
| T-EV-03 | Student number length | 8 digits, 9 digits, 10 digits | 8 and 10 → 400; 9 → accepted | Unit | AC-EV-03 / US-01 |
| T-EV-04 | Self-registration with advisor address | `ayse.yilmaz@ankarabilim.edu.tr` | HTTP 400 | Integration | AC-EV-04 / US-01 |
| T-EV-05 | Duplicate registration | Same address twice | Second → HTTP 409 | Integration | AC-EV-05 / US-01 |
| T-EV-06 | Open valid verification link | Fresh token | Status `ACTIVE`, sign-in allowed | Integration | AC-EV-06 / US-02 |
| T-EV-07 | Expired or used link | Expired token; used token | HTTP 400 / 409, status unchanged | Integration | AC-EV-07 / US-02 |
| T-EV-08 | Too many resend requests | Requests over the limit | HTTP 429 | Integration | AC-EV-08 / US-02 |
| T-EV-09 | Sign in before verification | `PENDING_VERIFICATION` account | HTTP 403 | Integration | AC-EV-09 / US-03 |
| T-EV-10 | Wrong password | `ACTIVE` account | HTTP 401 | Integration | AC-EV-10 / US-03 |

## 3. Administration (US-04, US-05)

| Test ID | Scenario | Test data | Expected result | Level | AC / Story |
|---|---|---|---|---|---|
| T-AA-01 | Add interest | "Portfolio" | Visible to students and advisors | Integration | AC-AA-01 / US-04 |
| T-AA-02 | Duplicate interest | "portfolio" after "Portfolio" | HTTP 409 | Integration | AC-AA-02 / US-04 |
| T-AA-03 | Deactivate interest in use | Interest used by 2 profiles | Not offered for new selections; profiles keep it; still counts in matching | Integration | AC-AA-03 / US-04 |
| T-AA-04 | Create advisor | `ali.demir@ankarabilim.edu.tr` | ADVISOR account, quota 20, verification e-mail | Integration | AC-AA-04 / US-05 |
| T-AA-05 | Change quota at the boundary | Advisor with 12 students; quota 12 and 11 | 12 → accepted; 11 → HTTP 409 | Integration | AC-AA-05 / US-05 |
| T-AA-06 | Non-admin calls admin operations | Student and advisor tokens | HTTP 403 | Integration | AC-AA-06 / US-04, US-05 |

## 4. Profiles (US-06, US-07)

| Test ID | Scenario | Test data | Expected result | Level | AC / Story |
|---|---|---|---|---|---|
| T-SP-01 | Valid student profile | Year 3, Computer Eng., GPA 3.20, 2 interests | Saved, status `WAITING_FOR_MATCH` | Integration | AC-SP-01 / US-06 |
| T-SP-02 | GPA boundaries | 0.00 and 4.00 | Accepted | Unit | AC-SP-02 / US-06 |
| T-SP-03 | GPA out of range | −0.01 and 4.01 | HTTP 400 | Unit | AC-SP-03 / US-06 |
| T-SP-04 | Year range | 1, 4 accepted; 0, 5 | 0 and 5 → HTTP 400 | Unit | AC-SP-04 / US-06 |
| T-SP-05 | Interest count within limit | 1 and 5 interests (maximum 5 in tests) | Accepted | Unit | AC-SP-05 / US-06 |
| T-SP-06 | Invalid interests | 0 interests; 6 interests; unknown interest | HTTP 400 | Unit | AC-SP-06 / US-06 |
| T-AV-01 | Valid advisor profile | 2 interests, years 3–4, introduction, online = yes | Saved | Integration | AC-AV-01 / US-07 |
| T-AV-02 | Invalid advisor profile | No year; 0 interests; 6 interests | HTTP 400 | Unit | AC-AV-02 / US-07 |
| T-AV-03 | Profile change after matching | Advisor with 3 students changes interests | The 3 assignments do not change | Integration | AC-AV-03 / US-07 |

## 5. Weekly Three-Round Matching (US-08 to US-13)

| Test ID | Scenario | Test data | Expected result | Level | AC / Story |
|---|---|---|---|---|---|
| T-AM-01 | Score formula | 2 shared interests, same department, year served | Score 6 | Unit | AC-AM-01 / US-08 |
| T-AM-02 | Round 1 picks highest score | Student {Internship, Interview, Software}; A scores 6, B scores 3 | A assigned | Unit | AC-AM-02 / US-08 |
| T-AM-03 | Round 1 excludes non-matching year and full quota | Advisor for years 1–2; advisor at quota | Neither is a round-1 candidate | Unit | AC-AM-03 / US-08 |
| T-AM-04 | Tie → fewer students; count updates in the run | A and B score 4; A has 5 students, B has 3; two identical students | 1st → B (B now has 4); 2nd → B again (4 < 5); a 3rd would go to B only if B still has fewer than A | Unit | AC-AM-04 / US-08 |
| T-AM-05 | GPA ignored | Same profile, GPA 1.50 vs 3.90 | Same score | Unit | AC-AM-05 / US-08 |
| T-AM-06 | Round 2 drops year | No round-1 candidate; advisor for years 1–2 shares 1 interest with year-3 student | That advisor assigned | Unit | AC-AM-06 / US-09 |
| T-AM-07 | Round 3 prefers own department | No shared interests; X (same dept, 10 free), Y (other dept, 15 free) | X assigned | Unit | AC-AM-07 / US-10 |
| T-AM-08 | Round 3 seeded random tie | Two same-dept advisors, equal free places; fixed seed | Same advisor on every run | Unit | AC-AM-08 / US-10 |
| T-AM-09 | All quotas full | Every advisor at quota | Student stays `WAITING_FOR_MATCH` | Unit | AC-AM-09 / US-10 |
| T-AM-10 | Weekly run and order | Clock set to Sunday 22:00; students with 1, 3 and 3 options (different registration times) | Processed: 1-option student first, then by registration time; run record saved | Integration | AC-AM-10 / US-11 |
| T-AM-11 | Manual run | Admin "run now"; second call during a run; student calls it | Run executes; 409; 403 | Integration | AC-AM-11 / US-11 |
| T-AM-12 | Match reason and next run date | Matched student; waiting student | Reason fields shown; waiting student sees next Sunday 22:00 | Integration | AC-AM-12 / US-12 |
| T-AM-13 | Waiting list access | Admin, student, advisor | Admin sees list; others 403 | Integration | AC-AM-13 / US-13 |

## 6. Office Hours and Appointments (US-14 to US-18)

| Test ID | Scenario | Test data | Expected result | Level | AC / Story |
|---|---|---|---|---|---|
| T-AP-01 | Create weekly slots | Tue 10:00–11:00; Tue 10:15; overlapping slot | 2 slots; 10:15 → 400; overlap → 409 | Integration | AC-AP-01 / US-14 |
| T-AP-02 | Request appointment | Free future slot of own advisor | Status `REQUESTED`, advisor e-mailed | Integration | AC-AP-02 / US-15 |
| T-AP-03 | Another advisor's slot | Slot of a different advisor | HTTP 403 | Integration | AC-AP-03 / US-15 |
| T-AP-04 | Double booking, including concurrent requests | 2 students request the same slot at the same moment | Exactly one succeeds; other HTTP 409 | Integration | AC-AP-04 / US-15 |
| T-AP-05 | Second active appointment | Student with a `REQUESTED` appointment | HTTP 409 | Integration | AC-AP-05 / US-15 |
| T-AP-06 | Past slot | Slot that started 1 hour ago | HTTP 400 | Unit | AC-AP-06 / US-15 |
| T-AP-07 | Online not offered | Advisor with online = no; online request | HTTP 400 | Unit | AC-AP-07 / US-15 |
| T-AP-08 | Advisor accepts | `REQUESTED` appointment | `CONFIRMED`, e-mail with .ics | Integration | AC-AP-08 / US-16 |
| T-AP-09 | Advisor rejects | `REQUESTED` appointment | `REJECTED`, slot free, student e-mailed | Integration | AC-AP-09 / US-16 |
| T-AP-10 | Cancel in time | Starts in 2 hours; student cancels with reason; advisor cancels with reason | `CANCELLED`, slot free, other side notified | Integration | AC-AP-10 / US-17 |
| T-AP-11 | Cancellation lock boundary | Starts in 31 min; starts in 29 min (student and advisor) | 31 → accepted; 29 → HTTP 409 | Unit | AC-AP-11 / US-17 |
| T-AP-12 | Cancel without reason | Empty reason | HTTP 400 | Unit | AC-AP-12 / US-17 |
| T-AP-13 | Outcome marking | Past `CONFIRMED`; future `CONFIRMED` | Past → `COMPLETED` / `NO_SHOW`; future → 409 | Integration | AC-AP-13 / US-18 |
| T-AP-14 | Advisor's student list | Advisor with 3 students; 10 students in total | Only the 3 assigned, with GPA | Integration | AC-AP-14 / US-18 |

## 7. Notifications, Calendar and Online Meetings (US-19 to US-22)

| Test ID | Scenario | Test data | Expected result | Level | AC / Story |
|---|---|---|---|---|---|
| T-NT-01 | E-mails sent | Register, request, accept, reject, cancel | Correct recipient, within 1 minute (test mail server) | Integration | AC-NT-01 / US-19 |
| T-NT-02 | Mail server down | Mail server stopped | Operation succeeds, failure logged | Integration | AC-NT-02 / US-19 |
| T-NT-03 | .ics content and access | `CONFIRMED`; `REQUESTED`; other user's appointment | Correct start, 30-min end, title; 409; 403 | Unit + Integration | AC-NT-03 / US-20 |
| T-NT-04 | Google Meet link | Connected advisor, online request accepted (Google API mocked) | Meet link stored and shown | Integration | AC-NT-04 / US-21 |
| T-NT-05 | Google failure or disconnected | Mocked Google error; disconnected advisor | Appointment confirmed; manual link requested | Integration | AC-NT-05 / US-21 |
| T-NT-06 | Manual link | `https://zoom.us/j/123`; `not-a-url` | Saved; invalid → 400 | Unit | AC-NT-06 / US-22 |

## 8. CV (US-23, US-24)

| Test ID | Scenario | Test data | Expected result | Level | AC / Story |
|---|---|---|---|---|---|
| T-CV-01 | Upload and replace | 1 MB PDF, then another PDF | Second replaces first | Integration | AC-CV-01 / US-23 |
| T-CV-02 | Size boundary | Exactly 2 MB; 2 MB + 1 byte | Accepted; HTTP 400 | Unit | AC-CV-02 / US-23 |
| T-CV-03 | Wrong file type | `.docx`, `.png` | HTTP 400 | Unit | AC-CV-03 / US-23 |
| T-CV-04 | Download access | Assigned advisor; other advisor; other student | PDF; 403; 403 | Integration | AC-CV-04 / US-24 |

## 9. Advisor Change Requests (US-25, US-26)

| Test ID | Scenario | Test data | Expected result | Level | AC / Story |
|---|---|---|---|---|---|
| T-CR-01 | Submit request | Reason "year change", 40-character explanation | `PENDING` | Integration | AC-CR-01 / US-25 |
| T-CR-02 | Explanation boundary | 19 and 20 characters | 19 → 400; 20 → accepted | Unit | AC-CR-02 / US-25 |
| T-CR-03 | Second pending request | Existing `PENDING` request | HTTP 409 | Integration | AC-CR-03 / US-25 |
| T-CR-04 | Approve and re-match | Another advisor with free quota exists | New advisor (not the previous one); future appointments cancelled; previous advisor e-mailed | Integration | AC-CR-04 / US-26 |
| T-CR-05 | Approve with no alternative | All other advisors at quota | Student keeps current advisor; "no alternative" recorded | Integration | AC-CR-05 / US-26 |
| T-CR-06 | Reject and invalid decisions | Reject with note; reject without note; decide an `APPROVED` request | `REJECTED` with note; 400; 409 | Integration | AC-CR-06 / US-26 |

## 10. Privacy and Authorization

| Test ID | Scenario | Test data | Expected result | Level | AC / Story |
|---|---|---|---|---|---|
| T-PR-01 | GPA visibility | Student, assigned advisor, other advisor, admin | GPA only for the student and the assigned advisor | Integration | AC-PR-01 / US-06, US-18 |
| T-PR-02 | Explanation visibility | Advisor, student, admin | Advisor 403; student and admin can read | Integration | AC-PR-02 / US-25, US-26 |
| T-PR-03 | CV visibility | Other student, other advisor | 403 | Integration | AC-PR-03 / US-24 |
| T-PR-04 | No token | Any protected endpoint without a token | 401 | Integration | AC-PR-04 / all |

## 11. Boundary values summary

| Field | Valid boundaries | Invalid boundaries | Tests |
|---|---|---|---|
| GPA | 0.00, 4.00 | −0.01, 4.01 | T-SP-02, T-SP-03 |
| Year | 1, 4 | 0, 5 | T-SP-04 |
| Interests per user | 1, maximum (5 in tests) | 0, maximum + 1 | T-SP-05, T-SP-06, T-AV-02 |
| Student number digits | 9 | 8, 10 | T-EV-03 |
| Quota change | = current student count | current count − 1 | T-AA-05 |
| Cancellation lock | 31 minutes before start | 29 minutes before start | T-AP-11 |
| Change-request explanation | 20 characters | 19 characters | T-CR-02 |
| CV size | 2 MB | 2 MB + 1 byte | T-CV-02 |

## 12. Notes

- All tests are planned and have not been executed yet; the application is not implemented.
- Integration tests run against PostgreSQL (not an in-memory substitute) so that concurrency and unique constraints are tested realistically (T-AP-04).
- External services are replaced in tests: a local test mail server for e-mail and a mock for the Google Calendar API.
- API-level tests can also be run with Postman against the OpenAPI contract once it is final.
