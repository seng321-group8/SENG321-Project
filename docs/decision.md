# Decision Log

Status values: Proposed, Accepted, Rejected, Superseded.
Process: The team proposes a decision at a meeting. The Product Owner confirms it during pull request review and changes the status to Accepted.

All decisions below were confirmed by Aybüke (Product Owner) during pull request review on November 1, 2026. The proposal (`docs/proposal.md`) and the backlog (`docs/backlog.md`) were aligned with them in the same review.

## D-01 Platform
- Status: Accepted
- Meeting date: October 27, 2026
- Accepted on: November 1, 2026
- Proposed by: Team
- Owner: Aybüke
- Decision: The first release is a web application that also works on mobile browsers. A native mobile application is not part of the first release.
- Rationale: A single code base, an easy demonstration and compliance with the Docker requirement. The same API can support a mobile application later.

## D-02 Video meetings
- Status: Accepted
- Meeting date: October 27, 2026
- Accepted on: November 1, 2026
- Proposed by: Team
- Owner: Aybüke
- Decision: Not included in the first release. Deferred.
- Rationale: The team finishes the core flow first. In a later release an advisor can add a meeting link to an appointment.

## D-03 CV upload
- Status: Accepted
- Meeting date: October 27, 2026
- Accepted on: November 1, 2026
- Proposed by: Team
- Owner: Aybüke
- Decision: Not included in the first release. Deferred.
- Rationale: File security and personal data handling add extra work. A later release may add PDF-only upload with a size limit.

## D-04 Advisor student quota
- Status: Accepted
- Meeting date: October 27, 2026
- Accepted on: November 1, 2026
- Proposed by: Team
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
- Status: Accepted
- Meeting date: October 27, 2026
- Accepted on: November 1, 2026
- Proposed by: Team
- Owner: Aybüke
- Decision: A student cannot cancel an appointment that starts in less than 2 hours.
- Rationale: Protects the advisor's time and prevents last-minute cancellations.

## D-08 Office hour slots
- Status: Accepted
- Accepted on: November 1, 2026
- Owner: Aybüke
- Decision: Advisors define weekly recurring slots with a fixed duration of 30 minutes.
- Rationale: Simple to model and to check for conflicts (409).

## D-09 Appointment outcome marking
- Status: Accepted
- Accepted on: November 1, 2026
- Owner: Aybüke
- Decision: The advisor marks an appointment as Completed or No-show.
- Rationale: The advisor knows whether the student attended.

## D-10 Authentication
- Status: Accepted
- Accepted on: November 1, 2026
- Owner: Fatima
- Decision: A documented local stub replaces the university identity provider and keeps the same boundary.
- Rationale: The real identity provider is outside the project scope.

## D-11 Notifications
- Status: Accepted
- Accepted on: November 1, 2026
- Owner: Aybüke
- Decision: The advisor receives the appointment email with the .ics file. The student receives a confirmation on the page.
- Rationale: Matches the requirement and limits email work.

## D-12 Matching tie-break
- Status: Accepted
- Accepted on: November 1, 2026
- Owner: Fatima
- Decision: Highest score first, then the advisor with fewer students, then the lowest advisor ID.
- Rationale: Makes the result deterministic and testable.

## D-13 Terminology
- Status: Accepted
- Accepted on: November 1, 2026
- Owner: Aybüke
- Decision: Use "explanation" for the free text in advisor change requests everywhere.
- Rationale: The source text uses two different terms for it.

