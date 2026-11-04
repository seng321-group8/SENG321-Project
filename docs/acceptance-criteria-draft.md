# Acceptance Criteria Draft

| Field | Value |
|---|---|
| Owner | Sümeyye Ebrar COMART — QA and Test Automation Engineer |
| Related issue | #17 (backlog), #16 (OpenAPI) |
| Aligned with | `docs/backlog.md` (US-01 to US-26), `docs/decision.md` (D-01 to D-27) |
| Status | Draft for Sprint 1 review; criteria will be executed as tests after implementation |

## 1. Purpose

This document defines the acceptance criteria that each feature of the Career
Advisor Matching and Appointment System must satisfy to be considered complete.
Every criterion is linked to a backlog story and is written so that it can be
turned directly into an automated or manual test (see
`docs/test-scenario-matrix.md`).

### 1.1 Terms used in this document

| Term | Meaning |
|---|---|
| `PENDING_VERIFICATION` / `ACTIVE` | Account status before and after the e-mail verification link is opened |
| `WAITING_FOR_MATCH` / `MATCHED` | Student status before and after an advisor is assigned |
| `REQUESTED` → `CONFIRMED` / `REJECTED` | Appointment request and the advisor's decision |
| `COMPLETED` / `NO_SHOW` | Outcome of a confirmed appointment, marked by the advisor |
| `CANCELLED` | Appointment cancelled by the student or the advisor |
| `PENDING` → `APPROVED` / `REJECTED` | Advisor change request and the administrator's decision |
| Interest | A keyword from the administrator's predefined list (also called expertise keyword) |
| Maximum interests | Configurable limit; 5 is used in development and tests until the final value is set (D-25) |

---

## 2. Registration, Verification and Sign-in (US-01, US-02, US-03)

### AC-EV-01: Student registration (US-01)
**Given** an unused address in the student format, such as `s230205030@ankarabilim.edu.tr`,
**When** the student registers,
**Then** a STUDENT account with status `PENDING_VERIFICATION` is created and a verification e-mail is sent.

### AC-EV-02: Wrong domain (US-01)
**Given** an address outside `@ankarabilim.edu.tr`, including look-alike domains such as `evilankarabilim.edu.tr`,
**When** the user registers,
**Then** the system rejects the request with HTTP 400 Bad Request.

### AC-EV-03: Student number length (US-01)
**Given** a student address with 8 digits (`s23020503@…`) or 10 digits (`s2302050301@…`),
**When** the user registers,
**Then** the system rejects the request with HTTP 400; an address with exactly 9 digits is accepted.

### AC-EV-04: No self-registration as advisor (US-01)
**Given** an address in the advisor format (`first.last@` or `f.last@ankarabilim.edu.tr`),
**When** a person tries to self-register,
**Then** the system rejects the request with HTTP 400, because advisor accounts are created only by the administrator.

### AC-EV-05: Duplicate registration (US-01)
**Given** an address that is already registered,
**When** the user registers again,
**Then** the system rejects the request with HTTP 409 Conflict.

### AC-EV-06: Complete e-mail verification (US-02)
**Given** a user has received a verification e-mail,
**When** the user opens the link before it expires,
**Then** the account status changes to `ACTIVE` and sign-in is allowed.

### AC-EV-07: Invalid verification link (US-02)
**Given** an expired or already used verification link,
**When** the user opens it,
**Then** the system rejects it (HTTP 400 or 409) and the account status does not change.

### AC-EV-08: Resend limit (US-02)
**Given** a user requests a new verification e-mail several times in a short period,
**When** the limit is exceeded,
**Then** further requests are rejected with HTTP 429 Too Many Requests.

### AC-EV-09: Sign-in requires verification (US-03)
**Given** an account that is still `PENDING_VERIFICATION`,
**When** the user signs in with correct credentials,
**Then** the system rejects the sign-in with HTTP 403 Forbidden.

