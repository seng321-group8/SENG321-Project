# Project Proposal — Career Advisor Matching and Appointment System

| Field | Value |
|---|---|
| Course | SENG 321 / BM 321 Software Engineering |
| Deliverable | Sprint 1 — Project Proposal and Problem Definition |
| Team | Team 8 |
| Document owner (Accountable) | Aybüke — Product Owner and Requirements Engineer |
| Contributors | Fatima Zehra (technical feasibility), Yağız (license rationale), Ebrar (consistency review) |
| Related issue | #14 |
| Source of truth | Project brief of November 1, 2026 and `docs/decision.md` |
| Status | Draft for Sprint 1 review |

## 1. Problem statement and evidence

### 1.1 Problem statement

Students at Ankara Science University need guidance on career topics such as
preparing a CV, finding an internship, preparing for interviews, choosing a
sector and applying for graduate study. Faculty members who can give this
guidance have different areas of experience, but students do not have a
reliable way to know which faculty member can help with which topic. Meetings
in office hours are arranged informally through e-mail, messages or visiting an
office. As a result:

- students may approach a faculty member who is not the right person for their
  question, or may not seek guidance at all;
- faculty members receive requests outside their area of experience and must
  redirect students;
- there is no shared view of office-hour availability, so students and faculty
  exchange several messages before a meeting is agreed;
- the department has no record of which career topics students ask about most.

### 1.2 Current process (as understood by the team)

1. A student decides whom to ask, usually based on personal contact or word of
   mouth.
2. The student sends an e-mail or visits the office to ask for a meeting.
3. The faculty member replies with possible times; the student confirms.
4. The meeting is not recorded anywhere apart from personal e-mail or calendars.

### 1.3 Evidence

The team ran a short online student survey (Google Forms, Turkish, five
questions) between **30 and 31 October 2026**. It was shared through course and
personal messaging groups and received **33 responses**. Anonymised responses
(no names or e-mail addresses) are in [`docs/survey-results.csv`](survey-results.csv).
Results:

| Question | Result (n = 33) |
|---|---|
| Have you wanted career support (CV, internship, interview…) from a faculty member? | **Yes: 28 (85 %)**; No: 5 (15 %) |
| How easy was it to find whom to ask? (1 = very difficult, 5 = very easy) | Mean **2.6 / 5**; 1–2: 14 (42 %); 3: 15 (45 %); 4–5: **only 4 (12 %)** |
| Which topics do you need support with? (multiple choice) | Internship or job search: **26 (79 %)**; Sector information and guidance: 15 (45 %); CV and cover letter: 12 (36 %); Academic career (graduate study): 10 (30 %) |
| How do you currently get an appointment? | **Never had one: 15 (45 %)**; Visiting the office: 11 (33 %); E-mail: 5 (15 %); Message: 2 (6 %) |
| Would you like to be matched automatically with an advisor based on your interests? | **Yes: 25 (76 %)**; Not sure: 8 (24 %); No: 0 (0 %) |

**Interpretation:**
- Demand exists: 85 % of respondents have wanted career support from a faculty
  member.
- Finding the right person is the weak point: only 12 % rated it easy (4–5),
  and 45 % have never had an appointment although most wanted support.
- Appointments are arranged informally (office visit, e-mail, message); no
  respondent reported a dedicated booking channel.
- Automatic matching is acceptable: 76 % said yes and nobody said no.
- Internship and job search is the most requested topic, so the initial
  interest list gives it priority.

**Limitations:** the sample is small and not random; respondents were reached
through the team's own networks, mostly fellow students. The survey offered
four topic options and did not list interview preparation separately. The
results are therefore **preliminary evidence**, not a measurement of the whole
student population.

| Further evidence | Method | Owner | Status |
|---|---|---|---|
| How faculty members currently handle career questions and office hours | Short conversation with at least one faculty member or the career center | Aybüke | Planned before Sprint 2 |
| Advisor quota per faculty member | Asked the course instructor | Nil | Done (November 3, 2026): quota is set by the administrator per advisor; default 20 (D-17) |

If later evidence contradicts the hypothesis, the team will revise the scope
with the instructor before Sprint 2.

## 2. Stakeholder identification and analysis

