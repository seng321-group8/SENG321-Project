# Decision Log

Status values: Proposed, Accepted, Rejected.

## D-01 Platform
- Status: Proposed
- Date: 2026-10-27
- Owner: Team
- Decision: The first release is a web application accessible via mobile browsers. A mobile application is deferred.
- Rationale: One interface keeps the scope small, simplifies Docker deployment, and provides a single API for future mobile integration.

## D-02 Video meetings
- Status: Proposed
- Date: 2026-10-27
- Owner: Team
- Decision: Not included in the first release. The advisor and student meet in the way they agree on; the system does not store meeting links.
- Rationale: Keeps the first release focused on matching and booking.

## D-03 CV upload
- Status: Proposed
- Date: 2026-10-27
- Owner: Team
- Decision: Not included in the first release.
- Rationale: Avoids file storage and the privacy and security work it requires.

## D-04 Advisor student quota
- Status: Proposed
- Date: 2026-10-27
- Owner: Team
- Decision: The default quota is 30 students per advisor. The administrator can change it for each advisor.
- Rationale: Matches the existing business rule and needs little extra work.

## D-05 Office hour slots
- Status: Proposed
- Date: 2026-10-27
- Owner: Team
- Decision: Advisors define weekly recurring slots with a fixed duration of 30 minutes.
- Rationale: Simple to model and to check for conflicts (409).

## D-06 Appointment outcome marking
- Status: Proposed
- Date: 2026-10-27
- Owner: Team
- Decision: The advisor marks an appointment as Completed or No-show.
- Rationale: The advisor is the person who knows whether the student attended.

## D-07 Authentication
- Status: Proposed
- Date: 2026-10-27
- Owner: Team
- Decision: A documented local stub replaces the university identity provider and keeps the same boundary.
- Rationale: The real identity provider is outside the project scope.

## D-08 Notifications
- Status: Proposed
- Date: 2026-10-27
- Owner: Team
- Decision: The advisor receives the appointment email with the .ics file. The student receives a confirmation on the page.
- Rationale: Matches the requirement and limits email work.

## D-09 Matching tie-break
- Status: Proposed
- Date: 2026-10-27
- Owner: Team
- Decision: Highest score first, then the advisor with fewer students, then the lowest advisor ID.
- Rationale: Makes the result deterministic and testable.

## D-10 Terminology
- Status: Proposed
- Date: 2026-10-27
- Owner: Team
- Decision: Use "explanation" for the free text in advisor change requests everywhere.
- Rationale: The source text uses two different terms for it.

## D-11 License Selection
- Status: Proposed
- Date: 2026-10-27
- Owner: Team
- Decision: Adopt the Apache 2.0 License for the repository.
- Rationale: Provides clear open-source legal terms and liability protection for team members.

## D-12 Cancellation Deadline Rule
- Status: Proposed
- Date: 2026-10-27
- Owner: Team
- Decision: Students cannot cancel appointments if there are fewer than 2 hours remaining until the scheduled slot.
- Rationale: Prevents last-minute cancellations and respects advisor schedule planning.
