# Quality Measures

## Unit Test Coverage Target

- **Target:** At least **50%** unit test coverage across core application and matching/appointment logic.
- **Tool & CI Enforcement:** Measured with `pytest-cov`; if total test coverage drops below **50%** in GitHub Actions CI, the build fails.

## Quality Measure Metrics, Tools, and Thresholds

- **API Response Time (`QM-01`):** `p95` response time `< 500 ms` under simulated load of **50 concurrent users for 5 minutes**, measured with **Locust**.
- **Weekly Matching Batch Execution (`QM-02`):** Scheduled Sunday `22:00` (`Europe/Istanbul`) batch run completes within **5 minutes** with `0` overlapping runs and `0` missed/duplicate assignments, verified with automated batch/integration tests and execution logs.
- **Cancellation Lock Enforcement (`QM-03`):** Appointment cancellation requests within `30` minutes (`<= 30 minutes` before start time, boundary at `30` minutes) are rejected for **both students and advisors** (`100%` blocked), verified with API and boundary tests.
- **Input & File Validation (`QM-04`):** Institutional student e-mail format (`s` + 9 digits) and CV PDF size limit (`<= 2 MB`) are enforced consistently (`100%` invalid inputs rejected), verified with validation/unit tests.
- **Appointment State Integrity (`QM-05`):** Appointment statuses (`REQUESTED`, `CONFIRMED`, `REJECTED`, `CANCELLED`, `COMPLETED`, `NO_SHOW`) follow valid state transitions only (`100%` valid transitions), verified with unit, state-transition, and coverage (`pytest-cov`) tests.
- **Security (`QM-06`):** Unauthorized access to another role's endpoints returns `403` (`100%` blocked) and user passwords are stored hashed (`100%` hashed), verified with Pytest / Django auth & security tests.
- **Privacy / KVKK (`QM-07`):** GPA and uploaded CV data are visible only to the owning student and their assigned advisor (`0` unauthorized exposures), verified with Pytest / API access-control tests.
- **Usability (`QM-08`):** Workflows render cleanly on desktop (`1440 x 1024 px`) and mobile (`393 x 852 px`) with `0` layout/overflow issues, and appointment booking completes in `< 2 minutes`, verified with browser/responsive checks and usability test timing.
- **Portability (`QM-09`):** Application stack starts cleanly with a single `docker-compose up` command and passes health checks within `< 2 minutes`, verified with Docker Compose / CI smoke tests.
- **Reliability (`QM-10`):** Appointment booking/update succeeds (`100%` success rate) even when email notification delivery fails, verified with Pytest / integration tests with mocked email failure.

## Quality Measure Test Mapping Table

| QM ID | Quality Measure | Metric | Tool | Target Threshold | Test Type / Scope |
| :--- | :--- | :--- | :--- | :--- | :--- |
| QM-01 | API performance | Response latency (`p95`) | Locust | `< 500 ms` (50 users, 5 min) | Load / API performance test |
| QM-02 | Sunday 22:00 batch matching | Batch duration & accuracy (`Europe/Istanbul`) | Pytest / Django test + logs | Completes `< 5 min`; `0` failed/overlapping runs | Integration & batch test |
| QM-03 | 30-minute cancellation lock (student & advisor) | Lock enforcement rate & boundary | Pytest / API test | `100%` blocked within `<= 30 min` (both roles) | API & boundary test |
| QM-04 | Email (`s` + 9 digits) & CV PDF (`<= 2 MB`) | Validation accuracy | Unit / API test | `100%` invalid inputs rejected | Unit & validation test |
| QM-05 | Appointment status lifecycle | Valid state transitions | Pytest / `pytest-cov` | `100%` valid transitions | Unit & state-transition test |
| QM-06 | Security (role `403` & hashed passwords) | Forbidden status & password hashing | Pytest / security test | `403` on unauthorized role; `100%` hashed passwords | Security & auth test |
| QM-07 | Privacy / KVKK (GPA & CV visibility) | Access restriction compliance | Pytest / API auth test | Visible only to student & own advisor (`0` leaks) | Privacy / access-control test |
| QM-08 | Usability (desktop/mobile & booking `< 2 min`) | Layout integrity & booking duration | Browser check & timed usability test | `0` layout issues (`1440x1024` & `393x852`); `< 2 min` booking | Usability & UI check |
| QM-09 | Portability (`docker-compose up`) | Single-command startup & health | Docker Compose / CI | Clean start `< 2 min` via `docker-compose up` | Deployment / smoke test |
| QM-10 | Reliability (appointment despite email failure) | Appointment success under email error | Pytest / integration test | `100%` appointment success when email fails | Reliability / fault-injection test |
