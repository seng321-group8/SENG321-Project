# Requirements Traceability and Consistency Review

| Field | Value |
|---|---|
| Project | Career Advisor Matching and Appointment System (SENG 321, Team 8) |
| Sprint | Sprint 2 |
| Related issue | #57 |
| Owner | Aybüke BALÇIK — Product Owner and Requirements Engineer |
| Reviewer | Fatima Zehra ÖKTEM — Lead Software Architect |
| Baseline | SRS 1.1, `openapi.yaml` 0.5.0, release `sprint-2` |

## 1. Purpose

This document connects the Sprint 2 artifacts with each other: stakeholder goals, SRS requirements, backlog stories, OpenAPI operations, Figma screens, C4 components, UML views, planned tests and quality measures. It also records the verification method of every functional requirement and a consistency review of one normal path and two failure paths across all artifacts. Contradictions found in the review are listed as revision items in Section 6.

Sources:

| Artifact | File |
|---|---|
| Goals (success criteria SC-1 … SC-8) | `docs/proposal.md` |
| Requirements (FR-01 … FR-40) | `docs/srs.md` |
| Stories and acceptance criteria (US-01 … US-26) | `docs/backlog.md` |
| Non-functional and security requirements | `docs/nfr.md` |
| Quality measures (QM-01 … QM-10) | `docs/quality-measures.md` |
| Planned tests (T-xx-nn) | `docs/test-scenario-matrix.md` |
| API contract | `openapi.yaml` |
| Prototype | `docs/ux/user-flows.md`, `docs/ux/student-screens.md`, `docs/ux/advisor-admin-screens.md` |
| Architecture | `docs/architecture/c4.md`, `sequence-auth-matching.md`, `appointment-change.md`, `class-diagram.md`, `deployment.md` |

## 2. Goal-to-test traceability

Screen names are the Figma frames exported to `docs/ux` (student screens S1–S5, advisor screens A1–A3, administrator screens B1–B3; see Section 4). Components are the Level 3 components of the REST API in `c4.md`.

