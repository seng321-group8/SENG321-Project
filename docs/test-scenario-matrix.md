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

## 7. Detailed Test Cases

This section provides detailed test cases for the main functional requirements of the system. These test cases define the preconditions, test data, execution steps, and expected results. All tests are currently planned and have not yet been executed.

### 7.1 Advisor Matching Tests

**DTC-MT-01: Select the Advisor with the Highest Matching Score**

- **Preconditions:**
  - At least two advisors are registered and available.
  - Both advisors have available capacity.
- **Test Data:**
  - Student department: Computer Engineering
  - Student grade: 2
  - Student keywords: Java, Data Science
  - Advisor A: Computer Engineering, serves grade 2, keywords Java and Data Science
  - Advisor B: Different department, does not serve grade 2, keyword Java
- **Test Steps:**
  1. Create a student profile using the specified information.
  2. Run the advisor matching process.
  3. Check the matching scores of both advisors.
  4. Check which advisor is assigned.
- **Expected Result:**
  - Advisor A receives a higher score and is assigned to the student.

**DTC-MT-02: Apply the Tie-Breaking Rule**

- **Preconditions:**
  - Two eligible advisors have the same matching score.
  - Both advisors have available capacity.
- **Test Data:**
  - Student keyword: Java
  - Advisor A: Java keyword, 10 currently assigned students
  - Advisor B: Java keyword, 5 currently assigned students
- **Test Steps:**
  1. Create the student profile.
  2. Run the matching process.
  3. Compare the advisors' matching scores.
  4. Check their current student counts.
- **Expected Result:**
  - Both advisors have the same score.
  - Advisor B is assigned because they have fewer assigned students.

**DTC-MT-03: Exclude an Advisor at Full Capacity**

- **Preconditions:**
  - One advisor has reached the default capacity of 30 students.
  - Another eligible advisor has available capacity.
- **Test Steps:**
  1. Prepare a student profile that matches both advisors' expertise keywords.
  2. Run the matching process.
  3. Check advisor eligibility.
- **Expected Result:**
  - The advisor with 30 assigned students is excluded.
  - The student is matched with the eligible advisor who has available capacity.

### 7.2 Appointment Tests

**DTC-AT-01: Prevent Double Booking of an Office-Hour Slot**

- **Preconditions:**
  - An advisor has an available office-hour slot.
  - Student A has already booked this slot.
- **Test Steps:**
  1. Log in as Student B.
  2. Attempt to book the same office-hour slot.
  3. Check the server response.
- **Expected Result:**
  - The booking is rejected.
  - The system returns HTTP 409 Conflict.
  - The existing appointment remains unchanged.

**DTC-AT-02: Prevent Multiple Active Appointments**

- **Preconditions:**
  - The student already has an appointment with Booked status.
- **Test Steps:**
  1. Log in as the same student.
  2. Attempt to book another appointment.
  3. Check the result.
- **Expected Result:**
  - The system rejects the second active appointment.
  - The student cannot have more than one active appointment at a time.

### 7.3 Input Validation Tests

**DTC-VT-01: Validate GPA Boundary Values**

- **Test Data:**
  - Valid GPA values: 0.0 and 4.0
  - Invalid GPA values: -0.1 and 4.1
- **Test Steps:**
  1. Submit a student profile with GPA 0.0.
  2. Submit a student profile with GPA 4.0.
  3. Submit a student profile with GPA -0.1.
  4. Submit a student profile with GPA 4.1.
- **Expected Result:**
  - GPA values between 0.0 and 4.0, including boundaries, are accepted.
  - Values outside this range are rejected with HTTP 400 Bad Request.

**DTC-VT-02: Validate Student Grade**

- **Test Data:**
  - Valid grades: 1 and 4
  - Invalid grades: 0 and 5
- **Test Steps:**
  1. Submit profiles with grades 1 and 4.
  2. Submit profiles with grades 0 and 5.
- **Expected Result:**
  - Grades 1 through 4 are accepted.
  - Grades outside this range are rejected with HTTP 400 Bad Request.

**DTC-VT-03: Validate Keyword Selection Limits**

- **Test Data:**
  - Valid keyword counts: 1 and 5
  - Invalid keyword counts: 0 and 6
- **Test Steps:**
  1. Submit a profile with one keyword.
  2. Submit a profile with five keywords.
  3. Submit a profile without any keywords.
  4. Submit a profile with six keywords.
- **Expected Result:**
  - Profiles containing between 1 and 5 keywords are accepted.
  - Profiles containing zero or more than five keywords are rejected with HTTP 400 Bad Request.

### 7.4 Test Execution Status

All detailed test cases in this section are planned test cases. They will be executed after the corresponding system features and API endpoints are implemented.