### AC-EV-10: Wrong credentials (US-03)
**Given** an `ACTIVE` account,
**When** the user signs in with a wrong password,
**Then** the system rejects the sign-in with HTTP 401 Unauthorized.

---

## 3. Administration (US-04, US-05)

### AC-AA-01: Add an interest (US-04)
**Given** an administrator,
**When** the administrator adds the interest "Portfolio",
**Then** it appears in the interest list for students and advisors.

### AC-AA-02: Duplicate interest (US-04)
**Given** an interest that already exists (case-insensitive),
**When** the administrator adds it again,
**Then** the system rejects the request with HTTP 409 Conflict.

### AC-AA-03: Deactivate an interest (US-04)
**Given** an interest used by existing profiles,
**When** the administrator deactivates it,
**Then** it is no longer offered for new selections, existing profiles keep it, and it still counts in matching.

### AC-AA-04: Create an advisor with default quota (US-05)
**Given** an administrator, a name and a `first.last@ankarabilim.edu.tr` address,
**When** the administrator creates the advisor,
**Then** an ADVISOR account with the default quota of **20** is created and a verification e-mail is sent.

### AC-AA-05: Change quota (US-05)
**Given** an advisor with 12 assigned students,
**When** the administrator sets the quota to 12 or more,
**Then** the quota is updated; **when** set to 11, **then** the system rejects it with HTTP 409 Conflict.

### AC-AA-06: Administrator-only operations (US-04, US-05)
**Given** a student or an advisor,
**When** they call an interest or advisor management operation,
**Then** the system rejects the request with HTTP 403 Forbidden.

---

## 4. Profiles (US-06, US-07)

### AC-SP-01: Valid student profile (US-06)
**Given** a student enters year 3, a department from the list, GPA 3.20 and interests *Internship, Software*,
**When** the student saves the profile,
**Then** the profile is saved and the student status is `WAITING_FOR_MATCH` until the next weekly run.

### AC-SP-02: GPA boundaries (US-06)
**Given** a student is entering GPA,
**When** the value is 0.00 or 4.00,
**Then** the value is accepted.

### AC-SP-03: Invalid GPA (US-06)
**Given** a student is entering GPA,
**When** the value is below 0.00 (e.g. −0.01) or above 4.00 (e.g. 4.01),
**Then** the system rejects the request with HTTP 400 Bad Request.

### AC-SP-04: Year validation (US-06)
**Given** a student is entering the year,
**When** the value is 1, 2, 3 or 4,
**Then** the value is accepted; **when** it is 0 or 5, **then** the request is rejected with HTTP 400.

### AC-SP-05: Interest count (US-06)
**Given** a student is selecting interests,
**When** the student selects at least 1 and at most the configured maximum (5 in development),
**Then** the selection is accepted.

### AC-SP-06: Invalid interest selection (US-06)
**Given** a student is selecting interests,
**When** the student selects none, more than the configured maximum, or an interest that is not in the list,
**Then** the system rejects the request with HTTP 400 Bad Request.

### AC-AV-01: Valid advisor profile (US-07)
**Given** an advisor selects interests *CV, Internship*, years 3 and 4, writes an introduction and chooses "offers online meetings = yes",
**When** the advisor saves the profile,
**Then** the profile is saved.

### AC-AV-02: Invalid advisor profile (US-07)
**Given** an advisor selects no year, no interest, or more than the configured maximum,
**When** the advisor saves the profile,
**Then** the system rejects the request with HTTP 400 Bad Request.

### AC-AV-03: Profile change does not affect existing matches (US-07)
**Given** an advisor already has assigned students,
**When** the advisor changes interests or years served,
**Then** existing assignments do not change; the change applies only to future matching runs.

---

## 5. Weekly Three-Round Matching (US-08 to US-13)

### AC-AM-01: Score formula (US-08)
**Given** an eligible advisor and a student,
**When** the score is calculated,
**Then** it equals `(shared interests × 2) + 1 if same department + 1 if the advisor serves the student's year`.

