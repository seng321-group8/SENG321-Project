# Initial Product Backlog — Career Advisor Matching and Appointment System

| Field | Value |
|---|---|
| Deliverable | Sprint 1 — Initial product backlog |
| Document owner (Accountable) | Aybüke — Product Owner |
| Acceptance criteria | Ebrar — QA Engineer (review and completion) |
| Feasibility and API impact | Emine — Implementation Engineer, Fatima Zehra — Architect |
| Capacity check | Nil — Scrum Master |
| Related issue | #17 |
| Team | Team 8 |
| Tool | GitHub Projects — "SENG 321 - Sprint 1 Project Board" (one issue per story) |
| Status | Draft for Sprint 1 review |

> API operation names in this backlog are **proposed**. They must match the
> `operationId` values in `openapi.yaml`; Emine's story-to-operation mapping
> will confirm or correct them.

## 1. Estimation and priority

- **Story points** measure relative size (effort, complexity, uncertainty). They
  are **not hours**. Scale: 1, 2, 3, 5, 8, 13. Reference story: **US-08 (student
  sees assigned advisor) = 2**. Stories larger than 8 are split.
- **Priority:**
  - **P1 Must** — needed for the core journey (Sprint 3 MVP).
  - **P2 Should** — needed for the complete first release (final submission).
  - **P3 Could** — valuable but can be dropped if time runs out.

## 2. Business rules