| Goal | Requirement | Story | API operation and key responses | Screen | C4 component | UML view | Planned tests | Quality measure |
|---|---|---|---|---|---|---|---|---|
| SC-1 Fast onboarding | FR-01 – FR-05 | US-01 – US-03 | `registerStudent` (201, 400, 409), `verifyEmail`, `resendVerification` (429), `login` (401) | S1 Log in, S1b Register | Auth and Identity | `sequence-auth-matching.md` §1, §2 | T-EV-01 … T-EV-10 | QM-04, QM-06 |
| SC-7 Data protection | FR-06 | all | every protected operation (401, 403) | all screens (role-based navigation) | Access Control | `sequence-auth-matching.md` §2 | T-AA-06, T-PR-04 | QM-06 (SEC-03, SEC-04) |
| Administration ready | FR-07 – FR-10 | US-04, US-05 | `createAdvisorAccount`, `updateAdvisorQuota` (409 below current count), `createInterest` (409 duplicate), `updateInterest` | B1 Quotas and matching, B3 Interest list | Administration | `class-diagram.md` §3 (quota constraint) | T-AA-01 … T-AA-05 | — |
| Matching input | FR-11 – FR-13 | US-06, US-07 | `saveMyStudentProfile` (400), `saveMyAdvisorProfile` | S2 Profile, A1 Advisor profile and office hours | Profiles | `sequence-auth-matching.md` §3 | T-SP-01 … T-SP-06, T-AV-01 … T-AV-03 | QM-04 |
| SC-2, SC-3 Correct matching for everyone | FR-14 – FR-20 | US-08 – US-11 | `runMatchingNow` (202, 409 run in progress), `listMatchingRuns`; internal matching engine | B1 Quotas and matching | Matching (+ scheduler container) | `sequence-auth-matching.md` §4; `deployment.md` (scheduler) | T-AM-01 … T-AM-11 | QM-02 (NFR-02) |
| Student sees the result | FR-21, FR-22 | US-12, US-13 | `getMyAdvisor` (404 while waiting), `listWaitingStudents` | S3 My advisor, S3b Waiting for a match, B1 | Profiles, Matching | `sequence-auth-matching.md` §4 | T-AM-12, T-AM-13 | — |
| Bookable time | FR-23 | US-14 | `createOfficeHour` (400 grid, 409 overlap), `deleteOfficeHour` (409 booked slot) | A1 | Office Hours | `class-diagram.md` §3 (office-hour rules) | T-AP-01 | — |
| SC-4 Fast request | FR-24, FR-25 | US-15 | `listAvailableSlots`, `requestAppointment` (201, 400 `INVALID_START_TIME` / `ONLINE_NOT_OFFERED`, 403) | S4 Appointments | Office Hours, Appointments | `appointment-change.md` §1 | T-AP-02, T-AP-03, T-AP-06, T-AP-07 | QM-08 (NFR-05) |
| SC-5 No double booking | FR-26 | US-15 | `requestAppointment` (409 `SLOT_ALREADY_BOOKED`, `ACTIVE_APPOINTMENT_EXISTS`) | S4 (request disabled while an active appointment exists) | Appointments | `appointment-change.md` §1 `alt`; `class-diagram.md` §3 unique partial index | T-AP-04, T-AP-05 | QM-05 (NFR-04) |
| Advisor decides | FR-27, FR-33, FR-35 | US-16, US-20, US-22 | `confirmAppointment` (`meetingLink`), `rejectAppointment` (409 not REQUESTED), `downloadAppointmentCalendar` | A2 Requests and schedule | Appointments, Notifications | `appointment-change.md` §1, §4 | T-AP-08, T-AP-09, T-NT-03, T-NT-06 | QM-05 |
| Fair cancellation | FR-28, FR-29 | US-17 | `cancelAppointment` (400 no reason, 409 `CANCELLATION_WINDOW_CLOSED`) | S4 "Cancel locked (< 30 mins)", A2 Cancel | Appointments | `appointment-change.md` §2, §4 | T-AP-10, T-AP-11, T-AP-12 | QM-03 |
| Record of meetings | FR-30, FR-31 | US-18 | `markAppointmentOutcome` (409 before start), `listAppointments`, `listMyStudents` | A2 Completed / No-show, A3 Assigned advisees | Appointments | `appointment-change.md` §4 | T-AP-13, T-AP-14 | QM-05 |
| SC-6 Users informed | FR-32 – FR-34 | US-19 – US-21 | internal e-mail service; Google Calendar operations | A1 Google Calendar | Notifications, Calendar Integration | `appointment-change.md` §1; `c4.md` §1 (external systems) | T-NT-01 … T-NT-05 | QM-10 (NFR-03) |
| CV for advising | FR-36 | US-23, US-24 | `uploadMyCv` (400 not PDF or > 2 MB), `downloadStudentCv` (403) | S2 CV field, A3 View / Download CV | Profiles | `class-diagram.md` §1 | T-CV-01 … T-CV-04 | QM-04 (SEC-06) |
| Fair advisor change | FR-37 – FR-39 | US-25, US-26 | `createAdvisorChangeRequest` (400 < 20 characters, 409 pending exists), `decideAdvisorChangeRequest` | S5a Form, S5b Pending, B2 Change requests | Advisor Change Requests, Matching | `appointment-change.md` §3 | T-CR-01 … T-CR-06 | — |
| SC-7 Data protection | FR-40 | US-18, US-24, US-25 | `listMyStudents`, `downloadStudentCv`, `listAdvisorChangeRequests` (403) | A3, B2 | Access Control | `class-diagram.md` §3 (privacy note) | T-PR-01 … T-PR-03 | QM-07 (SEC-05) |
| SC-8 Course quality gates | — (NFR-06, NFR-07) | — | — | — | all containers | `deployment.md` §3, §5 | CI pipeline | QM-09, coverage target |

## 3. Verification method of every functional requirement

Method = test level from `docs/test-scenario-matrix.md`. All tests are planned for Sprint 3 (MVP) and the final release; unit and integration tests run in GitHub Actions (NFR-06). Acceptance criteria are in `docs/backlog.md` under the listed story.

