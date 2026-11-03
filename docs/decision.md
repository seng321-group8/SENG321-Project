# Decision Log

Status values: Proposed, Accepted, Rejected, Superseded.
Process: The team proposes a decision at a meeting. The Product Owner confirms it during pull request review and changes the status to Accepted. A decision that is replaced keeps its entry, is marked Superseded and points to the decision that replaces it.

Sources: team meeting of October 27, 2026 (D-01 to D-13) and the project brief of November 1, 2026 prepared by the Lead Software Architect (D-14 to D-27). Items marked Proposed are waiting for the confirmation listed in the entry. On November 3, 2026 the Product Owner confirmed the remaining open points (D-15, D-20, D-21, D-23); the student e-mail pattern (D-14) was confirmed the same day; only the interest count (D-25) stays open.

## Summary

| ID | Topic | Status |
|---|---|---|
| D-01 | Platform | Accepted |
| D-02 | Video meetings | Superseded by D-15 |
| D-03 | CV upload | Superseded by D-16 |
| D-04 | Advisor student quota | Superseded by D-17 |
| D-05 | Open-source license | Accepted |
| D-06 | Project name | Accepted |
| D-07 | Appointment cancellation rule | Superseded by D-18 |
| D-08 | Office hour slots | Accepted |
| D-09 | Appointment outcome marking | Accepted |
| D-10 | Authentication | Superseded by D-14 |
| D-11 | Notifications | Superseded by D-19 |
| D-12 | Matching tie-break | Superseded by D-20 |
| D-13 | Terminology | Accepted |
| D-14 | Registration and identity | Accepted |
| D-15 | Meeting type and online meetings | Accepted |
| D-16 | CV upload | Accepted |
| D-17 | Advisor student quota | Accepted |
| D-18 | Appointment request, approval and cancellation | Accepted |
| D-19 | Notifications and calendar | Accepted |
| D-20 | Matching algorithm and weekly batch run | Accepted |
| D-21 | Advisor change request | Accepted |
| D-22 | Advisor profile | Accepted |
| D-23 | Effect of advisor profile changes | Accepted |
| D-24 | Showing the reason for a match | Accepted |
| D-25 | Interest keywords | Accepted (maximum count open) |
| D-26 | Privacy | Accepted |
| D-27 | Technology stack | Accepted |

## D-01 Platform
- Status: Accepted
- Meeting date: October 27, 2026
- Accepted on: November 1, 2026
- Proposed by: Team
- Owner: Aybüke
- Decision: The first release is a web application that also works on mobile browsers. A native mobile application is not part of the first release.
- Rationale: A single code base, an easy demonstration and compliance with the Docker requirement. The same API can support a mobile application later.

## D-02 Video meetings
- Status: Superseded by D-15 (November 2, 2026)
- Meeting date: October 27, 2026
- Owner: Aybüke
- Decision: Not included in the first release. Deferred.
- Rationale: The team finishes the core flow first.

## D-03 CV upload
- Status: Superseded by D-16 (November 2, 2026)
- Meeting date: October 27, 2026
- Owner: Aybüke
- Decision: Not included in the first release. Deferred.
- Rationale: File security and personal data handling add extra work.

## D-04 Advisor student quota
- Status: Superseded by D-17 (November 2, 2026)
- Meeting date: October 27, 2026
- Owner: Aybüke
- Decision: The default quota is 30 students per advisor. The administrator can change the quota for each advisor.
- Rationale: Distributes the workload fairly between advisors.

## D-05 Open-source license
- Status: Accepted
- Meeting date: October 27, 2026
- Accepted on: November 1, 2026
- Proposed by: Team
- Owner: Aybüke
- Decision: Apache License 2.0 for the original project code.
- Rationale: Permits use, modification and redistribution, and includes an explicit patent grant. The LICENSE file is in the repository. Dependency licenses will be checked and recorded as risks if incompatible.

## D-06 Project name
- Status: Accepted
- Meeting date: October 27, 2026
- Accepted on: November 1, 2026
- Proposed by: Team
- Owner: Aybüke
- Decision: The project name is "Career Advisor Matching and Appointment System".
- Rationale: One name is used in the README and in every Sprint 1 document.

## D-07 Appointment cancellation rule
- Status: Superseded by D-18 (November 2, 2026)
- Meeting date: October 27, 2026
- Owner: Aybüke
- Decision: A student cannot cancel an appointment that starts in less than 2 hours.

## D-08 Office hour slots
- Status: Accepted
- Accepted on: November 1, 2026
- Owner: Aybüke
- Decision: Advisors define weekly recurring office hours with a fixed slot duration of 30 minutes.
- Rationale: Simple to model and to check for conflicts (409).

