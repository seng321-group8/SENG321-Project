# Test Scenario Matrix

## 1. Purpose

This document defines the planned test scenarios for the Career Counseling Matching and Appointment System.

The purpose is to verify the advisor matching rules, appointment booking constraints, input validation, authorization, and privacy requirements.

**Note:** These are planned test scenarios. They have not been executed yet because the application is not implemented.

## 2. Matching Algorithm Tests

| Test ID | Test Scenario | Expected Result |
|---|---|---|
| MT-01 | A student and an advisor share at least one expertise keyword, and the advisor has available capacity. | The advisor is considered an eligible candidate. |
| MT-02 | Multiple eligible advisors have different matching scores. | The advisor with the highest score is selected. |
| MT-03 | The student and advisor belong to the same department. | The matching score increases by 1 point. |
| MT-04 | The advisor serves the student's grade level. | The matching score increases by 1 point. |
| MT-05 | Two eligible advisors have the same matching score. | The advisor with fewer assigned students is selected. |
| MT-06 | An advisor has reached the maximum capacity of 30 students. | The advisor is excluded from matching. |
| MT-07 | No advisor shares at least one keyword with the student, or no eligible advisor has available capacity. | The student's matching status becomes Pending Matching. |
| MT-08 | The student's GPA is different from another student's GPA, while their matching criteria are otherwise identical. | GPA does not affect the matching score. |

## 3. Appointment and Conflict Tests

| Test ID | Test Scenario | Expected Result |
|---|---|---|
| AT-01 | A student books an available office-hour slot belonging to their assigned advisor. | The appointment is successfully created. |
| AT-02 | A student attempts to book a slot that has already been booked by another student. | The request is rejected with HTTP 409 Conflict. |
| AT-03 | A student attempts to create a second active appointment while already having one active appointment. | The request is rejected according to the appointment rules. |
| AT-04 | A student attempts to book an office-hour slot belonging to another advisor. | The request is rejected because the student can only book their assigned advisor's slots. |
| AT-05 | A student attempts to book an office-hour slot in the past. | The request is rejected. |
| AT-06 | A student cancels their own booked appointment. | The appointment status changes to Cancelled. |
| AT-07 | An advisor marks an appointment as completed. | The appointment status changes to Completed. |

## 4. Input Validation Tests

| Test ID | Test Scenario | Expected Result |
|---|---|---|
| VT-01 | A student enters GPA = 0. | The input is accepted. |
| VT-02 | A student enters GPA = 4.0. | The input is accepted. |
| VT-03 | A student enters GPA = 4.5. | The request is rejected with HTTP 400 Bad Request. |
| VT-04 | A student enters GPA = -0.5. | The request is rejected with HTTP 400 Bad Request. |
| VT-05 | A student enters grade = 1. | The input is accepted. |
| VT-06 | A student enters grade = 4. | The input is accepted. |
| VT-07 | A student enters grade = 5. | The request is rejected with HTTP 400 Bad Request. |
| VT-08 | A student selects more than 5 expertise keywords. | The request is rejected with HTTP 400 Bad Request. |
| VT-09 | A student submits a profile without selecting any expertise keywords. | The request is rejected with HTTP 400 Bad Request. |

## 5. Authorization and Privacy Tests

| Test ID | Test Scenario | Expected Result |
|---|---|---|
| PT-01 | An unauthorized user attempts to view a student's GPA. | Access is denied. |
| PT-02 | An advisor attempts to view the private explanation of a student's advisor-change request. | Access is denied. |
| PT-03 | An advisor views their assigned students. | Only students assigned to that advisor are displayed. |
| PT-04 | An administrator views pending advisor-change requests. | The administrator can access the requests and their explanations. |

## 6. Testing Notes

- HTTP 400 Bad Request is expected for invalid input values.
- HTTP 409 Conflict is expected when a student attempts to book an already occupied appointment slot.
- Other authorization and appointment rejection status codes should be confirmed in the OpenAPI contract.
- These scenarios will be used as a basis for future acceptance testing and API testing with Postman.
