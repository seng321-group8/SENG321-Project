# Software Requirements Specification — Career Advisor Matching and Appointment System

| Field | Value |
|---|---|
| Course | SENG 321 / BM 321 Software Engineering |
| Deliverable | Sprint 2 — Software Requirements Specification |
| Team | Team 8 |
| Document owner (Accountable) | Aybüke BALÇIK — Product Owner and Requirements Engineer |
| Reviewer | Fatima Zehra ÖKTEM — Lead Software Architect |
| Related issue | #57 |
| Version | 1.0 (Sprint 2 draft) |
| Sources | `docs/proposal.md`, `docs/vision-boundary.md`, `docs/decision.md` (D-01 to D-27), `docs/backlog.md`, `openapi.yaml` v0.4.0 |

---

## 1. Introduction

### 1.1 Purpose

This document specifies the functional requirements, external interfaces, data and constraints of the first release of the Career Advisor Matching and Appointment System. Developers, testers and the course instructor can use it to understand what the system must do and to trace each requirement to the backlog, the API contract and the tests. Non-functional and security requirements are specified in `docs/nfr.md` (#60) and their quality measures in `docs/quality-measures.md` (#61); Section 6 of this document summarizes and links them.

### 1.2 Scope

Students at Ankara Science University need career guidance (CV, internships, interviews, sector choice, graduate study) but do not know which faculty member can help with which topic, and meetings are arranged informally by e-mail or office visits. In the team's survey (n = 33), 85% of students had wanted career support from a faculty member, but only 12% found it easy to know whom to ask.

The system is a responsive web application that:

- lets students register with their institutional e-mail address and describe their year, department and career interests;
- assigns each student a permanent career advisor through a transparent, rule-based matching run every week;
- lets students request 30-minute appointments in their advisor's office hours, which the advisor confirms or rejects;
- informs both sides by e-mail with a calendar (.ics) file and supports in-person and online meetings;
- lets the administrator manage advisor accounts, quotas, the interest list and advisor change requests.

Out of scope for the first release: a native mobile application, own video infrastructure, AI-based matching, integration with the university identity system, automatic Zoom or Teams links, instant matching when a profile is saved, and appointment reminders (Section 9).

### 1.3 Definitions and abbreviations

| Term | Meaning |
|---|---|
| Student | A user registered with an address of the form `s` + 9-digit student number `@ankarabilim.edu.tr` |
| Advisor | A faculty member who gives career guidance; the account is created by the administrator |
| Administrator (admin) | A trusted user who manages accounts, quotas, the interest list, matching runs and change requests |
| Interest | An item from the predefined interest list, chosen by students and advisors |
| Matching run | The batch process that assigns waiting students to advisors |
| Quota | The maximum number of students that can be assigned to an advisor |
| Office-hour slot | A weekly recurring 30-minute period in which an advisor accepts appointments |
| Active appointment | An appointment with status REQUESTED or CONFIRMED |
| Change request | A student's request to the administrator for a different advisor |
| Explanation | The free text of a change request (D-13) |
| FR / NFR / SEC | Functional / non-functional / security requirement |
| US / BR / D | User story / business rule / decision, as numbered in `backlog.md` and `decision.md` |
| .ics | Standard calendar file format (iCalendar) |
| KVKK | Turkish Personal Data Protection Law |

### 1.4 Conventions

- "The system shall …" states a mandatory requirement.
- **Priority:** **Must** = Sprint 3 MVP (backlog priority P1); **Should** = final submission (backlog priority P2).
- Every requirement lists its source decision (D-xx), its user stories (US-xx) and the API operations (`operationId` in `openapi.yaml`) that realize it.
- All times are in the Europe/Istanbul time zone.

---

## 2. Overall description

### 2.1 Product perspective

The system is a new, self-contained web application. Its context and boundary are defined in `docs/vision-boundary.md` and refined as C4 views in `docs/architecture/c4.md` (#65). It consists of a React web client, a Django REST Framework API backed by PostgreSQL, and a scheduled matching job (D-27). It uses two external services: an e-mail service (verification and notification e-mails) and the Google Calendar API (Meet links for advisors who connect their calendar).

### 2.2 User classes

| User class | Main tasks | How the account is created |
|---|---|---|
| Student | Complete the profile, see the assigned advisor and the reason, request and cancel appointments, upload a CV, request an advisor change | Self-registration with the student e-mail format and verification link |
| Advisor | Complete the profile, define office hours, confirm or reject requests, cancel, mark outcomes, view assigned students and their CVs, connect Google Calendar | Created by the administrator; activated through the verification link |
| Administrator | Manage advisor accounts and quotas, the interest list, matching runs, waiting students and change requests | Added manually by the team |

### 2.3 Operating environment

- Current desktop and mobile browsers (Chrome, Firefox, Safari, Edge); responsive layout for phone and desktop screens (D-01).
- Backend and database run in Docker containers and start with one `docker-compose` command (`docs/architecture/deployment.md`, #66).

### 2.4 Design and implementation constraints

- Technology: Python, Django REST Framework, PostgreSQL; React for the web client (D-27).
- API-first: the REST contract is `openapi.yaml`; the implementation must follow it.
- Only `@ankarabilim.edu.tr` addresses can register (D-14).
- Matching is rule-based and runs as a weekly batch, not when a profile is saved (D-20).
- License: Apache 2.0 (D-05). Project documents are written in English.

### 2.5 Assumptions and dependencies

- The institutional domain and the verification link are sufficient proof of university membership (AS-6).
- Advisors are willing to publish their interests, office hours and a short introduction (AS-2). The initial interest list is collected from advisors with the faculty form (#72).
- E-mail delivery is not guaranteed, so every status is also shown in the system.
- An advisor's Google authorization belongs to the advisor and can be withdrawn; the system then falls back to manual meeting links.

---

## 3. Functional requirements

### 3.1 Registration and access

| ID | Requirement | Priority | Source | Stories | API operations |
|---|---|---|---|---|---|
| FR-01 | The system shall allow self-registration only for addresses matching `^s[0-9]{9}@ankarabilim\.edu\.tr$` and shall create such accounts with the STUDENT role. Any other address shall be rejected (400); an address already registered shall be rejected (409). | Must | D-14 | US-01 | `registerStudent` |
| FR-02 | The system shall require a password of at least 8 characters at registration. | Must | D-14 | US-01 | `registerStudent` |
| FR-03 | The system shall keep a new account inactive and send a verification link by e-mail; the account shall become active only when a valid, unused link is opened. Expired or used links shall be rejected. | Must | D-14, D-19 | US-02 | `verifyEmail` |
| FR-04 | The system shall allow a user to request a new verification link and shall limit repeated requests (429). | Must | D-14 | US-02 | `resendVerification` |
| FR-05 | The system shall authenticate verified users with e-mail and password, reject unverified accounts (403) and wrong credentials (401), and show the screens of the user's role. | Must | D-14 | US-03 | `login` |
| FR-06 | The system shall authorize every protected operation by role (student, advisor, admin) and by ownership; an operation outside the user's rights shall return 403. | Must | D-14, D-26 | all | all protected operations |

### 3.2 Administration

| ID | Requirement | Priority | Source | Stories | API operations |
|---|---|---|---|---|---|
| FR-07 | The system shall allow the administrator to create advisor accounts with an address in the format first.last or f.last `@ankarabilim.edu.tr`; a verification e-mail shall be sent to the advisor. | Must | D-14 | US-05 | `createAdvisorAccount`, `listAdvisors` |
| FR-08 | The system shall give each new advisor a quota of 20 students and allow the administrator to change it; a quota below the advisor's current number of students shall be rejected (409). | Must | D-17 | US-05 | `updateAdvisorQuota` |
| FR-09 | The system shall allow the administrator to add, rename and deactivate interests; duplicate names (case-insensitive) shall be rejected (409). A deactivated interest shall not be offered for new selections but shall stay on existing profiles and still count in matching. | Must | D-25 | US-04 | `listInterests`, `createInterest`, `updateInterest` |
| FR-10 | The system shall let the administrator configure the maximum number of interests per user (5, D-25). | Must | D-25 | US-04, US-06, US-07 | configuration |

### 3.3 Profiles

| ID | Requirement | Priority | Source | Stories | API operations |
|---|---|---|---|---|---|
| FR-11 | The system shall allow a student to save a profile with year (1–4), department (from the list), GPA (0.00–4.00) and between 1 and the configured maximum of interests from the list. Invalid values shall be rejected (400). A student with a saved profile and no advisor shall be marked as waiting for a match. | Must | D-25 | US-06 | `listDepartments`, `getMyStudentProfile`, `saveMyStudentProfile` |
| FR-12 | The system shall allow an advisor to save a profile with department, the years served (any combination of 1–4), between 1 and the configured maximum of interests, a short introduction text and whether online meetings are offered. | Must | D-22 | US-07 | `getMyAdvisorProfile`, `saveMyAdvisorProfile` |
| FR-13 | Changes to an advisor's interests or years served shall not change existing assignments; they shall apply only to future matching runs. | Must | D-23 | US-07 | `saveMyAdvisorProfile` |

### 3.4 Weekly matching

| ID | Requirement | Priority | Source | Stories | API operations |
|---|---|---|---|---|---|
| FR-14 | The system shall run matching automatically every Sunday at 22:00 for all students waiting for a match, and shall let the administrator start a run manually. A manual request while a run is in progress shall be rejected (409). | Must | D-20 | US-11 | `runMatchingNow` |
| FR-15 | The system shall compute the score of an advisor for a student as 2 × (number of shared interests) + 1 if the department is the same + 1 if the advisor serves the student's year. GPA shall not affect the score. | Must | D-20 | US-08 | internal (matching engine) |
| FR-16 | The system shall consider only advisors with free quota and assign each student in three rounds: **Round 1** — advisors who serve the student's year and share at least one interest, highest score first; **Round 2** — the year condition is dropped; **Round 3** — interests are ignored and the advisor with the most free quota is chosen, preferring the student's department. | Must | D-20 | US-08, US-09, US-10 | internal |
| FR-17 | Ties in rounds 1 and 2 shall go to the advisor with fewer current students; ties in round 3 shall be broken randomly with a seed that can be fixed in tests. Student counts shall be updated during the run. | Must | D-20 | US-08, US-10 | internal |
| FR-18 | The system shall process students in order of fewest candidate advisors first, then by registration time, so that the same input with the same seed always gives the same result. | Must | D-20 | US-11 | internal |
| FR-19 | A student for whom no advisor has free quota shall stay waiting for a match. The assigned advisor shall be permanent unless an approved change request replaces it (FR-37). | Must | D-20 | US-10, US-11 | internal |
| FR-20 | The system shall record each run with its start time, trigger (scheduled or manual), number of students assigned and number still waiting, and shall show the run history to the administrator. | Must | D-20 | US-11 | `listMatchingRuns` |
| FR-21 | The system shall show a matched student the advisor's name, introduction and interests and the reasons for the match (shared interests, same department, year served); a waiting student shall see the date of the next run. | Must | D-24 | US-12 | `getMyAdvisor` |
| FR-22 | The system shall show the administrator the list of students waiting for a match with their year and interests. | Must | D-20 | US-13 | `listWaitingStudents` |

### 3.5 Office hours and appointments

| ID | Requirement | Priority | Source | Stories | API operations |
|---|---|---|---|---|---|
| FR-23 | The system shall allow an advisor to define weekly recurring office hours, divided into 30-minute slots starting on a 30-minute boundary; overlapping slots shall be rejected (409). An office hour with a future active appointment shall not be deletable (409). | Must | D-08 | US-14 | `listMyOfficeHours`, `createOfficeHour`, `deleteOfficeHour` |
| FR-24 | The system shall show a matched student the free future slots of the assigned advisor only. | Must | D-18 | US-15 | `listAvailableSlots` |
| FR-25 | The system shall allow a matched student to request a free slot as an in-person or online meeting; the appointment shall be created with status REQUESTED. Online shall be possible only if the advisor offers it (400 otherwise). | Must | D-15, D-18 | US-15 | `requestAppointment`, `getAppointment` |
| FR-26 | A slot shall hold at most one active appointment and a student shall have at most one active appointment; a conflicting request shall be rejected (409), and of two concurrent requests for the same slot exactly one shall succeed. | Must | D-18 | US-15 | `requestAppointment` |
| FR-27 | The system shall allow the assigned advisor to confirm (status CONFIRMED) or reject (status REJECTED) a REQUESTED appointment; a rejected appointment shall free the slot. Only REQUESTED appointments can be decided (409 otherwise). | Must | D-18 | US-16 | `confirmAppointment`, `rejectAppointment` |
| FR-28 | The system shall allow the student or the advisor to cancel a REQUESTED or CONFIRMED appointment with a written reason; the status shall become CANCELLED and the slot shall become free. A cancellation without a reason shall be rejected (400). | Must | D-18 | US-17 | `cancelAppointment` |
| FR-29 | The system shall reject a cancellation by either side within 30 minutes of the start of the appointment (409). | Must | D-18 | US-17 | `cancelAppointment` |
| FR-30 | The system shall allow the advisor to mark a CONFIRMED appointment whose start time has passed as COMPLETED or NO_SHOW; marking an appointment that has not started shall be rejected (409). | Must | D-09 | US-18 | `markAppointmentOutcome` |
| FR-31 | The system shall show students and advisors their appointments with status, and shall show an advisor the list of assigned students including GPA. | Must | D-26 | US-18 | `listAppointments`, `listMyStudents` |

### 3.6 Notifications, calendar and online meetings

| ID | Requirement | Priority | Source | Stories | API operations |
|---|---|---|---|---|---|
| FR-32 | The system shall send e-mails for account verification, a new appointment request (to the advisor), confirmation or rejection (to the student) and cancellation (to the other side). A failed e-mail shall not cancel the operation; it shall be logged for retry. | Must | D-19 | US-19 | internal (e-mail service) |
| FR-33 | The confirmation e-mail shall include an .ics file with the correct start, a 30-minute end and a title, and the appointment page shall offer the same file through "Add to calendar". The file shall be available only for CONFIRMED appointments and only to the two participants. | Must | D-19 | US-20 | `downloadAppointmentCalendar` |
| FR-34 | The system shall allow an advisor to connect and disconnect Google Calendar. When a connected advisor confirms an online appointment, the system shall create a Google Meet link and show it to both sides; when such an appointment is cancelled, the calendar event shall be deleted. If Google returns an error, the appointment shall still be confirmed and the advisor asked for a manual link. | Should | D-15 | US-21 | `getGoogleCalendarStatus`, `startGoogleCalendarConnect`, `completeGoogleCalendarConnect`, `disconnectGoogleCalendar` |
| FR-35 | The system shall allow an advisor to enter a valid https meeting link (Zoom, Meet or Teams) for a confirmed online appointment. | Should | D-15 | US-22 | `confirmAppointment` (`meetingLink`) |

### 3.7 CV

| ID | Requirement | Priority | Source | Stories | API operations |
|---|---|---|---|---|---|
| FR-36 | The system shall allow a student to upload, replace, download and delete one CV as a PDF of at most 2 MB; other file types or larger files shall be rejected (400). Only the student and the assigned advisor shall be able to download it (403 for anyone else). | Should | D-16, D-26 | US-23, US-24 | `uploadMyCv`, `downloadMyCv`, `deleteMyCv`, `downloadStudentCv` |

### 3.8 Advisor change

| ID | Requirement | Priority | Source | Stories | API operations |
|---|---|---|---|---|---|
| FR-37 | The system shall allow a matched student to send a change request with a reason (time conflict, field mismatch, communication issue, year change, other) and an explanation of at least 20 characters; only one PENDING request per student shall be allowed (409). | Should | D-21 | US-25 | `createAdvisorChangeRequest`, `listAdvisorChangeRequests` |
| FR-38 | The system shall allow the administrator to approve or reject a PENDING request with a note. On approval, the student shall be re-matched with the matching rules excluding the previous advisor, and future appointments with the previous advisor shall be cancelled with notification; if no other advisor has free quota, the student shall keep the current advisor and the request shall record that no alternative was found. | Should | D-21 | US-26 | `decideAdvisorChangeRequest` |
| FR-39 | Moving to a new year shall not trigger re-matching automatically; the student may send a change request with the reason "year change". | Should | D-21 | US-25 | `createAdvisorChangeRequest` |

### 3.9 Privacy

| ID | Requirement | Priority | Source | Stories | API operations |
|---|---|---|---|---|---|
| FR-40 | GPA shall be visible only to the student and the assigned advisor; the CV only to the student and the assigned advisor; the explanation of a change request only to the student and administrators. | Must | D-26 | US-18, US-24, US-25 | `listMyStudents`, `downloadStudentCv`, `listAdvisorChangeRequests` |

---

## 4. External interface requirements

### 4.1 User interfaces

- The web client shall be responsive and usable on phone and desktop screens (D-01).
- Screens and user flows are designed in Figma: `docs/ux/user-flows.md` (#62), `docs/ux/student-screens.md` (#63), `docs/ux/advisor-admin-screens.md` (#64).
- Each role sees only its own menu: student (profile, my advisor, appointments, CV, change request), advisor (profile, office hours, requests, appointments, my students, Google Calendar), administrator (advisors and quotas, interest list, matching runs, waiting students, change requests).
- Error messages shall be shown in plain language next to the related field.

### 4.2 Software interfaces

| Interface | Purpose | Data exchanged |
|---|---|---|
| REST API (`openapi.yaml` v0.4.0) | Contract between the web client and the backend | JSON over HTTPS; JWT bearer token for protected operations; errors use the common `Error` object |
| E-mail service (SMTP) | Verification and appointment e-mails | Recipient, subject, body, .ics attachment |
| Google Calendar API (OAuth 2.0) | Meet links for advisors who connect their calendar | Advisor consent and tokens; event title, start and end; Meet link and event ID |

### 4.3 Communication interfaces

- All traffic between the browser and the API shall use HTTPS in deployment; HTTP is used only on the local development machine.
- The API base path is `/api/v1`.

---

## 5. Data requirements

The main data entities are listed below. Their attributes, keys and relationships are specified in the class diagram and database schema (`docs/architecture/class-diagram.md`, #69) and use the same names as the schemas in `openapi.yaml`.

| Entity | Key data | Rules |
|---|---|---|
| User | e-mail, password hash, role, verified flag | Role derived from the e-mail format; advisors created by the admin |
| StudentProfile | year, department, GPA, interests, match status, assigned advisor, registration time | GPA private (FR-40) |
| AdvisorProfile | department, years served, interests, introduction, offers online, quota, current student count | Quota ≥ current count |
| Interest | name, active flag | Unique name (case-insensitive) |
| Department | name | Predefined list |
| MatchingRun | start time, trigger, assigned count, waiting count, seed | One run at a time |
| OfficeHour | advisor, weekday, start time, end time, location | Weekly rule; duration a multiple of 30 minutes; no overlap; free 30-minute slots are computed, not stored |
| Appointment | student, advisor, office hour, start time, meeting type, status, meeting link, cancellation reason, calendar event ID | Status values: REQUESTED, CONFIRMED, REJECTED, CANCELLED, COMPLETED, NO_SHOW |
| CV | student, file, size, upload time | One per student, PDF ≤ 2 MB |
| AdvisorChangeRequest | student, previous advisor, reason, explanation, status, admin note, result | Status values: PENDING, APPROVED, REJECTED; one PENDING per student |
| GoogleCalendarConnection | advisor, encrypted tokens | Deleted when the advisor disconnects |

Personal data (GPA, CV, explanations) is processed only for the purposes above, in line with KVKK (D-26).

### 5.1 Appointment status rules

| From | To | Who | Condition |
|---|---|---|---|
| — | REQUESTED | Student | Free slot of the assigned advisor; no other active appointment |
| REQUESTED | CONFIRMED | Advisor | — |
| REQUESTED | REJECTED | Advisor | — |
| REQUESTED or CONFIRMED | CANCELLED | Student or advisor | Reason given; more than 30 minutes before the start |
| CONFIRMED | COMPLETED or NO_SHOW | Advisor | Start time has passed |

---

## 6. Non-functional and security requirements (summary)

The detailed, numbered and measurable requirements are in `docs/nfr.md` (#60, NFR-xx and SEC-xx) and their metrics in `docs/quality-measures.md` (#61). The categories that this SRS depends on are:

| Category | What it must cover |
|---|---|
| Performance | Response time of the main API operations; duration of a weekly matching run |
| Availability and reliability | Behavior when the e-mail service or Google Calendar is unavailable (FR-32, FR-34) |
| Usability | Responsive layout; main tasks reachable in a few steps |
| Maintainability and testability | At least 50% unit-test coverage; deterministic matching tests with a fixed seed (FR-17) |
| Security | Password storage, token expiry, role and ownership checks (FR-06), rate limiting (FR-04), file-type checks (FR-36) |
| Privacy | Visibility rules of FR-40; KVKK |
| Portability | One-command `docker-compose` start |

---

## 7. Business rules

The business rules BR-1 to BR-18 in `docs/backlog.md` (Section 2) are part of this specification. Each rule is realized by at least one functional requirement above.

---

## 8. Traceability

| FR | Decision | Stories | Use case (`docs/use-cases.md`) |
|---|---|---|---|
| FR-01 – FR-05 | D-14, D-19 | US-01, US-02, US-03 | UC-01, UC-02, UC-03 |
| FR-06 | D-14, D-26 | all | all |
| FR-07, FR-08 | D-14, D-17 | US-05 | UC-04 |
| FR-09, FR-10 | D-25 | US-04 | UC-05 |
| FR-11 | D-25 | US-06 | UC-06 |
| FR-12, FR-13 | D-22, D-23 | US-07 | UC-07 |
| FR-14 – FR-20 | D-20 | US-08 – US-11 | UC-08 |
| FR-21 | D-24 | US-12 | UC-09 |
| FR-22 | D-20 | US-13 | UC-10 |
| FR-23 | D-08 | US-14 | UC-11 |
| FR-24 – FR-26 | D-15, D-18 | US-15 | UC-12 |
| FR-27 | D-18 | US-16 | UC-13 |
| FR-28, FR-29 | D-18 | US-17 | UC-14 |
| FR-30, FR-31 | D-09, D-26 | US-18 | UC-15 |
| FR-32, FR-33 | D-19 | US-19, US-20 | UC-12, UC-13, UC-14 |
| FR-34, FR-35 | D-15 | US-21, US-22 | UC-16 |
| FR-36 | D-16, D-26 | US-23, US-24 | UC-17 |
| FR-37 – FR-39 | D-21 | US-25, US-26 | UC-18, UC-19 |
| FR-40 | D-26 | US-18, US-24, US-25 | UC-15, UC-17, UC-18 |

The full mapping from functional requirements to use cases is in `docs/use-cases.md` (#58); the mapping to API operations is in the tables of Section 3; the mapping to tests is in `docs/test-scenario-matrix.md`.

---

## 9. Open issues

| Issue | Affects | Owner | Planned resolution |
|---|---|---|---|
| Final maximum number of interests per user and the initial interest list | FR-09 – FR-12 | Aybüke | Resolved in #83 (D-25: 44 interests, maximum 5) |
| Appointment reminders and automatic expiry of unanswered requests | FR-32 | Aybüke | Deferred; decided after the first release |
| The change reason "year change" is named `grade_change` in `openapi.yaml` | FR-37, FR-39 | Fatima | Resolved in #70 (`year_change`) |
| No operation for entering a manual meeting link (the appointment PATCH accepts only the outcome status) | FR-35 | Fatima | Resolved in #70 (`meetingLink` in `confirmAppointment`) |
