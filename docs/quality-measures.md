# Quality Measures

## Unit Test Coverage Target
- **Target:** At least **50%** unit test coverage across core application and matching/appointment logic.

## NFR Metrics, Tools, and Thresholds
- **API Response Time (`NFR-01`):** p95 response time `< 500 ms` under expected load, measured with **Locust**.
- **Weekly Matching Batch Execution (`NFR-02`):** Scheduled Sunday `22:00` batch run completes cleanly without overlapping runs or missed/duplicate assignments, verified with automated batch/integration tests and execution logs.
- **Cancellation Lock Enforcement (`NFR-03`):** Appointment cancellation requests within `30` minutes of start time are consistently rejected, verified with API and integration tests.
- **Input & File Validation (`NFR-04`):** Institutional student e-mail format (`s` + 9 digits) and CV PDF size limit (`<= 2 MB`) are enforced consistently, verified with validation/unit tests.
- **Appointment State Integrity (`NFR-05`):** Appointment statuses (`REQUESTED`, `CONFIRMED`, `REJECTED`, `CANCELLED`, `COMPLETED`, `NO_SHOW`) follow valid state transitions only, verified with unit and state-transition tests.

## NFR Test Mapping Table

| NFR ID | Non-Functional Requirement | Metric | Tool | Target Threshold | Test Type / Scope |
| :--- | :--- | :--- | :--- | :--- | :--- |
| NFR-01 | API performance | Response latency (p95) | Locust | `< 500 ms` | Load / API performance test |
| NFR-02 | Sunday 22:00 batch matching | Batch completion & accuracy | Pytest / Django test + logs | 0 failed/overlapping runs | Integration & batch test |
| NFR-03 | 30-minute cancellation lock | Lock enforcement rate | Pytest / API test | 100% blocked inside 30 min | API & boundary test |
| NFR-04 | Email (`s`+9 digits) & CV PDF (`<= 2 MB`) | Validation accuracy | Unit / API test | 100% invalid inputs rejected | Unit & validation test |
| NFR-05 | Appointment status lifecycle | Valid state transitions | Unit test | 100% valid transitions; `>= 50%` total unit coverage | Unit test |
