# Project Proposal — Career Advisor Matching and Appointment System

| Field | Value |
|---|---|
| Course | SENG 321 / BM 321 Software Engineering |
| Deliverable | Sprint 1 — Project Proposal and Problem Definition |
| Team | Team 8 |
| Document owner (Accountable) | Aybüke — Product Owner and Requirements Engineer |
| Contributors | Fatima Zehra (technical feasibility), Yağız (license rationale), Ebrar (consistency review) |
| Related issue | #14 |
| Status | Draft for Sprint 1 review |

## 1. Problem statement and evidence

### 1.1 Problem statement

University students need guidance on career topics such as preparing a CV,
finding an internship, preparing for interviews, choosing a sector, and
applying for graduate study. Faculty members who can give this guidance have
different areas of experience, but students do not have a reliable way to know
which faculty member can help with which topic. Appointments for this kind of
guidance are arranged informally through e-mail, messages or visiting an office
during office hours. As a result:

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
  keyword list gives it priority.

**Limitations:** the sample is small and not random; respondents were reached
through the team's own networks, mostly fellow students. The survey offered
four topic options and did not list interview preparation separately. The
results are therefore **preliminary evidence**, not a measurement of the whole
student population.

| Further evidence | Method | Owner | Status |
|---|---|---|---|
| How faculty members currently handle career questions and office hours | Short conversation with at least one faculty member or the career center | Aybüke | Planned before Sprint 2 |

If later evidence contradicts the hypothesis, the team will revise the scope
with the instructor before Sprint 2.

## 2. Stakeholder identification and analysis

| Stakeholder | Type | Interest / need | Influence | Role in the first release |
|---|---|---|---|---|
| Students | Primary user | Reach a suitable advisor quickly; book a meeting without back-and-forth messages | Medium | Complete a profile, receive an advisor, book and cancel appointments, request an advisor change |
| Career advisors (faculty members) | Primary user | Receive students who match their experience; control their office hours; be informed of bookings | High | Define keywords and classes served, publish office-hour slots, receive e-mail notifications |
| Administrator (career center or department staff) | Operational user | Maintain the keyword list and advisor accounts; handle advisor-change requests fairly | High | Manage keywords and advisors, review students waiting for a match, decide on change requests |
| Department / university | Sponsor and governance | Organised career support; protection of student data | High | Sets policy on data use and advisor participation |
| Course instructor | Assessor and stakeholder proxy | Evidence of sound software engineering | High | Reviews each sprint; acts as stakeholder proxy where real stakeholders are unavailable |
| University identity provider | External system | Authenticates users and supplies identity and role | High (interface constraint) | Replaced by a documented local identity stub in development and demo |
| E-mail service | External provider | Delivers notification messages | Medium (interface constraint) | Sends booking and cancellation e-mails requested by the system |
| Users' calendar applications | External (indirect) | Import meeting details | Low | Open the calendar file (.ics) attached to e-mails |

## 3. Proposed solution and expected outcomes

### 3.1 Proposed solution

A web application with three roles: **student**, **advisor** and **administrator**.

1. The administrator maintains a fixed list of **keywords** (for example *CV,
   Internship, Interview, Software, Data Science, Graduate Study*) and registers
   advisors. Users sign in through the identity-provider boundary (a local
   identity stub in development and demo).
2. Each advisor selects the keywords that describe their experience, the
   **classes (years 1–4)** they prefer to advise, and defines **weekly recurring
   office hours** divided into 30-minute slots.
3. A student signs in and completes a profile: **class**, **department**,
   **grade point average (GPA)** and 1–5 **keywords** from the list.
4. The system **automatically assigns** the most suitable advisor using a
   transparent rule (Section 3.3). The assigned advisor remains the student's
   career advisor.
5. The student books one of the advisor's free office-hour slots.
6. The advisor receives an **e-mail** with the booking details and a **calendar
   file (.ics)**; the student sees a confirmation on the page.
7. A student who needs a different advisor submits a **change request with a
   explanation** to the administrator, who approves or rejects it.

### 3.2 Solution hypothesis