### AC-AM-02: Round 1 selection (US-08)
**Given** a year-3 Computer Engineering student with {Internship, Interview, Software}, advisor A (years 3–4, Computer Engineering, {Internship, Software, Graduate study}) and advisor B (years 3–4, Electrical Engineering, {Interview, CV, Entrepreneurship}),
**When** round 1 runs,
**Then** advisor A is assigned (score 6 against 3).

### AC-AM-03: Round 1 candidates (US-08)
**Given** an advisor who does not serve the student's year, or whose quota is full,
**When** round 1 runs,
**Then** that advisor is not a candidate.

### AC-AM-04: Tie-breaking (US-08)
**Given** two candidates with the same score,
**When** an advisor is selected,
**Then** the advisor with fewer assigned students is chosen, and that advisor's count increases by one before the next student is processed.

### AC-AM-05: GPA does not affect matching (US-08)
**Given** two students with identical profiles except GPA,
**When** their scores are calculated,
**Then** the scores are identical.

### AC-AM-06: Round 2 (US-09)
**Given** no round-1 candidate, and an advisor serving only years 1–2 who shares one interest with a year-3 student,
**When** round 2 runs,
**Then** that advisor is assigned (the year condition is dropped, at least one shared interest is still required).

### AC-AM-07: Round 3 — own department first (US-10)
**Given** a student who shares no interest with any advisor, advisor X (10 free places, same department) and advisor Y (15 free places, other department),
**When** round 3 runs,
**Then** advisor X is assigned.

### AC-AM-08: Round 3 — seeded random tie (US-10)
**Given** two advisors in the student's department with the same number of free places,
**When** round 3 runs with the fixed test seed,
**Then** the same advisor is chosen every time the test is run.

### AC-AM-09: No free quota (US-10)
**Given** every advisor's quota is full,
**When** the weekly run finishes,
**Then** the student stays `WAITING_FOR_MATCH`.

### AC-AM-10: Weekly run and processing order (US-11)
**Given** students waiting for a match,
**When** the scheduled run starts on Sunday at 22:00 (Europe/Istanbul),
**Then** students are processed in order of fewest candidate advisors first, then registration time, through rounds 1–3, and a run record shows the time, the number assigned and the number still waiting.

### AC-AM-11: Manual run (US-11)
**Given** an administrator,
**When** the administrator starts "run now",
**Then** the same matching run is executed; **when** a run is already in progress, **then** the request is rejected with HTTP 409; **when** a non-administrator calls it, **then** HTTP 403.

### AC-AM-12: Match reason (US-12)
**Given** a matched student,
**When** the student opens "My advisor",
**Then** the advisor's name, introduction, interests, shared interests and the department and year reasons are shown; a waiting student sees the date of the next run.

### AC-AM-13: Waiting list (US-13)
**Given** students in `WAITING_FOR_MATCH`,
**When** the administrator opens the waiting list,
**Then** each student is listed with interests and year; students and advisors receive HTTP 403.

---

## 6. Office Hours and Appointments (US-14 to US-18)

### AC-AP-01: Weekly office hours (US-14)
**Given** an advisor adds Tuesday 10:00–11:00,
**When** the advisor saves,
**Then** two weekly 30-minute slots (10:00 and 10:30) are created; a start time that is not on a 30-minute boundary returns HTTP 400 and an overlap returns HTTP 409.

### AC-AP-02: Appointment request (US-15)
**Given** a matched student with no active appointment and a free future slot of the assigned advisor,
**When** the student requests it,
**Then** an appointment with status `REQUESTED` is created and the advisor is notified by e-mail.

### AC-AP-03: Only the assigned advisor's slots (US-15)
**Given** a slot that belongs to another advisor,
**When** the student requests it,
**Then** the system rejects the request with HTTP 403 Forbidden.