| Stakeholder | Type | Interest / need | Influence | Role in the first release |
|---|---|---|---|---|
| Students | Primary user | Reach a suitable advisor; understand why they were matched; meet without back-and-forth messages | Medium | Register, complete a profile, receive an advisor, request and cancel appointments, upload a CV, request an advisor change |
| Career advisors (faculty members) | Primary user | Receive students who match their experience; control their time and meeting type; prepare for meetings | High | Define interests, years served, introduction and online preference; publish office hours; accept or reject requests; record outcomes |
| Administrator (career center or department staff) | Operational user | Maintain the interest list and advisor accounts; keep workload fair; handle change requests | High | Manage interests, advisors and quotas; run matching on demand; see waiting students; decide on change requests |
| Department / university | Sponsor and governance | Organised career support; protection of student data | High | Sets policy on data use, quotas and advisor participation |
| Course instructor | Assessor and stakeholder proxy | Evidence of sound software engineering | High | Reviews each sprint; advised that the advisor quota should be configurable by the administrator |
| E-mail service | External provider | Delivers verification and notification messages | Medium (interface constraint) | Sends e-mails requested by the system |
| Google Calendar API | External provider | Creates calendar events and Google Meet links for advisors who connect their account | Medium (interface constraint) | Creates and deletes Meet events for confirmed online appointments |
| Users' calendar applications | External (indirect) | Import meeting details | Low | Open the .ics file attached to confirmation e-mails |

## 3. Proposed solution and expected outcomes

### 3.1 Proposed solution

A responsive web application with three roles: **student**, **advisor** and
**administrator**.

1. Users register with their **@ankarabilim.edu.tr** address and activate the
   account through an **e-mail verification link**. The role is derived from
   the e-mail format; advisor accounts are created only by the administrator.
2. The administrator maintains one predefined list of **interests** (for
   example *CV, Internship, Interview, Software, Data Science, Graduate Study*).
   The final list and the maximum number of interests per user will be set
   after the interests of every advisor have been collected.
3. Each advisor chooses interests, the **years (1–4)** they serve, a
   short **introduction**, whether they **offer online meetings**, and
   publishes **weekly office hours** in 30-minute slots.
4. A student completes a profile: **year**, **department**, **GPA** and
   **interests**.
5. Every **Sunday at 22:00**, a **weekly matching run** assigns each waiting student an
   advisor using a transparent three-round rule (Section 3.3). The assigned
   advisor is permanent. The student sees **why** they were matched.
6. The student **requests** a free slot of the advisor, in person or online.
   The appointment is confirmed when the **advisor accepts** it. Both sides
   can **cancel with a reason**, but not within **30 minutes** of the meeting.
7. The system sends **e-mails** for requests, decisions and cancellations; the
   confirmation e-mail carries a **calendar file (.ics)**. For online meetings,
   a **Google Meet** link is created automatically if the advisor connected
   Google Calendar; otherwise the advisor enters a link manually.
8. A student can upload a **CV** (PDF, max 2 MB) that only the assigned
   advisor can see, and can send the administrator a **change request** with a
   reason and an explanation.

### 3.2 Solution hypothesis

> If students are matched by a transparent rule to an advisor whose declared
> experience overlaps with their needs, and can request that advisor's office
> hours directly, then students will reach suitable guidance with fewer
> messages and advisors will receive fewer requests outside their area.

This hypothesis will be revised if the evidence in Section 1.3 is contradicted.

### 3.3 Matching rule (rule-based, no machine learning)