| ID | Rule |
|---|---|
| BR-1 | Roles: STUDENT, ADVISOR, ADMIN. Each user has exactly one role. |
| BR-2 | Student profile: class 1–4; department from a fixed list; GPA 0.00–4.00 with two decimals; 1–5 keywords from the keyword list. |
| BR-3 | Advisor profile: 1–10 keywords; one or more classes served (1–4); office location; capacity set by the administrator (default 30). |
| BR-4 | Matching candidates share at least one keyword with the student and are below capacity. |
| BR-5 | Score = 2 × shared keywords + 1 (same department) + 1 (advisor serves the student's class). Highest score wins; ties → fewer assigned students → lowest advisor ID. GPA is not used. |
| BR-6 | No candidate → student status WAITING_FOR_MATCH, visible to the administrator. |
| BR-7 | An office-hour slot is 30 minutes, cannot start in the past, and holds at most one active appointment. |
| BR-8 | A student books only their assigned advisor's slots and has at most one active (BOOKED) appointment. |
| BR-9 | A student may cancel a BOOKED appointment until 2 hours before its start. |
| BR-10 | Appointment statuses: BOOKED → COMPLETED / CANCELLED / NO_SHOW. Only the advisor marks COMPLETED or NO_SHOW, after the start time. |
| BR-11 | Advisor change request: reason category (TIME_CONFLICT, FIELD_MISMATCH, COMMUNICATION, OTHER) + explanation of at least 20 characters; at most one PENDING request per student. |
| BR-12 | On approval, the student is re-matched excluding the previous advisor; future BOOKED appointments with the previous advisor are cancelled and that advisor is e-mailed. |
| BR-13 | GPA is visible only to the student and the assigned advisor. Change-request reasons are visible only to the student and administrators. |

## 3. Epics and features

| Epic | Features | Stories |
|---|---|---|
| EP-01 Access and profiles | F-01 Sign-in and roles; F-02 Student profile; F-03 Advisor profile | US-01, US-02, US-03 |
| EP-02 Administration | F-04 Keyword list; F-05 Advisor accounts | US-04, US-05 |
| EP-03 Advisor matching | F-06 Automatic matching; F-07 Unmatched students | US-06, US-07, US-08 |
| EP-04 Office hours and appointments | F-08 Office-hour slots; F-09 Booking; F-10 Appointment outcome | US-09, US-10, US-11, US-12 |
| EP-05 Notifications and calendar | F-11 E-mail notification; F-12 Calendar file | US-13, US-14 |
| EP-06 Advisor change | F-13 Change request; F-14 Request decision | US-15, US-16 |

## 4. Backlog overview (priority order)

| Order | ID | Feature | Story (short) | Priority | SP | Depends on | Owner | Proposed API operations |
|---:|---|---|---|---|---:|---|---|---|
| 1 | US-01 | F-01 | Sign in and see role-based screens | P1 | 3 | — | Emine | `login`, `getCurrentUser` |
| 2 | US-04 | F-04 | Admin manages keyword list | P1 | 3 | US-01 | Emine | `listKeywords`, `createKeyword`, `updateKeyword` |
| 3 | US-05 | F-05 | Admin creates advisor accounts and capacity | P1 | 3 | US-01 | Emine | `createAdvisor`, `updateAdvisor` |
| 4 | US-03 | F-03 | Advisor sets keywords and classes served | P1 | 2 | US-04, US-05 | Emine | `updateMyAdvisorProfile` |
| 5 | US-02 | F-02 | Student completes profile | P1 | 3 | US-01, US-04 | Emine | `updateMyStudentProfile` |
| 6 | US-06 | F-06 | System assigns an advisor automatically | P1 | 5 | US-02, US-03 | Fatima Zehra | `requestMatch` |
| 7 | US-08 | F-06 | Student sees assigned advisor | P1 | 2 | US-06 | Emine | `getMyAdvisor` |
| 8 | US-09 | F-08 | Advisor manages office-hour slots | P1 | 3 | US-03 | Emine | `listMySlots`, `createSlot`, `deleteSlot` |
| 9 | US-10 | F-09 | Student books a slot | P1 | 5 | US-08, US-09 | Fatima Zehra | `listAdvisorSlots`, `createAppointment` |
| 10 | US-13 | F-11 | Advisor receives booking e-mail | P1 | 3 | US-10 | Yağız | (internal; triggered by `createAppointment`) |
| 11 | US-11 | F-09 | Student views and cancels appointments | P2 | 3 | US-10 | Emine | `listMyAppointments`, `cancelAppointment` |
| 12 | US-12 | F-10 | Advisor views appointments and marks outcome | P2 | 3 | US-10 | Emine | `listMyAppointments`, `updateAppointmentStatus` |
| 13 | US-07 | F-07 | Admin sees students waiting for a match | P2 | 2 | US-06 | Emine | `listUnmatchedStudents` |
| 14 | US-14 | F-12 | Calendar file in e-mail and "Add to calendar" | P2 | 2 | US-13 | Yağız | `getAppointmentCalendarFile` |
| 15 | US-15 | F-13 | Student requests advisor change with reason | P2 | 3 | US-08 | Emine | `createAdvisorChangeRequest` |
| 16 | US-16 | F-14 | Admin decides on change request; re-matching | P2 | 5 | US-15, US-06 | Fatima Zehra | `listAdvisorChangeRequests`, `decideAdvisorChangeRequest` |
| | | | **Total** | | **50** | | | |

P1 total: 32 points (Sprint 3 MVP). P2 total: 18 points (final submission).
No P3 stories in the first release; deferred ideas are listed in Section 7.

"Owner" is the team member accountable for delivering the story; any member
may implement it. Ebrar writes or reviews the tests of every story. Owners are
proposals and will be confirmed at Sprint 3 planning.

## 5. Story details

Acceptance criteria are written as Given / When / Then. They are a Product
Owner draft and are completed and approved together with Ebrar (QA).

### US-01 — Sign in and see role-based screens
As a **user (student, advisor or administrator)**, I want to **sign in with my
e-mail and password**, so that **I only see the functions of my role**.
- **AC1** Given a registered student, when they sign in with correct credentials, then they are signed in and see the student home page.
- **AC2** Given wrong credentials, when signing in, then the response is 401 and no session is created.
- **AC3** Given a signed-in student, when they call an administrator operation, then the response is 403.

### US-02 — Student completes profile
As a **student**, I want to **enter my class, department, GPA and keywords**,
so that **the system can match me with a suitable advisor**.
- **AC1** Given class 3, department "Computer Engineering", GPA 3.20 and keywords *Internship, Software*, when the student saves the profile, then it is stored and shown on the profile page.
- **AC2** Given GPA 4.50 or class 5, when saving, then the response is 400 with an error on that field.
- **AC3** Given 0 or 6 keywords, or a keyword that is not in the list, when saving, then the response is 400.

### US-03 — Advisor sets keywords and classes served
As an **advisor**, I want to **select my keywords and the classes I serve**, so
that **I receive students whose needs match my experience**.
- **AC1** Given 1–10 valid keywords and classes 3 and 4, when the advisor saves, then the profile is updated.
- **AC2** Given 11 keywords or no class, when saving, then the response is 400.

### US-04 — Admin manages keyword list
As an **administrator**, I want to **add, rename and deactivate keywords**, so
that **students and advisors describe needs with the same words**.
- **AC1** Given a new keyword "Portfolio", when the admin adds it, then it appears in the list for students and advisors.
- **AC2** Given a keyword that already exists (case-insensitive), when adding it, then the response is 409.
- **AC3** Given a deactivated keyword, then it is no longer offered for new selections but existing profiles keep it.

### US-05 — Admin creates advisor accounts and capacity
As an **administrator**, I want to **create advisor accounts and set their
capacity**, so that **only authorised faculty members advise students and
workload stays fair**.
- **AC1** Given a name, e-mail and capacity 25, when the admin creates an advisor, then the account exists with capacity 25.
- **AC2** Given an e-mail already in use, then the response is 409.
- **AC3** Given capacity 0 or negative, then the response is 400.

### US-06 — System assigns an advisor automatically
As a **student**, I want **the system to assign the most suitable advisor
automatically**, so that **I do not have to guess whom to ask**.
- **AC1** Given a student with *Internship, Software, Interview* and advisors A (*CV, Internship, Software*), B (*Internship, Interview, Software*), when matching runs, then B is assigned (score 6 > 4).
- **AC2** Given two advisors with the same score, then the one with fewer assigned students is assigned; if still equal, the lower advisor ID.
- **AC3** Given an advisor at full capacity, then that advisor is never assigned.
- **AC4** Given same department or class served, then the score increases by 1 for each, as defined in BR-5.
- **AC5** Given no advisor with a shared keyword, then the student status is WAITING_FOR_MATCH and no advisor is assigned.
- **AC6** Given an incomplete profile, when matching is requested, then the response is 409 and no assignment is made.

### US-07 — Admin sees students waiting for a match
As an **administrator**, I want to **see students who could not be matched**,
so that **I can add advisors or keywords to help them**.
- **AC1** Given two students in WAITING_FOR_MATCH, when the admin opens the list, then both appear with their keywords.
- **AC2** Given a student or advisor token, when requesting the list, then the response is 403.

### US-08 — Student sees assigned advisor
As a **student**, I want to **see my assigned advisor and why they were
assigned**, so that **I know whom to meet**.
- **AC1** Given a matched student, when opening "My advisor", then the advisor's name, shared keywords and office location are shown.
- **AC2** Given an unmatched student, then the page states that a match is pending.

### US-09 — Advisor manages office-hour slots
As an **advisor**, I want to **add and remove 30-minute office-hour slots**, so
that **students can book times when I am available**.
- **AC1** Given a future start time, when the advisor adds a slot, then a 30-minute slot is created.
- **AC2** Given a start time in the past, or overlapping an existing slot of the same advisor, then the response is 400 or 409 respectively.
- **AC3** Given a slot that is already booked, when the advisor deletes it, then the response is 409.

### US-10 — Student books a slot
As a **student**, I want to **book a free office-hour slot of my advisor**, so
that **I can meet them without exchanging e-mails**.
- **AC1** Given a matched student with no active appointment and a free slot of their advisor, when booking, then the response is 201 and the appointment is BOOKED.
- **AC2** Given a slot that is already booked, then the response is 409.
- **AC3** Given a slot belonging to another advisor, then the response is 403.
- **AC4** Given the student already has a BOOKED appointment, then the response is 409.
- **AC5** Given two concurrent requests for the same slot, then exactly one succeeds and the other receives 409.

### US-11 — Student views and cancels appointments
As a **student**, I want to **see my appointments and cancel one**, so that **I
can free the slot for others if I cannot attend**.
- **AC1** Given a BOOKED appointment starting in 5 hours, when the student cancels, then it becomes CANCELLED and the slot is free again.
- **AC2** Given an appointment starting in 1 hour, when cancelling, then the response is 409.
- **AC3** Given another student's appointment, when cancelling, then the response is 403.

### US-12 — Advisor views appointments and marks outcome
As an **advisor**, I want to **see my upcoming appointments with student
details and mark each as completed or no-show**, so that **I can prepare and
keep an accurate record**.
- **AC1** Given an assigned student's appointment, when the advisor opens it, then class, department, GPA and keywords are shown.
- **AC2** Given an appointment whose start time has passed, when the advisor marks it NO_SHOW, then the status changes.
- **AC3** Given an appointment that has not started, when marking COMPLETED, then the response is 409.

### US-13 — Advisor receives booking e-mail
As an **advisor**, I want to **receive an e-mail when a student books or cancels
an appointment**, so that **I am informed without checking the system**.
- **AC1** Given a successful booking, then an e-mail with student name, date, time and topic keywords is sent to the advisor within 1 minute (verified with a test mail server).
- **AC2** Given a cancellation, then a cancellation e-mail is sent.
- **AC3** Given the mail service is unavailable, then the booking still succeeds and the failure is logged for retry.

### US-14 — Calendar file
As an **advisor or student**, I want to **add the appointment to my calendar**,
so that **I do not forget it**.
- **AC1** Given a booking e-mail, then it contains an .ics attachment with the correct start, end and title.
- **AC2** Given a BOOKED appointment, when the user selects "Add to calendar", then the same .ics file is downloaded.
- **AC3** Given an appointment of another user, when requesting its file, then the response is 403.

### US-15 — Student requests advisor change with reason
As a **student**, I want to **ask the administrator for a different advisor and
explain why**, so that **I can get guidance that fits me better**.
- **AC1** Given a matched student, a reason category and a 40-character explanation, when submitting, then a PENDING request is created.
- **AC2** Given an explanation shorter than 20 characters, then the response is 400.
- **AC3** Given an existing PENDING request, when submitting another, then the response is 409.

### US-16 — Admin decides on change request; re-matching
As an **administrator**, I want to **approve or reject change requests with a
note**, so that **advisor changes are fair and recorded**.
- **AC1** Given a PENDING request, when the admin approves, then the student is re-matched excluding the previous advisor, future BOOKED appointments with the previous advisor are CANCELLED, and that advisor is e-mailed.
- **AC2** Given the admin rejects with a note, then the request is REJECTED and the student keeps the current advisor.
- **AC3** Given a request that is not PENDING, when deciding, then the response is 409.
- **AC4** Given approval but no other candidate advisor, then the student becomes WAITING_FOR_MATCH.

## 6. Definition of Ready

A story enters a sprint only when:
1. User, capability and value are explicit.
2. Acceptance criteria are testable and include at least one success and one failure case.
3. Dependencies and API impact are understood and the operation exists in `openapi.yaml`.
4. The story is 8 points or fewer and can be finished in one sprint.
5. Every open question has a named owner.

## 7. Deferred ideas (not in the first release)

| Idea | Note |
|---|---|
| Video meeting link on appointments | Decision recorded in `docs/decision.md`. |
| CV upload (PDF) | Decision recorded in `docs/decision.md`. |
| Mobile application | Same API can be reused. |
| Topic statistics report for the administrator | Possible P3 after the first release. |