| FR | Priority | Story | Method | Planned tests | Additional verification |
|---|---|---|---|---|---|
| FR-01 | Must | US-01 | Integration + Unit | T-EV-01, T-EV-02, T-EV-03, T-EV-04, T-EV-05 |  |
| FR-02 | Must | US-01 | Integration | T-EV-01 |  |
| FR-03 | Must | US-02 | Integration | T-EV-06, T-EV-07 |  |
| FR-04 | Must | US-02 | Integration | T-EV-08 |  |
| FR-05 | Must | US-03 | Integration | T-EV-09, T-EV-10 |  |
| FR-06 | Must | all | Integration | T-AA-06, T-PR-04 | Authorization matrix test for every protected operation (QM-06, SEC-04) |
| FR-07 | Must | US-05 | Integration | T-AA-04 |  |
| FR-08 | Must | US-05 | Integration | T-AA-05 |  |
| FR-09 | Must | US-04 | Integration | T-AA-01, T-AA-02, T-AA-03 |  |
| FR-10 | Must | US-04, US-06, US-07 | Unit | T-SP-05, T-SP-06 |  |
| FR-11 | Must | US-06 | Integration + Unit | T-SP-01, T-SP-02, T-SP-03, T-SP-04, T-SP-05, T-SP-06 |  |
| FR-12 | Must | US-07 | Integration + Unit | T-AV-01, T-AV-02 |  |
| FR-13 | Must | US-07 | Integration | T-AV-03 |  |
| FR-14 | Must | US-11 | Integration | T-AM-10, T-AM-11 | Scheduler test with a frozen clock (QM-02, NFR-02) |
| FR-15 | Must | US-08 | Unit | T-AM-01, T-AM-05 |  |
| FR-16 | Must | US-08, US-09, US-10 | Unit | T-AM-02, T-AM-03, T-AM-06, T-AM-07 |  |
| FR-17 | Must | US-08, US-10 | Unit | T-AM-04, T-AM-08 |  |
| FR-18 | Must | US-11 | Integration | T-AM-10 |  |
| FR-19 | Must | US-10, US-11 | Unit | T-AM-09 |  |
| FR-20 | Must | US-11 | Integration | T-AM-10, T-AM-11 |  |
| FR-21 | Must | US-12 | Integration | T-AM-12 |  |
| FR-22 | Must | US-13 | Integration | T-AM-13 |  |
| FR-23 | Must | US-14 | Integration | T-AP-01 |  |
| FR-24 | Must | US-15 | Integration + Unit | T-AP-02, T-AP-03, T-AP-06 |  |
| FR-25 | Must | US-15 | Integration + Unit | T-AP-02, T-AP-07 |  |
| FR-26 | Must | US-15 | Integration | T-AP-04, T-AP-05 | Concurrent requests for one slot (NFR-04) |
| FR-27 | Must | US-16 | Integration | T-AP-08, T-AP-09 |  |
| FR-28 | Must | US-17 | Integration + Unit | T-AP-10, T-AP-12 |  |
| FR-29 | Must | US-17 | Unit | T-AP-11 | Boundary test at 31 / 30 / 29 minutes (QM-03) |
| FR-30 | Must | US-18 | Integration | T-AP-13 |  |
| FR-31 | Must | US-18 | Integration | T-AP-14 |  |
| FR-32 | Must | US-19 | Integration | T-NT-01, T-NT-02 | Mocked mail failure (QM-10, NFR-03) |
| FR-33 | Must | US-20 | Unit + Integration | T-NT-03 |  |
| FR-34 | Should | US-21 | Integration | T-NT-04, T-NT-05 |  |
| FR-35 | Should | US-22 | Unit | T-NT-06 |  |
| FR-36 | Should | US-23, US-24 | Integration + Unit | T-CV-01, T-CV-02, T-CV-03, T-CV-04 |  |
| FR-37 | Should | US-25 | Integration + Unit | T-CR-01, T-CR-02, T-CR-03 |  |
| FR-38 | Should | US-26 | Integration | T-CR-04, T-CR-05, T-CR-06 |  |
| FR-39 | Should | US-25 | Integration | T-CR-01 |  |
| FR-40 | Must | US-18, US-24, US-25 | Integration | T-PR-01, T-PR-02, T-PR-03 | Privacy test for every role (QM-07, SEC-05) |

## 4. Prototype screens and their requirements

The Figma frames are not yet annotated with identifiers; this table is the annotation. "States shown" lists the system states visible in the exported frames. Missing states are revision items R-1 to R-3 in Section 6.

### 4.1 Student screens (`docs/ux/student-screens.md`)

