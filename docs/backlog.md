# Initial Product Backlog — Career Advisor Matching and Appointment System

| Field | Value |
|---|---|
| Deliverable | Sprint 1 — Initial product backlog |
| Team | Team 8 |
| Document owner (Accountable) | Aybüke — Product Owner |
| Acceptance criteria | Ebrar — QA Engineer (review and completion) |
| Feasibility and API impact | Emine — Implementation Engineer, Fatima Zehra — Lead Software Architect |
| Capacity check | Nil — Scrum Master |
| Related issue | #17 |
| Tool | GitHub Projects — "SENG 321 - Sprint 1 Project Board" (one issue per story) |
| Source of truth | Project brief of November 1, 2026 and `docs/decision.md` (D-14 to D-27) |
| Status | Draft for Sprint 1 review |

> **API operations.** `openapi.yaml` does not yet define `operationId` values, so
> operations are listed as `METHOD /path`. Entries marked **(new)** are not yet in
> the contract and must be added by the Architect; Emine's story-to-operation
> mapping confirms the final names.

## 1. Estimation, priority and ownership

- **Story points** measure relative size (effort, complexity, uncertainty), **not hours**. Scale: 1, 2, 3, 5, 8. Reference story: **US-12 (student sees assigned advisor and reason) = 2**. Larger stories are split.
- **Priority** follows the MVP order in the brief:
  - **P1 Must** — MVP part 1–3: registration and login, profiles, weekly matching; office hours and appointment request, approval and cancellation; e-mail and .ics (Sprint 3 MVP).
  - **P2 Should** — MVP part 4: CV upload, Google Meet, advisor change request (final submission).
- **Owners.** Group B (Fatima, Emine, Yağız) owns the API side; Group A (Aybüke, Nil, Ebrar) owns the user interface and acceptance testing. "API owner" is accountable for the story's backend; "UI owner" for its screens. Ebrar writes or reviews the tests of every story. Owners are proposals and are confirmed by Fatima's task distribution.

## 2. Business rules