> If students are matched automatically to an advisor whose declared experience
> overlaps with their needs, and can book that advisor's office hours directly,
> then students will reach suitable guidance with fewer messages and advisors
> will receive fewer requests outside their area.

This hypothesis will be revised if the evidence in Section 1.3 contradicts it.

### 3.3 Matching rule (rule-based, no machine learning)

- **Candidates:** advisors who share at least one keyword with the student and
  have not reached their student capacity.
- **Score** = 2 × (number of shared keywords) + 1 (same department) + 1 (advisor
  serves the student's class).
- The highest score is assigned. Ties are broken by the advisor with fewer
  assigned students, then by the lowest advisor identifier (deterministic).
- GPA is **not** used in the score; it is shown only to the assigned advisor.
- If no candidate exists, the student is placed in a **waiting for match** state
  and the administrator is informed in the administration view.

A transparent rule was chosen so that every assignment can be explained to a
student, tested automatically and defended in review.

### 3.4 Expected outcomes and measurable success criteria

Targets are design goals, not measured results.

| ID | Outcome | Measure and target | Verified by |
|---|---|---|---|
| SC-1 | Fast onboarding | A new student completes the profile and sees an assigned advisor in under 3 minutes (median of 5 usability trials) | Usability check, Sprint 3 |
| SC-2 | Fast booking | A matched student books an office-hour slot in under 1 minute | Usability check, Sprint 3 |
| SC-3 | Correct matching | 100 % of assignments in the automated test set follow the matching rule, including tie and no-candidate cases | Unit tests, Sprint 3 |
| SC-4 | No double booking | When two students request the same slot concurrently, exactly one succeeds and the other receives a conflict response | Integration test, Sprint 3 |
| SC-5 | Advisor informed | The advisor's notification e-mail is sent within 1 minute of booking or cancellation | Integration test with a test mail server |
| SC-6 | Data protection | A student's GPA and change-request explanation are visible only to the authorised roles defined in Section 6 | Authorisation tests |
| SC-7 | Course quality gates | ≥ 50 % unit-test coverage; product starts with one docker-compose command | CI report and final demo |

## 4. Feasibility assessment

| Dimension | Assessment |
|---|---|
| Data | The system creates its own data (profiles, keywords, slots, appointments). No access to university student-information systems is required; GPA is entered by the student. Demo data will be seeded. |
| Integration | Authentication uses a documented local identity stub that replaces the university identity provider and keeps the same boundary, so the real provider can be connected later. One further external service is required: an e-mail (SMTP) service. A local test mail server is used in development and a free SMTP service in the demo. Calendar integration uses a standard .ics file, so no calendar account access is needed. |
| Skills | The required techniques — web user interface, REST API, relational database, role-based authorisation, unit and integration testing — are covered by the course and within the team's reach. The matching rule is a small, testable function. *(Technology stack to be confirmed by the Architect in Sprint 2.)* |
| Schedule | The core journey (sign in → profile → matching → booking → e-mail) is planned for the Sprint 3 MVP. Advisor change requests and calendar files follow before the final submission. Video meetings and CV upload are deferred. |
| Legal and ethical | GPA and change-request explanations are personal data. Access is limited to the roles that need them, and only the data needed for the service is stored. The team will follow university policy and the Turkish Personal Data Protection Law (KVKK) principles of purpose limitation and data minimisation. The matching rule is transparent so that students can understand why an advisor was assigned. |
| Operational | Real advisors may not participate during the semester. The product will be demonstrated with seeded advisor accounts; the instructor acts as stakeholder proxy. All tools used are free. |

## 5. Initial project scope

### 5.1 Included in the first release

1. Sign-in through the identity-provider boundary (local identity stub) and role-based access (student, advisor, administrator).
2. Administrator management of the keyword list and advisor accounts (including capacity).
3. Student profile: class, department, GPA, 1–5 keywords.
4. Advisor profile: keywords, classes served; weekly recurring office hours in 30-minute slots.
5. Automatic advisor matching and the "waiting for match" state.
6. Booking and cancelling office-hour appointments; advisor marks an appointment as completed or no-show.
7. E-mail notification to the advisor on booking and cancellation, with an .ics calendar file; on-page confirmation for the student.
8. Advisor change request with an explanation; administrator approval or rejection and re-matching.

### 5.2 Outside the first release (deferred or excluded)

| Item | Decision |
|---|---|
| Video meetings | Deferred. Candidate for a later release: the advisor adds a meeting link to an appointment. No video service is built. |
| CV upload | Deferred. Candidate for a later release (PDF only, size-limited, visible only to student and advisor). |
| Mobile application | Excluded from the first release; the web application is designed to work on phone browsers, and the same API can serve a mobile client later. |
| Two-way synchronisation with Google or Outlook calendars | Excluded; .ics files are used instead. |
| SMS and in-app messaging | Excluded. |
| Automatic import of grades from university systems | Excluded; students enter their own GPA. |
| Machine-learning-based matching | Excluded; a transparent rule is used. |
| Implementation of the university identity provider | Excluded; a documented local identity stub with the same interface is used. |

## 6. Assumptions, risks and validation

| ID | Type | Statement | Validation or response | Owner |
|---|---|---|---|---|
| AS-1 | Assumption | Students find it difficult to identify a suitable advisor. | Supported by the survey (Section 1.3): only 12 % rated it easy. Re-check with a larger sample in Sprint 2. | Aybüke |
| AS-2 | Assumption | Faculty members are willing to publish office hours and keywords. | Conversation with a faculty member; instructor as proxy. | Aybüke |
| AS-3 | Assumption | A fixed keyword list can describe most student needs. | Survey topics (internship, sector guidance, CV, graduate study) all map to keywords; administrator can extend the list. | Aybüke |
| AS-4 | Assumption | Students enter their GPA honestly; it is informational only. | GPA is not used in matching, so incorrect values do not change assignments. | Aybüke |
| AS-5 | Assumption | Students accept being assigned an advisor automatically. | Supported by the survey: 76 % yes, 0 % no; the advisor-change request covers students who disagree. | Aybüke |
| RK-1 | Risk | Two students book the same slot at the same moment. | Database-level uniqueness on the slot; conflict response; concurrency test (SC-4). | Fatima Zehra, Ebrar |
| RK-2 | Risk | Unfair load: popular advisors receive too many students. | Capacity limit and "fewer students" tie-break. | Fatima Zehra |
| RK-3 | Risk | Personal data (GPA, change-request explanations) is exposed to the wrong users. | Role and ownership checks; authorisation tests (SC-6). | Ebrar |
| RK-4 | Risk | E-mails are not delivered or are marked as spam. | Test mail server in development; failures logged and retried; booking is not lost if e-mail fails. | Yağız |
| RK-5 | Risk | No real advisors participate during the semester. | Seeded demo data; instructor as stakeholder proxy. | Aybüke |
| RK-6 | Risk | Scope grows (video, CV, mobile) and threatens the MVP. | Deferred items listed in Section 5.2; changes go through the decision log. | Aybüke, Nil |
| RK-7 | Risk | No advisor matches a student. | "Waiting for match" state visible to the administrator. | Aybüke |

## 7. Open-source license selection

| Criterion | MIT | Apache License 2.0 | GNU GPL v3 |
|---|---|---|---|
| Use, modification, redistribution | Permitted | Permitted | Permitted |
| Derived works must use the same license | No | No | Yes, when distributed |
| Explicit patent grant | No | **Yes** | Yes |
| Fits a permissive reuse goal | Yes | **Yes** | No |

**Decision:** Apache License 2.0 (full text in `LICENSE`; recorded in `docs/decision.md`).

**Rationale:**
- It permits use, modification and distribution, so the university or other
  teams can adapt the system.
- It includes an explicit patent grant, which gives contributors and users
  clearer protection than MIT.
- It is permissive, which matches the team's reuse goal; GPL's copyleft
  requirement is not needed for this project.
- Dependency licenses will be checked when implementation starts, and any
  incompatible license will be recorded as a risk.

This decision is not legal advice; the team follows university policy.