- **Score** = 2 × (shared interests) + 1 (same department) + 1 (advisor serves
  the student's year). GPA is **not** used; it is shown only to the assigned
  advisor.
- **Weekly batch run (every Sunday at 22:00, Europe/Istanbul)**, for each waiting student, among
  advisors with free quota:

| Round | Candidates | Selection |
|---|---|---|
| 1 | Advisors who serve the student's year **and** share at least one interest | Highest score; tie → fewer current students |
| 2 | Students not assigned in round 1: year condition dropped, at least one shared interest | Same rule |
| 3 | Students still not assigned: interests ignored | Advisor with the most free quota, the student's department first; random on ties (fixed seed in tests) |
| — | No advisor has free quota | The student stays **waiting for match**, visible to the administrator |

- Counts are updated as students are assigned during the run. The
  administrator can start a run manually for demonstrations and tests.

A transparent rule was chosen so that every assignment can be explained to a
student, tested automatically and defended in review.

### 3.4 Expected outcomes and measurable success criteria

Targets are design goals, not measured results.

| ID | Outcome | Measure and target | Verified by |
|---|---|---|---|
| SC-1 | Fast onboarding | A new student registers, verifies the e-mail and completes the profile in under 5 minutes (median of 5 usability trials) | Usability check, Sprint 3 |
| SC-2 | Every student matched when capacity exists | After a weekly run, no student is waiting while any advisor has free quota | Automated tests on seeded data |
| SC-3 | Correct matching | 100 % of assignments in the test set follow the three-round rule, including ties, full quotas and the seeded random choice | Unit tests, Sprint 3 |
| SC-4 | Fast request | A matched student sends an appointment request in under 1 minute | Usability check, Sprint 3 |
| SC-5 | No double booking | Two concurrent requests for one slot never both succeed | Integration test, Sprint 3 |
| SC-6 | Users informed | Notification e-mails are sent within 1 minute of a request, decision or cancellation | Integration test with a test mail server |
| SC-7 | Data protection | GPA, CV and change-request explanations are visible only to the authorised roles | Authorisation tests |
| SC-8 | Course quality gates | ≥ 50 % unit-test coverage; product starts with one docker-compose command | CI report and final demo |

## 4. Feasibility assessment

| Dimension | Assessment |
|---|---|
| Data | The system creates its own data (accounts, profiles, interests, office hours, appointments, CVs). No access to university information systems is needed; GPA is entered by the student. Demo data will be seeded. |
| Integration | Two external services: an e-mail (SMTP) service — a local test mail server in development and a free SMTP service in the demo — and the Google Calendar API for Meet links (OAuth consent by each advisor). Calendar files use the standard .ics format. Google integration is optional per advisor, so the system works without it. |
| Skills and technology | Decided stack (D-27): Python, Django REST Framework and PostgreSQL for the backend; React (JavaScript, HTML, CSS) for a responsive frontend; Docker Compose for deployment. Django provides authentication and administration features out of the box. The matching rule and the weekly run are small, testable modules (Django management command plus a scheduled job). |
| Schedule | MVP order: (1) registration and login, profiles, weekly matching; (2) office hours and appointment request, approval and cancellation; (3) e-mail and .ics — for the Sprint 3 MVP. (4) CV upload, Google Meet and advisor change requests follow before the final submission. |
| Legal and ethical | GPA, CVs and change-request explanations are personal data. Access is limited to the roles that need them and only necessary data is stored, following the data-minimisation principle of the Turkish Personal Data Protection Law (KVKK). Google access is granted by each advisor and can be revoked at any time. The matching rule is transparent, and students see the reason for their match. |
| Operational | Real advisors may not participate during the semester; the product will be demonstrated with seeded accounts, and the instructor acts as stakeholder proxy. All tools are free. |

## 5. Initial project scope

### 5.1 Included in the first release

1. Registration with an @ankarabilim.edu.tr address, e-mail verification, role from the e-mail format, sign-in.
2. Administrator management of the interest list, advisor accounts and quotas (default 20 students per advisor, adjustable by the administrator).
3. Student profile: year, department, GPA, interests (maximum number set after collecting advisors' interests; placeholder 5).
4. Advisor profile: interests, years served, introduction, online-meeting preference; weekly office hours in 30-minute slots.
5. Weekly three-round matching (with manual run for the administrator), match reason for the student, list of waiting students.
6. Appointment request, advisor acceptance or rejection, cancellation with a reason by either side, outcome marking (Completed or No-show).
7. E-mail notifications, .ics file and "Add to calendar".
8. Online meetings: Google Meet link for advisors who connect Google Calendar, manual link otherwise.
9. CV upload (PDF, max 2 MB) visible only to the student and the assigned advisor.
10. Advisor change request with reason and explanation; administrator decision and re-matching.

### 5.2 Outside the first release

| Item | Decision |
|---|---|
| Own video-conferencing infrastructure | Excluded; only external links are used. |
| Automatic link creation for Zoom and Teams | Deferred; only Google Meet links are created automatically, others are entered manually. |
| Native mobile application | Excluded; the web application is responsive, and the same API can serve a mobile client later (D-01). |
| Integration with the university identity system (SSO) | Excluded; identity is proven by the institutional e-mail and the verification link (D-14). |
| Two-way calendar synchronisation | Excluded; .ics files and Google Meet events only. |
| SMS and in-app messaging | Excluded. |
| Automatic import of grades from university systems | Excluded; students enter their own GPA. |
| Machine-learning-based matching | Excluded; a transparent rule is used. |
| Appointment reminders and automatic expiry of unanswered requests | Deferred; to be considered after the first release. |

## 6. Assumptions, risks and validation

| ID | Type | Statement | Validation or response | Owner |
|---|---|---|---|---|
| AS-1 | Assumption | Students find it difficult to identify a suitable advisor. | Supported by the survey (Section 1.3): only 12 % rated it easy. Re-check with a larger sample in Sprint 2. | Aybüke |
| AS-2 | Assumption | Faculty members are willing to publish office hours, interests and an introduction. | Conversation with a faculty member; instructor as proxy. | Aybüke |
| AS-3 | Assumption | A fixed interest list can describe most student needs. | All survey topics map to interests; the administrator can extend the list. | Aybüke |
| AS-4 | Assumption | Students accept being assigned an advisor automatically. | Supported by the survey: 76 % yes, 0 % no; the change request covers students who disagree. | Aybüke |
| AS-5 | Assumption | Students enter their GPA honestly. | GPA is not used in matching, so incorrect values cannot change an assignment. | Aybüke |
| AS-6 | Assumption | The university e-mail format distinguishes students from faculty. | Confirmed: student addresses are `s` + 9-digit student number (e.g. s230205030@ankarabilim.edu.tr); advisor addresses use first.last or f.last (D-14). | Fatima |
| RK-1 | Risk | Two students request the same slot at the same moment. | Database-level uniqueness on the slot; conflict response; concurrency test (SC-5). | Fatima, Ebrar |
| RK-2 | Risk | Weekly matching makes a new student wait up to a week before booking. | The waiting page shows the next run date; the administrator can run matching manually; the run day can be adjusted. | Aybüke |
| RK-3 | Risk | Google OAuth fails or needs verification on demo day. | Manual meeting link as fallback; demo with a pre-connected test account; Google is optional per advisor. | Fatima, Yağız |
| RK-4 | Risk | Personal data (GPA, CV, explanations) is exposed to the wrong users. | Role and ownership checks; authorisation tests (SC-7); PDF type and size checks for CVs. | Ebrar |
| RK-5 | Risk | E-mails are not delivered or are marked as spam. | Test mail server in development; failures logged and retried; status always visible in the system. | Yağız |
| RK-6 | Risk | Unfair load: popular advisors receive too many students. | Quota per advisor; "fewer students" tie-break; round 3 prefers the advisor with the most free quota. | Fatima |
| RK-7 | Risk | Scope is too large for one semester. | MVP order in Section 4; CV, Google Meet and change requests are P2 and can be cut last. | Aybüke, Nil |
| RK-8 | Risk | Docker set-up is left too late. | Docker skeleton in Sprint 2; one-command start checked every sprint. | Yağız |
| RK-9 | Risk | No real advisors participate during the semester. | Seeded demo data; instructor as stakeholder proxy. | Aybüke |

## 7. Open-source license selection

| Criterion | MIT | Apache License 2.0 | GNU GPL v3 |
|---|---|---|---|
| Use, modification, redistribution | Permitted | Permitted | Permitted |
| Derived works must use the same license | No | No | Yes, when distributed |
| Explicit patent grant | No | **Yes** | Yes |
| Fits a permissive reuse goal | Yes | **Yes** | No |

**Decision:** Apache License 2.0 (full text in `LICENSE`; recorded in `docs/decision.md`, D-05).

**Rationale:**
- It permits use, modification and distribution, so the university or other
  teams can adapt the system.
- It includes an explicit patent grant, which gives contributors and users
  clearer protection than MIT.
- It is permissive, which matches the team's reuse goal; GPL's copyleft
  requirement is not needed for this project.
- Dependency licenses (Django, React, PostgreSQL drivers, Google client
  libraries) will be checked when implementation starts, and any incompatible
  license will be recorded as a risk.

This decision is not legal advice; the team follows university policy.