| Screen (Figma frame) | Requirements | Stories | API operations | States shown |
|---|---|---|---|---|
| S1 Log in (`1-auth`) | FR-05 | US-03 | `login` | Input |
| S1b Register (`1b-register`) | FR-01 – FR-04 | US-01, US-02 | `registerStudent`, `resendVerification` | Input, success ("We sent a verification link") |
| S2 Profile (`2-profile`) | FR-10, FR-11, FR-36 | US-06, US-23 | `listDepartments`, `listInterests`, `saveMyStudentProfile`, `uploadMyCv` | Input, field hints (minimum 1 interest, PDF ≤ 2 MB) |
| S3 My advisor (`3-my-advisor`) | FR-21 | US-12 | `getMyAdvisor` | Success with match reason |
| S3b Waiting for a match (`3b-my-advisor-waiting`) | FR-19, FR-21 | US-10, US-12 | `getMyAdvisor` (404) | Empty state with next run time |
| S4 Appointments (`4-appointments`) | FR-24 – FR-26, FR-28, FR-29, FR-31 | US-15, US-17, US-18 | `listAvailableSlots`, `requestAppointment`, `listAppointments`, `cancelAppointment` | Blocked (active appointment exists, FR-26), cancel locked (FR-29), statuses COMPLETED / CONFIRMED / CANCELLED |
| S5a Advisor change form (`5a-advisor-change-form`) | FR-37, FR-39 | US-25 | `createAdvisorChangeRequest` | Input, hint (minimum 20 characters) |
| S5b Pending request (`5b-advisor-change-pending`) | FR-37, FR-38 | US-25, US-26 | `listAdvisorChangeRequests` | Pending status, blocked second request |

### 4.2 Advisor and administrator screens (`docs/ux/advisor-admin-screens.md`)

| Screen (Figma frame) | Requirements | Stories | API operations | States shown |
|---|---|---|---|---|
| A1 Profile and office hours (`advisor-profile-office-hours`) | FR-12, FR-13, FR-23, FR-34 | US-07, US-14, US-21 | `saveMyAdvisorProfile`, `createOfficeHour`, `deleteOfficeHour`, Google Calendar operations | Layout only (low fidelity) |
| A2 Requests and schedule (`appointment-requests-schedule`) | FR-27, FR-28, FR-30, FR-35 | US-16, US-17, US-18, US-22 | `confirmAppointment`, `rejectAppointment`, `cancelAppointment`, `markAppointmentOutcome` | List with actions |
| A3 Assigned advisees (`assigned-advisees-student-cvs`) | FR-31, FR-36, FR-40 | US-18, US-24 | `listMyStudents`, `downloadStudentCv` | List, CV preview |
| B1 Quotas, waiting students, matching (`quotas-waiting-students-matching`) | FR-08, FR-14, FR-20, FR-22 | US-05, US-11, US-13 | `updateAdvisorQuota`, `listWaitingStudents`, `runMatchingNow`, `listMatchingRuns` | List with actions |
| B2 Change requests (`advisor-change-requests`) | FR-38, FR-40 | US-26 | `listAdvisorChangeRequests`, `decideAdvisorChangeRequest` | Detail with decision note |
| B3 Interest list (`interest-area-management`) | FR-09, FR-10 | US-04 | `listInterests`, `createInterest`, `updateInterest` | Active / inactive items, limit of 5 |

### 4.3 State coverage of the critical journey (request an appointment)

| State | Shown in the prototype | Requirement and API response |
|---|---|---|
| Loading | No | Client rule (R-1) |
| Empty (no free slots / not matched yet) | Not matched yet: S3b. No free slots: no | FR-24 `listAvailableSlots` returns an empty list (R-1) |
| Validation | No | FR-25 400 `INVALID_START_TIME`, `ONLINE_NOT_OFFERED` (R-1) |
| Authorization | No (navigation is role-based) | FR-06 401 / 403 (R-1) |
| Conflict | Partly: request disabled while an active appointment exists | FR-26 409 `ACTIVE_APPOINTMENT_EXISTS`; 409 `SLOT_ALREADY_BOOKED` after submit is not shown (R-1) |
| Success | Yes: appointment list with CONFIRMED status | FR-25 201 REQUESTED, FR-27 CONFIRMED |

## 5. Consistency review

Each row checks the same rule in every Sprint 2 artifact (assignment checklist: stakeholder goal → SRS → backlog → OpenAPI → prototype → C4 → UML → data → test).

### 5.1 Normal path: a matched student requests an appointment and the advisor confirms it