| ID | Rule | Decision |
|---|---|---|
| BR-1 | Only @ankarabilim.edu.tr addresses can register; the account is inactive until the e-mail verification link is used. | D-14 |
| BR-2 | Role is derived from the e-mail format: student = `s` + 9-digit student number (e.g. s230205030@ankarabilim.edu.tr); advisor = first.last or f.last. Advisor accounts are created only by the administrator. | D-14 |
| BR-3 | Interests: at least 1 and at most a configurable maximum per user (placeholder 5 until advisors' interests are collected), chosen from one predefined, unordered list maintained by the administrator; no free text. | D-25 |
| BR-4 | Student profile: year 1–4, department from a list, GPA 0.00–4.00, interests. | D-25 |
| BR-5 | Advisor profile: interests, years served (any combination of 1–4), department, short introduction text, online-meeting preference. | D-22 |
| BR-6 | Score = 2 × shared interests + 1 (same department) + 1 (advisor serves the student's year). GPA is never used. | D-20 |
| BR-7 | Matching runs as a weekly batch every Sunday at 22:00 (Europe/Istanbul). Round 1: advisors serving the student's year with ≥ 1 shared interest. Round 2: year condition dropped. Round 3: interests ignored; advisor with the most free quota, own department first, random on ties (fixed seed in tests). Ties in rounds 1–2: fewer current students. Counts update during the run. | D-20 |
| BR-8 | Only advisors with free quota are candidates. Students with no candidate stay WAITING_FOR_MATCH. The assigned advisor is permanent. | D-20 |
| BR-9 | Quota is configurable per advisor by the administrator; new advisors start with 20. It cannot be set below the advisor's current number of students. | D-17 |
| BR-10 | Office hours are weekly recurring 30-minute slots. A slot holds at most one active appointment; a student has at most one active appointment. | D-08, D-18 |
| BR-11 | Appointment flow: REQUESTED → CONFIRMED (advisor accepts) or REJECTED; CONFIRMED → COMPLETED / NO_SHOW (advisor marks). REQUESTED or CONFIRMED → CANCELLED by student or advisor with a reason. | D-09, D-18 |
| BR-12 | Cancellation is not allowed within 30 minutes of the start, for both the student and the advisor. | D-18 |
| BR-13 | Meeting type is in person or online; online is possible only if the advisor offers it. A confirmed online appointment gets an automatic Google Meet link if the advisor connected Google Calendar; otherwise the advisor enters a link manually. | D-15 |
| BR-14 | E-mails are sent for verification, request, acceptance or rejection, and cancellation; the confirmation e-mail includes an .ics file. | D-19 |
| BR-15 | CV: one PDF of at most 2 MB per student; a new upload replaces the old file. | D-16 |
| BR-16 | Change request: reason (time conflict, field mismatch, communication issue, year change, other) + explanation ≥ 20 characters; one pending request per student. On approval, re-match excluding the previous advisor; if no candidate, the student keeps the current advisor. | D-21 |
| BR-17 | Privacy: GPA → student and assigned advisor; CV → student and assigned advisor; change-request explanation → student and administrators. | D-26 |
| BR-18 | Advisor profile changes do not affect existing matches; they apply to future runs. | D-23 |

## 3. Epics and features

| Epic | Features | Stories |
|---|---|---|
| EP-01 Registration and access | F-01 Registration and verification; F-02 Sign-in | US-01, US-02, US-03 |
| EP-02 Administration | F-03 Interest list; F-04 Advisor accounts and quota | US-04, US-05 |
| EP-03 Profiles | F-05 Student profile; F-06 Advisor profile | US-06, US-07 |
| EP-04 Weekly matching | F-07 Scoring and rounds; F-08 Batch run; F-09 Match visibility | US-08, US-09, US-10, US-11, US-12, US-13 |
| EP-05 Office hours and appointments | F-10 Office hours; F-11 Request and decision; F-12 Cancellation; F-13 Outcome | US-14, US-15, US-16, US-17, US-18 |
| EP-06 Notifications and calendar | F-14 E-mail; F-15 Calendar file; F-16 Online meeting links | US-19, US-20, US-21, US-22 |
| EP-07 CV | F-17 CV upload and access | US-23, US-24 |
| EP-08 Advisor change | F-18 Change request; F-19 Decision and re-matching | US-25, US-26 |

## 4. Backlog overview (priority order)

| # | ID | Story (short) | Pri | SP | Depends on | API owner | UI owner | API operations |
|---:|---|---|---|---:|---|---|---|---|
| 1 | US-01 | Student registers with institutional e-mail; role from e-mail format | P1 | 3 | — | Fatima | Aybüke | `POST /auth/register` |
| 2 | US-19 | System sends verification and appointment e-mails | P1 | 3 | — | Yağız | Ebrar (tests) | internal (e-mail service) |
| 3 | US-02 | User verifies e-mail; account becomes active | P1 | 3 | US-01, US-19 | Fatima | Aybüke | `POST /auth/verify-email`, `POST /auth/resend-verification` |
| 4 | US-03 | Verified user signs in and sees role-based screens | P1 | 2 | US-02 | Fatima | Aybüke | `POST /auth/login` |
| 5 | US-04 | Admin manages the interest list | P1 | 3 | US-03 | Emine | Nil | `GET /keywords`, `POST /admin/keywords`, `PATCH /admin/keywords/{keywordId}` (new) |
| 6 | US-05 | Admin creates advisor accounts and sets quota | P1 | 3 | US-03 | Emine | Nil | `GET /admin/advisors`, `POST /admin/advisors`, `PATCH /admin/advisors/{advisorId}/capacity` |
| 7 | US-06 | Student completes profile | P1 | 3 | US-03, US-04 | Emine | Aybüke | `GET /departments`, `GET/PUT /students/me/profile` |
| 8 | US-07 | Advisor completes profile (interests, years, intro text, online preference) | P1 | 3 | US-04, US-05 | Emine | Aybüke | `GET/PUT /advisors/me/profile` (fields `bio`, `offersOnline` new) |
| 9 | US-08 | Matching round 1 and scoring rule | P1 | 5 | US-06, US-07 | Fatima | Ebrar (tests) | internal (matching engine) |
| 10 | US-09 | Matching round 2 (year condition dropped) | P1 | 2 | US-08 | Fatima | Ebrar (tests) | internal |
| 11 | US-10 | Matching round 3 (most free quota, own department first, seeded random) | P1 | 3 | US-09 | Fatima | Ebrar (tests) | internal |
| 12 | US-11 | Weekly batch run, manual "run now" and run history | P1 | 5 | US-10 | Yağız | Nil | `POST /admin/matching-runs` (new), `GET /admin/matching-runs` (new) |
| 13 | US-12 | Student sees assigned advisor and reason | P1 | 2 | US-11 | Emine | Aybüke | `GET /students/me/advisor` (fields `matchReason`, `nextMatchingRunAt` new) |
| 14 | US-13 | Admin sees students waiting for a match | P1 | 2 | US-11 | Emine | Nil | `GET /admin/students/waiting` |
| 15 | US-14 | Advisor manages weekly office hours | P1 | 3 | US-07 | Emine | Aybüke | `GET/POST /advisors/me/office-hours`, `DELETE /advisors/me/office-hours/{slotId}` |
| 16 | US-15 | Student requests an appointment | P1 | 5 | US-12, US-14 | Emine | Aybüke | `GET /advisors/{advisorId}/office-hours`, `POST /appointments`, `GET /appointments/{appointmentId}` |
| 17 | US-16 | Advisor accepts or rejects a request | P1 | 3 | US-15 | Emine | Aybüke | `POST /appointments/{appointmentId}/confirm`, `POST /appointments/{appointmentId}/reject` |
| 18 | US-17 | Student or advisor cancels with a reason | P1 | 3 | US-16 | Emine | Aybüke | `POST /appointments/{appointmentId}/cancel` |
| 19 | US-20 | Confirmation e-mail with .ics and "Add to calendar" | P1 | 2 | US-16, US-19 | Yağız | Aybüke | `GET /appointments/{appointmentId}/calendar.ics` |
| 20 | US-18 | Advisor views appointments and marks the outcome | P1 | 2 | US-16 | Emine | Aybüke | `GET /appointments`, `PATCH /appointments/{appointmentId}`, `GET /advisors/me/students` |
| 21 | US-23 | Student uploads, replaces or deletes a CV | P2 | 3 | US-06 | Yağız | Aybüke | `PUT/GET/DELETE /students/me/cv` |
| 22 | US-24 | Assigned advisor downloads a student's CV | P2 | 2 | US-23, US-12 | Yağız | Aybüke | `GET /students/{studentId}/cv` |
| 23 | US-21 | Advisor connects Google Calendar; Meet link created for confirmed online appointments | P2 | 5 | US-16 | Fatima | Aybüke | `GET/DELETE /advisors/me/google-calendar`, `POST /advisors/me/google-calendar/connect`, `GET /advisors/me/google-calendar/callback` |
| 24 | US-22 | Advisor enters a meeting link manually | P2 | 1 | US-16 | Emine | Aybüke | `PATCH /appointments/{appointmentId}` |
| 25 | US-25 | Student requests an advisor change with a reason and explanation | P2 | 3 | US-12 | Emine | Aybüke | `GET/POST /advisor-change-requests` (reason `year_change` new) |
| 26 | US-26 | Admin decides on a change request; approved requests are re-matched | P2 | 5 | US-25, US-10 | Fatima | Nil | `POST /admin/advisor-change-requests/{requestId}/decision` |
| | | **Total** | | **79** | | | | |

P1 total: **60 points** (rows 1–20, Sprint 3 MVP). P2 total: **19 points** (rows 21–26, final submission).

Story-point load by API owner: Fatima 28 · Emine 36 · Yağız 15 (Yağız also owns CI, Docker and SonarQube, which are tracked as technical tasks in Fatima's task distribution).

## 5. Story details

Acceptance criteria use Given / When / Then. Each story has at least one success case, one failure case and, where useful, a boundary case. They are a Product Owner draft, completed and approved together with Ebrar (QA).

### EP-01 Registration and access

**US-01 — Register with institutional e-mail**
As a **student**, I want to **register with my @ankarabilim.edu.tr address**, so that **only university members can use the system**.
- **AC1 (success)** Given an unused address in the student format (e.g. s230205030@ankarabilim.edu.tr), when the student registers, then an inactive STUDENT account is created and a verification e-mail is sent.
- **AC2 (failure)** Given an address outside @ankarabilim.edu.tr (including look-alike domains such as `evilankarabilim.edu.tr`), when registering, then the response is 400.
- **AC3 (failure)** Given an address in the advisor format, when a person self-registers, then the response is 400, because advisor accounts are created only by the administrator.
- **AC4 (failure)** Given an address that is already registered, then the response is 409.
- **AC5 (boundary)** Given `s23020503@ankarabilim.edu.tr` (8 digits) or `s2302050301@ankarabilim.edu.tr` (10 digits), then the response is 400; `s230205030@ankarabilim.edu.tr` (9 digits) is accepted.

**US-02 — Verify e-mail**
As a **user**, I want to **activate my account through the link in the e-mail**, so that **the system knows the address is mine**.
- **AC1 (success)** Given a valid, unused verification token, when the user opens the link, then the account becomes active.
- **AC2 (failure)** Given an expired or already used token, then the response is 400 or 409 and the account stays as it is.
- **AC3 (boundary)** Given a user requests a new link several times in a short period, then further requests are rejected with 429.

**US-03 — Sign in**
As a **user**, I want to **sign in and see the screens of my role**, so that **I only use the functions I am allowed to**.
- **AC1 (success)** Given an active student account and correct credentials, when signing in, then the student home page is shown.
- **AC2 (failure)** Given an account that is not yet verified, when signing in, then the response is 403.
- **AC3 (failure)** Given wrong credentials, then the response is 401.

### EP-02 Administration

**US-04 — Manage the interest list**
As an **administrator**, I want to **add, rename and deactivate interests**, so that **students and advisors describe needs with the same words**.
- **AC1 (success)** Given a new interest "Portfolio", when the admin adds it, then it appears in the list for students and advisors.
- **AC2 (failure)** Given an interest that already exists (case-insensitive), then the response is 409.
- **AC3 (boundary)** Given a deactivated interest, then it is no longer offered for new selections, existing profiles keep it, and it still counts in matching.

**US-05 — Create advisor accounts and set quota**
As an **administrator**, I want to **create advisor accounts and set each advisor's quota**, so that **only faculty members advise students and the workload stays fair**.
- **AC1 (success)** Given a name and a first.last@ankarabilim.edu.tr address, when the admin creates an advisor, then an ADVISOR account with the default quota of 20 is created and a verification e-mail is sent.
- **AC2 (failure)** Given a non-administrator, when calling this operation, then the response is 403.
- **AC3 (boundary)** Given an advisor with 12 students, when the admin sets the quota to 11, then the response is 409; when set to 12, it succeeds.

### EP-03 Profiles

**US-06 — Student profile**
As a **student**, I want to **enter my year, department, GPA and interests**, so that **I can be matched with a suitable advisor**.
- **AC1 (success)** Given year 3, "Computer Engineering", GPA 3.20 and interests *Internship, Software*, when saving, then the profile is stored and the student is WAITING_FOR_MATCH until the next run.
- **AC2 (boundary)** Given GPA 0.00 or 4.00, then the value is accepted; given 4.01 or −0.01, then the response is 400.
- **AC3 (failure)** Given no interest, more than the configured maximum (5 in development), or an interest not in the list, then the response is 400.

**US-07 — Advisor profile**
As an **advisor**, I want to **choose my interests and the years I serve, write a short introduction and say whether I offer online meetings**, so that **I am matched with suitable students and they know me**.
- **AC1 (success)** Given interests *CV, Internship*, years 3 and 4, an introduction and "offers online = yes", when saving, then the profile is updated.
- **AC2 (failure)** Given no year selected, no interest, or more than the configured maximum, then the response is 400.
- **AC3 (boundary)** Given the advisor already has students and changes interests, then existing assignments do not change (BR-18).

### EP-04 Weekly matching

**US-08 — Round 1 and scoring**
As a **student**, I want to **be matched with the advisor who best fits my interests, department and year**, so that **my advisor can really help me**.
- **AC1 (success)** Given a year-3 Computer Engineering student with {Internship, Interview, Software}, advisor A (years 3–4, Computer Engineering, {Internship, Software, Graduate study}) and advisor B (years 3–4, Electrical Engineering, {Interview, CV, Entrepreneurship}), when round 1 runs, then A is assigned (score 6 vs 3).
- **AC2 (boundary)** Given A and B have the same score, then the advisor with fewer current students is assigned, and that advisor's count increases by one before the next student is processed.
- **AC3 (failure)** Given an advisor who does not serve the student's year, or whose quota is full, then that advisor is not a round-1 candidate.
- **AC4** Given two students with identical profiles except GPA, then their scores are identical.

**US-09 — Round 2**
As a **student**, I want to **still be matched by interests when no advisor serves my year**, so that **I am not left without an advisor**.
- **AC1 (success)** Given no round-1 candidate but an advisor for years 1–2 who shares one interest with a year-3 student, when round 2 runs, then that advisor is assigned.
- **AC2 (failure)** Given no advisor shares any interest, then round 2 assigns nobody and the student moves to round 3.

**US-10 — Round 3**
As a **student**, I want to **be assigned to an available advisor even without shared interests**, so that **I always get support when capacity exists**.
- **AC1 (success)** Given no shared interests with anyone, advisor X (10 free places, same department) and advisor Y (15 free places, other department), when round 3 runs, then X is assigned (own department first).
- **AC2 (boundary)** Given two advisors in the student's department with equal free places, then the choice is random; with the test seed fixed, the result is always the same.
- **AC3 (failure)** Given every advisor's quota is full, then the student stays WAITING_FOR_MATCH.

**US-11 — Weekly batch run**
As an **administrator**, I want **matching to run automatically every Sunday and to be able to start it manually**, so that **students are assigned on a predictable schedule and the demo can be run on demand**.
- **AC1 (success)** Given three waiting students, when the Sunday 22:00 run (or "run now") starts, then each is processed through rounds 1–3 and a run record shows the time, the number of assigned students and the number still waiting.
- **AC2 (boundary)** Given a run is already in progress, when "run now" is requested, then the response is 409.
- **AC3 (failure)** Given a non-administrator, when requesting "run now", then the response is 403.
- **AC4** Given students are processed in a defined order (fewest candidate advisors first, then registration time), then the same input always gives the same result with the test seed.

**US-12 — See assigned advisor and reason**
As a **student**, I want to **see my advisor, why we were matched and the advisor's introduction**, so that **I trust the match and know whom to meet**.
- **AC1 (success)** Given a matched student, when opening "My advisor", then the name, introduction, interests, shared interests and the department/year reasons are shown.
- **AC2 (boundary)** Given a waiting student, then the page shows the date of the next matching run.

**US-13 — Students waiting for a match**
As an **administrator**, I want to **see students who could not be matched**, so that **I can add advisors, quota or interests**.
- **AC1 (success)** Given two WAITING_FOR_MATCH students, then both appear with their interests and year.
- **AC2 (failure)** Given a student or advisor, when requesting the list, then the response is 403.

### EP-05 Office hours and appointments

**US-14 — Weekly office hours**
As an **advisor**, I want to **define weekly recurring office hours in 30-minute slots**, so that **students can request times when I am available**.
- **AC1 (success)** Given Tuesday 10:00–11:00, when saving, then two weekly slots (10:00, 10:30) are created.
- **AC2 (failure)** Given a start time not on a 30-minute boundary, then 400; given an overlap with an existing slot, then 409.
- **AC3 (boundary)** Given a slot with a future active appointment, when the advisor deletes it, then the response is 409.

**US-15 — Request an appointment**
As a **student**, I want to **request a free slot of my advisor, in person or online**, so that **I can meet my advisor without exchanging e-mails**.
- **AC1 (success)** Given a matched student with no active appointment and a free future slot, when requesting it in person, then an appointment with status REQUESTED is created and the advisor is e-mailed.
- **AC2 (failure)** Given the slot already has an active appointment, then the response is 409; given two concurrent requests, exactly one succeeds.
- **AC3 (failure)** Given a slot of another advisor, then 403; given the student already has an active appointment, then 409.
- **AC4 (boundary)** Given the advisor does not offer online meetings, when requesting an online meeting, then the response is 400.

**US-16 — Accept or reject a request**
As an **advisor**, I want to **accept or reject appointment requests**, so that **I keep control of my time**.
- **AC1 (success)** Given a REQUESTED appointment, when the advisor accepts, then it becomes CONFIRMED and the student is e-mailed with an .ics file.
- **AC2 (success)** Given a REQUESTED appointment, when the advisor rejects it, then it becomes REJECTED, the slot is free again and the student is e-mailed.
- **AC3 (failure)** Given an appointment of another advisor, or one that is not REQUESTED, then 403 or 409.

**US-17 — Cancel with a reason**
As a **student or advisor**, I want to **cancel an appointment with a reason**, so that **the other side knows and the slot becomes free**.
- **AC1 (success)** Given a CONFIRMED appointment starting in 2 hours, when the student cancels with a reason, then it becomes CANCELLED, the slot is free and the advisor is e-mailed.
- **AC2 (boundary)** Given the appointment starts in 31 minutes, cancellation is accepted; given 29 minutes, the response is 409 (30-minute lock, BR-12).
- **AC3 (failure)** Given no reason, then the response is 400.

**US-18 — Outcome and student list**
As an **advisor**, I want to **see my appointments and students (including GPA) and mark each past appointment as completed or no-show**, so that **I can prepare and keep a record**.
- **AC1 (success)** Given a confirmed appointment whose start time has passed, when the advisor marks it NO_SHOW, then the status changes.
- **AC2 (failure)** Given an appointment that has not started, when marking COMPLETED, then the response is 409.
- **AC3** Given the advisor opens "My students", then only their assigned students are listed, with GPA.

### EP-06 Notifications and calendar

**US-19 — E-mails**
As a **user**, I want to **receive e-mails for verification and appointment events**, so that **I do not miss anything**.
- **AC1 (success)** Given a registration, request, acceptance, rejection or cancellation, then the right recipient gets an e-mail within 1 minute (verified with a test mail server).
- **AC2 (failure)** Given the e-mail service is unavailable, then the operation still succeeds, the status is visible in the system and the failure is logged for retry.

**US-20 — Calendar file**
As a **student or advisor**, I want to **add a confirmed appointment to my calendar**, so that **I do not forget it**.
- **AC1 (success)** Given a CONFIRMED appointment, then the confirmation e-mail contains an .ics file with the correct start, end (30 minutes) and title, and "Add to calendar" downloads the same file.
- **AC2 (failure)** Given an appointment that is not CONFIRMED, then the .ics request returns 409; given another user's appointment, 403.

**US-21 — Google Calendar and Meet**
As an **advisor**, I want to **connect Google Calendar so that a Meet link is created for confirmed online appointments**, so that **I do not create links by hand**.
- **AC1 (success)** Given a connected advisor and an online request, when the advisor accepts, then a Google Meet link is stored on the appointment and shown to both sides.
- **AC2 (failure)** Given Google returns an error, then the appointment is still confirmed and the advisor is asked to enter a link manually.
- **AC3** Given the advisor disconnects Google Calendar, then future online appointments fall back to manual links; when an appointment with a Meet link is cancelled, the calendar event is deleted.

**US-22 — Manual meeting link**
As an **advisor without Google Calendar**, I want to **enter a Zoom, Meet or Teams link**, so that **online meetings still work**.
- **AC1 (success)** Given a confirmed online appointment, when the advisor saves a valid https link, then both sides see it.
- **AC2 (failure)** Given an invalid URL, then the response is 400.

### EP-07 CV

**US-23 — Upload CV**
As a **student**, I want to **upload my CV**, so that **my advisor can prepare for our meeting**.
- **AC1 (success)** Given a 1 MB PDF, when uploading, then it is stored; a second upload replaces the first.
- **AC2 (boundary)** Given a PDF of exactly 2 MB, it is accepted; 2 MB + 1 byte returns 400.
- **AC3 (failure)** Given a .docx file, then the response is 400.

**US-24 — Advisor downloads CV**
As an **assigned advisor**, I want to **download my student's CV**, so that **I can give specific advice**.
- **AC1 (success)** Given the assigned advisor, when downloading, then the PDF is returned.
- **AC2 (failure)** Given another advisor or another student, then the response is 403.

### EP-08 Advisor change

**US-25 — Request a change**
As a **student**, I want to **ask the administrator for a different advisor and explain why**, so that **I can get guidance that fits me better**.
- **AC1 (success)** Given a matched student, reason "field mismatch" and a 40-character explanation, when submitting, then a PENDING request is created.
- **AC2 (boundary)** Given an explanation of 19 characters, then 400; 20 characters is accepted.
- **AC3 (failure)** Given an existing PENDING request, then the response is 409.
- **AC4** Given the student moved to a new year, then "year change" is available as a reason.

**US-26 — Decide and re-match**
As an **administrator**, I want to **approve or reject change requests with a note**, so that **changes are fair and recorded**.
- **AC1 (success)** Given a PENDING request, when approved, then the student is re-matched by the matching rules excluding the previous advisor, future appointments with the previous advisor are cancelled and that advisor is e-mailed.
- **AC2 (boundary)** Given approval but no other advisor has free quota, then the student keeps the current advisor and the request records that no alternative was found.
- **AC3 (failure)** Given a request that is not PENDING, then the response is 409; given a rejection without a note, 400.

## 6. Definition of Ready

A story enters a sprint only when:
1. User, capability and value are explicit.
2. Acceptance criteria are testable, with at least one success and one failure case.
3. Dependencies and API impact are understood, and the operation exists in `openapi.yaml`.
4. The story is 8 points or fewer and can be finished in one sprint.
5. Every open question has a named owner.

## 7. Open questions affecting stories

| Question | Stories | Owner |
|---|---|---|
| Maximum number of interests and the initial interest list (set after collecting every advisor's interests) | US-04, US-06, US-07 | Aybüke |