## D-09 Appointment outcome marking
- Status: Accepted
- Accepted on: November 1, 2026
- Owner: Aybüke
- Decision: The advisor marks an appointment as Completed or No-show.
- Rationale: The advisor knows whether the student attended.

## D-10 Authentication
- Status: Superseded by D-14 (November 2, 2026)
- Owner: Fatima
- Decision: A documented local stub replaces the university identity provider.

## D-11 Notifications
- Status: Superseded by D-19 (November 2, 2026)
- Owner: Aybüke
- Decision: The advisor receives the appointment email with the .ics file. The student receives a confirmation on the page.

## D-12 Matching tie-break
- Status: Superseded by D-20 (November 2, 2026)
- Owner: Fatima
- Decision: Highest score first, then the advisor with fewer students, then the lowest advisor ID.

## D-13 Terminology
- Status: Accepted
- Accepted on: November 1, 2026
- Owner: Aybüke
- Decision: Use "explanation" for the free text in advisor change requests everywhere.
- Rationale: The source text uses two different terms for it.

## D-14 Registration and identity
- Status: Accepted
- Accepted on: November 2, 2026
- Proposed by: Team (project brief, November 1, 2026)
- Owner: Fatima
- Decision: Only @ankarabilim.edu.tr addresses can register. An account is not active until the user opens the verification link sent by e-mail. The role is derived from the e-mail format: student addresses are the letter "s" followed by the 9-digit student number (for example s230205030@ankarabilim.edu.tr); advisor addresses use first.last or f.last. Advisor accounts are created only by the administrator, so a student cannot become an advisor. Administrator accounts are added manually.
- Rationale: The institutional domain and the verification link prove university membership without integrating the university identity system.
- Confirmed on November 3, 2026: student addresses follow the pattern `s` + 9-digit student number (regular expression `^s[0-9]{9}@ankarabilim\.edu\.tr$`).

## D-15 Meeting type and online meetings
- Status: Accepted
- Accepted on: November 2, 2026
- Proposed by: Team (project brief)
- Owner: Aybüke
- Decision: An appointment is in person or online. Offering online meetings is the advisor's choice. If the advisor has connected Google Calendar, a Google Meet link is created automatically when an online appointment is confirmed; otherwise the advisor enters a Zoom, Meet or Teams link manually. No video infrastructure is built.
- Rationale: Gives flexibility without building video features.
- Confirmed by the Product Owner on November 3, 2026: the online preference is set per advisor, not per office-hour slot.

## D-16 CV upload
- Status: Accepted
- Accepted on: November 2, 2026
- Proposed by: Team (project brief)
- Owner: Aybüke
- Decision: Students can upload one CV as a PDF of at most 2 MB; a new upload replaces the old file. Only the student and the assigned advisor can access it.
- Rationale: Lets the advisor prepare for the meeting.

## D-17 Advisor student quota
- Status: Accepted
- Accepted on: November 3, 2026
- Proposed by: Team, after consulting the course instructor (Nedim Hoca)
- Owner: Aybüke
- Decision: The quota is configurable by the administrator for each advisor, as the instructor recommended. A new advisor starts with a default quota of 20 students, based on the team's rough estimate; the administrator then adjusts it as needed. The quota cannot be set below the advisor's current number of students.
- Rationale: The right number depends on the number of advisors and students, which the administrator knows best; a starting value of 20 keeps the workload manageable, and lowering the quota must not remove students silently.

## D-18 Appointment request, approval and cancellation
- Status: Accepted
- Accepted on: November 2, 2026
- Proposed by: Team (project brief)
- Owner: Aybüke
- Decision: Appointments last 30 minutes. The student selects a free slot of the assigned advisor and sends a request; the appointment is confirmed only when the advisor accepts it. A slot holds at most one appointment (409 on conflict) and a student has at most one active appointment. Both the student and the advisor can cancel with a written reason. Cancellation is not possible within 30 minutes of the start of the meeting; the rule applies to both sides.
- Rationale: Advisors keep control of their time; the cancellation lock protects both sides from last-minute changes.
- Confirmed by the Product Owner on November 2, 2026: 30 minutes, for both sides.

## D-19 Notifications and calendar
- Status: Accepted
- Accepted on: November 2, 2026
- Proposed by: Team (project brief)
- Owner: Aybüke
- Decision: The system sends e-mails for account verification, appointment requests, acceptance or rejection, and cancellation. The confirmation e-mail carries an .ics calendar file, and the page offers an "Add to calendar" button.
- Rationale: Keeps both sides informed; .ics works with every calendar application.