| Artifact | Evidence | Consistent |
|---|---|---|
| Goal | SC-4 Fast request | Yes (target differs, R-4) |
| SRS | FR-24, FR-25, FR-27, FR-33 | Yes |
| Backlog | US-15 AC1, US-16 AC1, US-20 | Yes |
| OpenAPI | `listAvailableSlots` 200 → `requestAppointment` 201 (REQUESTED) → `confirmAppointment` 200 (CONFIRMED, `meetingLink`) | Yes |
| Prototype | S3 "Request Appointment" → S4 request form → A2 Approve → S4 status CONFIRMED | Yes |
| C4 | Office Hours → Appointments → Notifications (Calendar Integration for online meetings) | Yes |
| UML | `appointment-change.md` §1 (`else free` branch), §4 REQUESTED → CONFIRMED | Yes |
| Data | `appointments.status`, `start_at` on the 30-minute grid, `end_at = start_at + 30 min` | Yes |
| Tests | T-AP-02, T-AP-08, T-NT-01, T-NT-03 | Yes |

### 5.2 Failure path: the slot is taken (no double booking)

| Artifact | Evidence | Consistent |
|---|---|---|
| Goal | SC-5 Two concurrent requests for one slot never both succeed | Yes |
| SRS | FR-26 at most one active appointment per slot and per student | Yes |
| Backlog | US-15 AC2 (409; two concurrent requests, exactly one succeeds), AC3 (second active appointment, 409) | Yes |
| OpenAPI | `requestAppointment` 409 `SLOT_ALREADY_BOOKED`, `ACTIVE_APPOINTMENT_EXISTS` | Yes |
| Prototype | S4 disables the request while an active appointment exists; the 409 after submit is not shown | Partly (R-1) |
| C4 | Appointments: "one booking per slot (409), one active appointment per student" | Yes |
| UML | `appointment-change.md` §1 `alt slot taken or active appointment exists` | Yes |
| Data | Unique partial index on (`advisor_id`, `start_at`) for REQUESTED / CONFIRMED rows (`class-diagram.md` §3) | Yes |
| Tests | T-AP-04 (including concurrent requests), T-AP-05; NFR-04, QM-05 | Yes |

### 5.3 Failure path: cancellation within 30 minutes of the start

| Artifact | Evidence | Consistent |
|---|---|---|
| Goal | Fair use of advisors' time (D-18) | Yes |
| SRS | FR-28 cancellation with a reason, FR-29 lock within 30 minutes for both sides | Yes |
| Backlog | US-17 AC2 (31 minutes accepted, 29 minutes 409), AC3 (no reason, 400) | Yes |
| OpenAPI | `cancelAppointment` 400, 409 `CANCELLATION_WINDOW_CLOSED` | Yes |
| Prototype | S4 "Cancel locked (< 30 mins)"; A2 has a Cancel button but no locked state or reason field | Partly (R-3) |
| C4 | Appointments: "cancel with a reason, not within 30 minutes of the start" | Yes |
| UML | `appointment-change.md` §2 `alt startAt - now <= 30 min` → 409; §4 transitions to CANCELLED | Yes |
| Data | Rule recorded in `class-diagram.md` §3 | Yes |
| Tests | T-AP-10, T-AP-11 (boundary), T-AP-12; QM-03 | Yes |

## 6. Findings and revision items

| ID | Finding | Affected artifact | Owner | Planned |
|---|---|---|---|---|
| R-1 | The appointment journey does not show loading, empty slot list, validation (400), authorization (401 / 403) and slot-conflict (409 after submit) states. Registration and profile screens do not show validation errors. | Figma student screens | Nil | Sprint 3 |
| R-2 | The administrator screen B1 shows "Match Advisor" per student and "Auto Match / Confirm Match". The SRS allows only the weekly run or "Run matching now" (FR-14, FR-16); there is no manual assignment. | Figma administrator screens | Ebrar | Sprint 3 |
| R-3 | The advisor screen A2 has no cancellation reason field and no "cancel locked" state (FR-28, FR-29); the student screen S4 has it. | Figma advisor screens | Ebrar | Sprint 3 |
| R-4 | SC-4 in the proposal sets "request in under 1 minute"; QM-08 and NFR-05 measure "booking in under 2 minutes". QM-08 / NFR-05 are the binding targets; SC-4 is updated in Sprint 3. | `docs/proposal.md` | Aybüke | Sprint 3 |
| R-5 | Figma frames are not annotated with FR, story and operation identifiers. Section 4 of this document is the annotation; the identifiers are added to the frames. | Figma files | Nil, Ebrar | Sprint 3 |
| R-6 | The backlog listed the API of US-22 as "to be added in #70". The operation exists (`confirmAppointment` with `meetingLink`). | `docs/backlog.md` | Aybüke | Fixed with this document |

## 7. Change management

A change to a requirement is complete only when every artifact in its row of Section 2 is reviewed. The pull request that changes a requirement links this document and updates the affected rows.