### AC-AP-04: Prevent double booking (US-15)
**Given** a slot that already has a `REQUESTED` or `CONFIRMED` appointment, or two students requesting the same slot at the same moment,
**When** a second request arrives,
**Then** only one request succeeds and the other is rejected with HTTP 409 Conflict.

### AC-AP-05: One active appointment per student (US-15)
**Given** a student who already has a `REQUESTED` or `CONFIRMED` appointment,
**When** the student requests another slot,
**Then** the system rejects the request with HTTP 409 Conflict.

### AC-AP-06: Past slots (US-15)
**Given** a slot whose start time is in the past,
**When** the student requests it,
**Then** the system rejects the request with HTTP 400.

### AC-AP-07: Online only if offered (US-15)
**Given** an advisor who does not offer online meetings,
**When** the student requests an online meeting,
**Then** the system rejects the request with HTTP 400.

### AC-AP-08: Advisor accepts (US-16)
**Given** a `REQUESTED` appointment,
**When** the advisor accepts it,
**Then** the status becomes `CONFIRMED` and the student receives a confirmation e-mail with an .ics file.

### AC-AP-09: Advisor rejects (US-16)
**Given** a `REQUESTED` appointment,
**When** the advisor rejects it,
**Then** the status becomes `REJECTED`, the slot becomes free again and the student is notified by e-mail.

### AC-AP-10: Cancellation with a reason (US-17)
**Given** a `CONFIRMED` appointment that starts in 30 minutes or more,
**When** the student or the advisor cancels it with a reason,
**Then** the status becomes `CANCELLED`, the slot becomes free, the other side is notified, and any Google Calendar event is deleted.

### AC-AP-11: Late cancellation (US-17)
**Given** an appointment that starts in less than 30 minutes (boundary: 31 minutes accepted, 29 minutes rejected),
**When** the student or the advisor tries to cancel it,
**Then** the system rejects it with HTTP 409 and the status stays `CONFIRMED`.

### AC-AP-12: Reason required (US-17)
**Given** a cancellation without a reason,
**When** it is submitted,
**Then** the system rejects it with HTTP 400.

### AC-AP-13: Outcome marking (US-18)
**Given** a `CONFIRMED` appointment whose start time has passed,
**When** the advisor marks it,
**Then** the status becomes `COMPLETED` or `NO_SHOW`; marking an appointment that has not started returns HTTP 409.

### AC-AP-14: Assigned students only (US-18)
**Given** an advisor opens "My students",
**When** the list is shown,
**Then** only the advisor's assigned students are listed, including GPA.

---

## 7. Notifications, Calendar and Online Meetings (US-19 to US-22)

### AC-NT-01: Notification e-mails (US-19)
**Given** a registration, request, acceptance, rejection or cancellation,
**When** the event happens,
**Then** the correct recipient receives an e-mail within 1 minute (checked with a test mail server).

### AC-NT-02: E-mail service down (US-19)
**Given** the e-mail service is unavailable,
**When** an event that sends e-mail happens,
**Then** the operation still succeeds, the status is visible in the system and the failure is logged for retry.

### AC-NT-03: Calendar file (US-20)
**Given** a `CONFIRMED` appointment,
**When** the confirmation e-mail is sent or the user selects "Add to calendar",
**Then** an .ics file with the correct start, a 30-minute end and the title is provided; for an appointment that is not `CONFIRMED` the request returns HTTP 409, and for another user's appointment HTTP 403.

### AC-NT-04: Automatic Google Meet link (US-21)
**Given** an advisor who has connected Google Calendar and an online appointment request,
**When** the advisor accepts it,
**Then** a Google Meet link is created and shown to both the student and the advisor.

### AC-NT-05: Google failure fallback (US-21)
**Given** Google Calendar returns an error, or the advisor has disconnected Google Calendar,
**When** an online appointment is confirmed,
**Then** the appointment is still confirmed and the advisor is asked to enter a meeting link manually.

