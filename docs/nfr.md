# Non-Functional and Security Requirements

| Item | Value |
|---|---|
| Project | Career Advisor Matching and Appointment System (SENG 321, Team 8) |
| Sprint | Sprint 2 |
| Issue | #60 |
| Owner | Yağız (DevOps and CI/CD Infrastructure Engineer) |
| Reviewer | Ebrar |
| Sources | `docs/srs.md`, `docs/decision.md`, `openapi.yaml` |
| Quality measures | `docs/quality-measures.md` (#61) |

This document specifies measurable system-wide requirements. `NFR-*` requirements define quality targets; `SEC-*` requirements define security and privacy controls. Functional behavior remains in `docs/srs.md`, and the tools used to measure these targets are mapped in `docs/quality-measures.md`.

## 1. Non-functional requirements

| ID | Category | Requirement and measurable target | Verification |
|---|---|---|---|
| NFR-01 | API performance | Under a load of 50 concurrent users for 5 minutes, the p95 response time of the main JSON API operations shall be below 500 ms, excluding external e-mail and Google Calendar latency, with an HTTP error rate below 1%. | Locust test against registration/login, profile, advisor, office-hour and appointment reads; retain the HTML/CSV report. |
| NFR-02 | Matching performance | A weekly matching run for the demonstration dataset shall complete within 5 minutes. No run shall overlap another run, and a repeated request while a run is active shall return 409. | Timed integration test of the management command and manual run endpoint; assert one run record and no duplicate assignments. |
| NFR-03 | Availability of core transactions | A failure or timeout from the e-mail service or Google Calendar shall not roll back a successfully committed profile, matching or appointment transaction. The API shall record 100% of simulated integration failures and return or retain a deterministic system state. | Replace each external client with a failing test double and verify database state, response and error log. |
| NFR-04 | Data integrity | Concurrent requests shall never create more than one appointment for the same slot, more than one active appointment for a student, more than one pending advisor-change request, or more than one active matching run. | Transaction/concurrency tests; 100% of conflicting second requests shall be rejected with 409. |
| NFR-05 | Usability and responsiveness | The registration, profile, advisor, appointment and advisor-change flows shall render without horizontal overflow or inaccessible controls at 393 × 852 px and 1440 × 1024 px. Every validation error shall be displayed next to or clearly associated with its field. | Responsive browser checks for all core screens at both viewports; zero blocking layout defects. |
| NFR-06 | Maintainability and testability | Core matching, appointment-state, validation and authorization modules shall have at least 50% unit-test coverage. CI shall report zero configured lint errors, and deterministic matching tests shall use a fixed random seed. | `pytest-cov --cov-fail-under=50`, the configured linter and repeat runs of matching tests in GitHub Actions. |
| NFR-07 | Portability and startup | A clean machine with Docker and Docker Compose shall start the web application, API and PostgreSQL with one `docker-compose up --build` command. All health checks shall pass within 2 minutes after images are available. | Clean-environment Compose smoke test and recorded health-check output. |
| NFR-08 | Persistence and recovery | Restarting or recreating application containers shall preserve PostgreSQL records and uploaded CVs in named volumes. A documented backup shall restore both stores successfully in a test environment. | Create test records and a CV, restart/recreate containers, then perform one backup-and-restore test with zero missing test records/files. |
| NFR-09 | Observability | Authentication failures, authorization denials, matching-run start/end/failure, appointment state changes and external-service failures shall produce structured logs with timestamp, severity, event name and a request/run identifier. Passwords, bearer tokens, CV content and change-request explanations shall never appear in logs. | Automated log assertions for each event category and a secret/personal-data scan with zero forbidden values. |

## 2. Security requirements

| ID | Category | Requirement and measurable target | Verification |
|---|---|---|---|
| SEC-01 | Password protection | Passwords shall be processed by Django's password hashing framework and shall never be stored or logged in plaintext. The accepted password length shall be 8–128 characters as defined by the API contract. | Database and log inspection after registration/login tests; 100% of stored values shall be non-plaintext hashes and invalid lengths shall return 400. |
| SEC-02 | Account verification | A newly registered student account shall remain inactive until a valid, unused verification token is presented. A token shall be single-use; reused, invalid or expired tokens shall never activate an account. | Automated tests for valid, reused, invalid and expired tokens; all negative cases rejected. |
| SEC-03 | Authentication tokens | Every protected API operation shall reject a missing, malformed, invalid or expired bearer token with 401. Token lifetime and signing configuration shall be supplied through secure settings rather than source code. | Parameterized authentication tests across every protected OpenAPI tag; 100% of invalid-token requests return 401. |
| SEC-04 | Role-based authorization | Student, advisor and administrator permissions shall follow the SRS. A valid user attempting an operation outside their role shall receive 403 and shall not change persistent data. | Authorization matrix tests for every protected operation and role; zero unauthorized successful responses or database changes. |
| SEC-05 | Ownership and privacy | GPA shall be visible only to the student and their assigned advisor; a CV only to the student and assigned advisor; an advisor-change explanation only to the student and administrators. When the assigned advisor changes, the old advisor's CV/GPA access shall end immediately. | Cross-account access tests before and after reassignment; 100% of forbidden reads return 403 or an equivalent non-disclosing response. |
| SEC-06 | File-upload protection | CV upload shall accept exactly one file that is both declared and content-validated as PDF and no larger than 2,097,152 bytes. Invalid type, magic bytes or size shall return 400, and the stored filename shall not be used as an executable path. | Boundary tests at 2,097,152 and 2,097,153 bytes, MIME/magic-byte mismatch tests and path-manipulation filenames; all invalid inputs rejected. |
| SEC-07 | Input validation | Server-side validation shall enforce the student e-mail pattern, GPA/year/interest bounds, appointment transitions, cancellation boundary and change-request length regardless of client behavior. Invalid input shall cause no partial database update. | Positive, negative and boundary tests for every rule; 100% of invalid cases rejected with the documented 400/409 response. |
| SEC-08 | Abuse and enumeration resistance | Verification-resend requests shall use a configurable rate limit and return 429 after the configured threshold. The normal response shall not reveal whether an e-mail address exists. | Send threshold + 1 requests and compare registered/unregistered responses; final request returns 429 and normal response bodies are indistinguishable. |
| SEC-09 | Transport and secrets | Production browser/API traffic shall use HTTPS. Database, Django, e-mail and Google credentials shall come from environment or deployment secrets; no real secret shall be committed to Git or included in a client bundle. | Deployment configuration review plus automated secret scan; zero real secrets in repository history and no production HTTP endpoint. |
| SEC-10 | Service isolation | PostgreSQL and the scheduler shall not expose public ports. Only the API may read database rows or CV storage, and the database account shall have only the permissions needed by the application. | Docker network/port inspection and connection tests from outside the private network; all direct external database attempts fail. |

## 3. Traceability

| Requirement group | Main source | Quality measure (`docs/quality-measures.md`) |
|---|---|---|
| NFR-01, NFR-02 | SRS Sections 3.4 and 6; D-20 | QM-01 API response time, QM-02 weekly matching run |
| NFR-03, NFR-04 | SRS FR-32, FR-34 and data-integrity rules | QM-10 reliability, QM-05 appointment state integrity |
| NFR-05 | SRS Section 4.1; D-01 | QM-08 usability |
| NFR-06 | Sprint 3 coverage requirement | Unit test coverage target (50%, CI gate) |
| NFR-07, NFR-08 | SRS Section 2.3; D-27 | QM-09 portability |
| NFR-09 | Security, operations and external integrations | QM-10 reliability (failure logging) |
| SEC-01 to SEC-04 | SRS FR-01 to FR-10; OpenAPI bearer authentication | QM-06 security |
| SEC-05 | SRS FR-40; D-26 | QM-07 privacy (KVKK) |
| SEC-06, SEC-07 | SRS FR-36 and functional boundaries | QM-04 input and file validation, QM-03 cancellation lock |
| SEC-08 | SRS FR-04 | QM-06 security (rate-limit and enumeration tests) |
| SEC-09, SEC-10 | D-27 and `docs/architecture/deployment.md` | QM-09 portability (deployment and secret checks) |

## 4. Acceptance evidence

The requirements are considered verified only when the referenced automated test or review evidence is linked from the implementing pull request or CI run. A requirement is not satisfied merely because it is written here. Threshold changes require a documented decision and corresponding updates to this file, `docs/quality-measures.md` and the affected tests.
