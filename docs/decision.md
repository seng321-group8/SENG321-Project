# Decision Log

Status values: Proposed, Accepted, Rejected, Superseded.
Process: The team proposes a decision at a meeting. The Product Owner confirms it during pull request review and changes the status to Accepted.

## D-01 Platform
- Status: Proposed
- Meeting date: October 27, 2026
- Proposed by: Team
- Owner: Aybüke
- Decision: The first release is a web application that also works on mobile browsers. A native mobile application is not part of the first release.
- Rationale: A single code base, an easy demonstration and compliance with the Docker requirement. The same API can support a mobile application later.

## D-02 Video meetings
- Status: Proposed
- Meeting date: October 27, 2026
- Proposed by: Team
- Owner: Aybüke
- Decision: Not included in the first release. Deferred.
- Rationale: The team finishes the core flow first. In a later release an advisor can add a meeting link to an appointment.

## D-03 CV upload
- Status: Proposed
- Meeting date: October 27, 2026
- Proposed by: Team
- Owner: Aybüke
- Decision: Not included in the first release. Deferred.
- Rationale: File security and personal data handling add extra work. A later release may add PDF-only upload with a size limit.

## D-04 Advisor student quota
- Status: Proposed
- Meeting date: October 27, 2026
- Proposed by: Team
- Owner: Aybüke
- Decision: The default quota is 30 students per advisor. The administrator can change the quota for each advisor.
- Rationale: Distributes the workload fairly between advisors.

## D-05 Open-source license
- Status: Proposed
- Meeting date: October 27, 2026
- Proposed by: Team
- Owner: Aybüke
- Decision: Apache License 2.0 for the original project code.
- Rationale: Permits use, modification and redistribution, and includes an explicit patent grant. The LICENSE file is in the repository. Dependency licenses will be checked and recorded as risks if incompatible.

## D-06 Project name
- Status: Proposed
- Meeting date: October 27, 2026
- Proposed by: Team
- Owner: Aybüke
- Decision: The project name is "Career Advisor Matching and Appointment System".

## D-07 Appointment cancellation rule
- Status: Proposed
- Meeting date: October 27, 2026
- Proposed by: Team
- Owner: Aybüke
- Decision: A student cannot cancel an appointment that starts in less than 2 hours.
- Rationale: Protects the advisor's time and prevents last-minute cancellations.

## D-08 Office hour slots
- Status: Proposed
- Owner: Aybüke
- Decision: Advisors define weekly recurring slots with a fixed duration of 30 minutes.
- Rationale: Simple to model and to check for conflicts (409).

## D-09 Appointment outcome marking
- Status: Proposed
- Owner: Aybüke
- Decision: The advisor marks an appointment as Completed or No-show.
- Rationale: The advisor knows whether the student attended.

## D-10 Authentication
- Status: Proposed
- Owner: Fatima
- Decision: A documented local stub replaces the university identity provider and keeps the same boundary.
- Rationale: The real identity provider is outside the project scope.

## D-11 Notifications
- Status: Proposed
- Owner: Aybüke
- Decision: The advisor receives the appointment email with the .ics file. The student receives a confirmation on the page.
- Rationale: Matches the requirement and limits email work.

## D-12 Matching tie-break
- Status: Proposed
- Owner: Fatima
- Decision: Highest score first, then the advisor with fewer students, then the lowest advisor ID.
- Rationale: Makes the result deterministic and testable.

## D-13 Terminology
- Status: Proposed
- Owner: Aybüke
- Decision: Use "explanation" for the free text in advisor change requests everywhere.
- Rationale: The source text uses two different terms for it.