### AC-NT-06: Manual meeting link (US-22)
**Given** a confirmed online appointment of an advisor without Google Calendar,
**When** the advisor saves a valid `https://` link,
**Then** both sides see it; an invalid URL returns HTTP 400.

---

## 8. CV (US-23, US-24)

### AC-CV-01: Upload (US-23)
**Given** a student uploads a 1 MB PDF,
**When** the upload finishes,
**Then** the CV is stored; a second upload replaces the first.

### AC-CV-02: Size limit (US-23)
**Given** a PDF of exactly 2 MB,
**When** it is uploaded,
**Then** it is accepted; a file of 2 MB + 1 byte is rejected with HTTP 400.

### AC-CV-03: File type (US-23)
**Given** a `.docx` or image file,
**When** it is uploaded,
**Then** the system rejects it with HTTP 400.

### AC-CV-04: Access (US-24)
**Given** a student's CV,
**When** the assigned advisor downloads it,
**Then** the PDF is returned; **when** another advisor or another student requests it, **then** HTTP 403.

---

## 9. Advisor Change Requests (US-25, US-26)

### AC-CR-01: Submit a request (US-25)
**Given** a matched student,
**When** the student selects a reason (time conflict, field mismatch, communication issue, year change or other) and writes an explanation of at least 20 characters,
**Then** a `PENDING` request is created.

### AC-CR-02: Explanation length (US-25)
**Given** an explanation of 19 characters,
**When** the request is submitted,
**Then** the system rejects it with HTTP 400; an explanation of exactly 20 characters is accepted.

### AC-CR-03: One pending request (US-25)
**Given** a student who already has a `PENDING` request,
**When** the student submits another,
**Then** the system rejects it with HTTP 409 Conflict.

### AC-CR-04: Approval and re-matching (US-26)
**Given** a `PENDING` request,
**When** the administrator approves it,
**Then** the student is re-matched by the matching rules excluding the previous advisor, future appointments with the previous advisor are cancelled and that advisor is notified by e-mail.

### AC-CR-05: No alternative advisor (US-26)
**Given** an approved request but no other advisor with free quota,
**When** re-matching runs,
**Then** the student keeps the current advisor and the request records that no alternative was found.

### AC-CR-06: Rejection (US-26)
**Given** a `PENDING` request,
**When** the administrator rejects it with a note,
**Then** the request becomes `REJECTED` and the note is recorded; a rejection without a note returns HTTP 400, and deciding a request that is not `PENDING` returns HTTP 409.

---

## 10. Privacy and Authorization (cross-cutting)

### AC-PR-01: GPA privacy (US-06, US-18)
**Given** a user who is neither the student nor the assigned advisor,
**When** the user requests the student's profile,
**Then** the GPA is not returned.

### AC-PR-02: Explanation privacy (US-25, US-26)
**Given** an advisor,
**When** the advisor tries to read a change request explanation,
**Then** access is denied (HTTP 403); the student and administrators can read it.

### AC-PR-03: CV privacy (US-24)
**Given** any user other than the student and the assigned advisor,
**When** they request the CV,
**Then** access is denied (HTTP 403).

### AC-PR-04: Authentication required (all stories)
**Given** a request without a valid session or token,
**When** any protected operation is called,
**Then** the system rejects it with HTTP 401 Unauthorized.

---

## 11. QA Notes

- Each criterion links to a backlog story; the matching test cases are in `docs/test-scenario-matrix.md`.
- HTTP codes follow the OpenAPI contract: 400 invalid input, 401 not signed in, 403 not allowed, 404 not found, 409 conflict with the current state, 429 too many requests. Normal business failures never return 500.
- Random choices in round 3 use a fixed seed in tests so that results are repeatable.
- Time-based rules (weekly run, 30-minute cancellation lock) are tested with a controlled clock, not by waiting.
- These criteria are planned; they will be executed after the corresponding features are implemented (Sprint 3).