## D-20 Matching algorithm and weekly batch run
- Status: Accepted
- Accepted on: November 2, 2026
- Proposed by: Team (project brief)
- Owner: Fatima
- Decision: Matching runs once a week as a batch, every Sunday at 22:00 (Europe/Istanbul), not at the moment a profile is saved. Score = 2 × shared interests + 1 if same department + 1 if the advisor serves the student's year; GPA is not used. For each waiting student, among advisors with free quota: round 1 considers advisors who serve the student's year and share at least one interest; round 2 drops the year condition; round 3 ignores interests and chooses the advisor with the most free quota, preferring the student's department, with a random choice on ties (a fixed seed in tests). Ties in rounds 1 and 2 go to the advisor with fewer students, and counts are updated during the run. Students with no available advisor stay "waiting for match", visible to the administrator. The assigned advisor is permanent. The administrator can start a run manually for demonstrations and tests.
- Rationale: Transparent, testable rules; every student is matched as long as any quota is free.
- Run time confirmed by the Product Owner on November 2, 2026: Sunday 22:00 (Europe/Istanbul).
- Confirmed by the Product Owner on November 3, 2026: students are processed in order of fewest candidate advisors first, then by registration time.

## D-21 Advisor change request
- Status: Accepted
- Accepted on: November 2, 2026
- Proposed by: Team (project brief)
- Owner: Aybüke
- Decision: A student sends a change request to the administrator with a reason (time conflict, field mismatch, communication issue, year change, other) and an explanation of at least 20 characters. Only one pending request is allowed. The administrator approves or rejects it with a note. On approval the student is re-matched excluding the previous advisor; if no other advisor is available, the student stays with the current advisor. Moving to a new year gives the student an optional right to request a change; there is no automatic re-matching.
- Rationale: Fair and recorded changes without disrupting existing matches.
- Confirmed by the Product Owner on November 3, 2026: year-change requests go to the administrator through the same flow, with the reason "year change".

## D-22 Advisor profile
- Status: Accepted
- Accepted on: November 2, 2026
- Proposed by: Team (project brief)
- Owner: Aybüke
- Decision: Each advisor chooses the years they serve (any combination of 1–4), their interests, a short introduction text and whether they offer online meetings.
- Rationale: Gives students context and makes matching more accurate.

## D-23 Effect of advisor profile changes
- Status: Accepted
- Accepted on: November 3, 2026
- Proposed by: Team (project brief)
- Owner: Aybüke
- Decision: If an advisor changes interests or years served, existing matches are not affected; the change applies to future runs.
- Rationale: Assignments are permanent; students should not lose their advisor unexpectedly.

## D-24 Showing the reason for a match
- Status: Accepted
- Accepted on: November 2, 2026
- Proposed by: Team (project brief)
- Owner: Aybüke
- Decision: The student sees why they were matched (shared interests, same department, year served), together with the advisor's introduction text and interests. A waiting student sees the date of the next matching run.
- Rationale: Transparency builds trust in automatic matching.

## D-25 Interest keywords
- Status: Accepted (maximum count open)
- Accepted on: November 2, 2026 · updated November 3, 2026
- Proposed by: Team (project brief)
- Owner: Aybüke
- Decision: Students and advisors choose at least one interest from the same predefined, unordered list; free text is not allowed. The administrator maintains the list. The maximum number of interests per user is a configurable setting; its final value and the initial list will be set after the interests of every advisor have been collected. Until then, development and tests use a maximum of 5 as a placeholder.
- Rationale: A shared vocabulary makes matching possible; the list and the limit should reflect what advisors actually offer.
- Open point: final maximum count and initial interest list (after collecting advisors' interests).

## D-26 Privacy
- Status: Accepted
- Accepted on: November 2, 2026
- Proposed by: Team (project brief)
- Owner: Aybüke
- Decision: GPA is visible only to the student and the assigned advisor. The explanation in a change request is visible only to the student and administrators. The CV is visible only to the student and the assigned advisor.
- Rationale: Data minimisation and the Turkish Personal Data Protection Law (KVKK).

## D-27 Technology stack
- Status: Accepted
- Accepted on: November 2, 2026
- Proposed by: Team (project brief)
- Owner: Fatima
- Decision: Backend: Python, Django REST Framework and PostgreSQL. Frontend: React (JavaScript, HTML, CSS), responsive web. External services: an e-mail service and the Google Calendar API.
- Rationale: Built-in authentication and administration features, free tools, one-command Docker deployment.
