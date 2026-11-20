# Quality Measures

## Unit Test Coverage Target

- **Target:** At least **50%** unit test coverage across core application and matching/appointment logic.
- **Tool & CI Enforcement:** Measured with `pytest-cov`; if total test coverage drops below **50%** in GitHub Actions CI, the build fails.

## NFR Metrics, Tools, and Thresholds

- **API Response Time (`NFR-01`):** `p95` response time `< 500 ms` under simulated load of **50 concurrent users for 5 minutes**, measured with **Locust**.
- **Weekly Matching Batch Execution (`NFR-02`):** Scheduled Sunday `22:00` (`Europe/Istanbul`) batch run completes within **5 minutes** with `0` overlapping runs and `0` missed/duplicate assignments, verified with automated batch/integration tests and execution logs.
- **Cancellation Lock Enforcement (`NFR-03`):** Appointment cancellation requests within `30` minutes (`<= 30 minutes` before start time, boundary at `30` minutes) are rejected for **both students and advisors** (`100%` blocked), verified with API and boundary tests.
- **Input & File Validation (`NFR-04`):** Institutional student e-mail format (`s` + 9 digits) and CV PDF size limit (`<= 2 MB`) are enforced consistently (`100%` invalid inputs rejected), verified with validation/unit tests.
- **Appointment State Integrity (`NFR-05`):** Appointment statuses (`REQUESTED`, `CONFIRMED`, `REJECTED`, `CANCELLED`, `COMPLETED`, `NO_SHOW`) follow valid state transitions only (`100%` valid transitions), verified with unit, state-transition, and coverage (`pytest-cov`) tests.
- **Security & Privacy (`NFR-06`):** Role-based access permissions and privacy rules for GPA, advisor-change explanations, and uploaded CVs are enforced (`0` unauthorized access across roles), verified with authorization/security tests.
- **Usability on Mobile & Desktop (`NFR-07`):** Core student, advisor, and administrator workflows render cleanly without horizontal overflow or broken layouts on both desktop (`1440 x 1024 px`) and mobile (`393 x 852 px`) viewports, verified with responsive/UI checks.
- **Single-Command Deployment (`NFR-08`):** Application stack starts cleanly with a single `docker-compose up` command and passes health checks within `2 minutes`, verified with container/integration checks.
- **Maintainability (`NFR-09`):** Modular code structure, clear typing/linting/formatting checks in CI, and up-to-date documentation are maintained (`0` lint/type errors in CI), verified with static analysis and code review.

## NFR Test Mapping Table

| NFR ID | Non-Functional Requirement | Metric | Tool | Target Threshold | Test Type / Scope |
| :--- | :--- | :--- | :--- | :--- | :--- |
| NFR-01 | API performance | Response latency (`p95`) | Locust | `< 500 ms` (50 users, 5 min) | Load / API performance test |
| NFR-02 | Sunday 22:00 batch matching | Batch duration & accuracy (`Europe/Istanbul`) | Pytest / Django test + logs | Completes `< 5 min`; `0` failed/overlapping runs | Integration & batch test |
| NFR-03 | 30-minute cancellation lock (student & advisor) | Lock enforcement rate & boundary | Pytest / API test | `100%` blocked within `<= 30 min` (both roles) | API & boundary test |
| NFR-04 | Email (`s` + 9 digits) & CV PDF (`<= 2 MB`) | Validation accuracy | Unit / API test | `100%` invalid inputs rejected | Unit & validation test |
| NFR-05 | Appointment status lifecycle | Valid state transitions | Pytest / `pytest-cov` | `100%` valid transitions | Unit & state-transition test |
| NFR-06 | Security & privacy (roles, GPA, change reason, CV) | Unauthorized access rate | Pytest / API auth test | `0` unauthorized accesses | Security & access-control test |
| NFR-07 | Mobile & desktop usability | Viewport layout & usability | Browser / responsive check | `0` layout/overflow issues (`1440x1024` & `393x852`) | Usability / UI check |
| NFR-08 | Single `docker-compose` startup | Startup success & time | Docker Compose / CI | Clean boot `< 2 min` via single command | Deployment / smoke test |
| NFR-09 | Maintainability | Lint, type & structure checks | CI linter / `pytest-cov` | `0` CI check failures; `>= 50%` coverage | Static & coverage check |
