# Decision Log

Status values: Proposed, Accepted, Rejected.

## D-01 Platform
- Status: Proposed
- Decision: The first release is a web application. A mobile application is deferred.
- Rationale: One interface keeps the scope small and simplifies Docker deployment.

## D-02 Video meetings
- Status: Proposed
- Decision: Not included in the first release. The advisor and student meet in the way they agree on; the system does not store meeting links.
- Rationale: Keeps the first release focused on matching and booking.

## D-03 CV upload
- Status: Proposed
- Decision: Not included in the first release.
- Rationale: Avoids file storage and the privacy and security work it requires.

## D-04 Advisor student quota
- Status: Proposed
- Decision: The default quota is 30 students per advisor. The administrator can change it for each advisor.
- Rationale: Matches the existing business rule and needs little extra work.

## D-05 Office hour slots
- Status: Proposed
- Decision: Advisors define weekly recurring slots with a fixed duration of 30 minutes.
- Rationale: Simple to model and to check for conflicts (409).

## D-06 Appointment outcome marking
- Status: Proposed
- Decision: The advisor marks an appointment as Completed or No-show.
- Rationale: The advisor is the person who knows whether the student attended.

## D-07 Authentication
- Status: Proposed
- Decision: A documented local stub replaces the university identity provider and keeps the same boundary.
- Rationale: The real identity provider is outside the project scope.

## D-08 Notifications
- Status: Proposed
- Decision: The advisor receives the appointment email with the .ics file. The student receives a confirmation on the page.
- Rationale: Matches the requirement and limits email work.

## D-09 Matching tie-break
- Status: Proposed
- Decision: Highest score first, then the advisor with fewer students, then the lowest advisor ID.
- Rationale: Makes the result deterministic and testable.

## D-10 Terminology
- Status: Proposed
- Decision: Use "explanation" for the free text in advisor change requests everywhere.
- Rationale: The source text uses two different terms for it.
