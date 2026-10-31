# Acceptance Criteria Draft

## 1. Purpose

This document defines the draft acceptance criteria for the Career Counseling Matching and Appointment System.

The criteria describe the conditions that each system feature must satisfy to be considered complete and acceptable.

These criteria are prepared as a QA contribution to Product Backlog Issue #17. They will be reviewed and aligned with the final user stories in `docs/backlog.md` when the Product Owner completes the backlog.

---

## 2. Student Profile Management

### AC-SP-01: Valid Student Profile

**Given** a student is creating or updating their profile,

**When** the student enters a valid department, grade level, GPA, and expertise keywords,

**Then** the system should accept and save the profile successfully.

### AC-SP-02: GPA Boundary Validation

**Given** a student is entering their GPA,

**When** the student enters a value between 0.0 and 4.0, including both boundaries,

**Then** the system should accept the value.

### AC-SP-03: Invalid GPA

**Given** a student is entering their GPA,

**When** the student enters a value below 0.0 or above 4.0,

**Then** the system should reject the request with HTTP 400 Bad Request.

### AC-SP-04: Grade Level Validation

**Given** a student is entering their grade level,

**When** the student enters a value from 1 to 4,

**Then** the system should accept the value.

### AC-SP-05: Invalid Grade Level

**Given** a student is entering their grade level,

**When** the student enters a value outside the range of 1 to 4,

**Then** the system should reject the request with HTTP 400 Bad Request.

### AC-SP-06: Expertise Keyword Limit

**Given** a student is selecting expertise keywords,

**When** the student selects between 1 and 5 predefined keywords,

**Then** the system should accept the selection.

### AC-SP-07: Invalid Expertise Keyword Selection

**Given** a student is selecting expertise keywords,

**When** the student selects no keywords or more than 5 keywords,

**Then** the system should reject the profile submission.

---

## 3. Advisor Matching

### AC-AM-01: Minimum Keyword Match

**Given** a student and an advisor share at least one expertise keyword,

**When** the matching process runs and the advisor has available capacity,

**Then** the advisor should be considered an eligible candidate.

### AC-AM-02: Highest Matching Score

**Given** multiple eligible advisors are available,

**When** the system calculates their matching scores,

**Then** the advisor with the highest score should be selected.

### AC-AM-03: Department Match

**Given** a student and an eligible advisor belong to the same department,

**When** the matching score is calculated,

**Then** the advisor should receive 1 additional point.

### AC-AM-04: Grade Level Match

**Given** an advisor serves the student's grade level,

**When** the matching score is calculated,

**Then** the advisor should receive 1 additional point.

### AC-AM-05: Matching Score Calculation

**Given** an eligible advisor and a student share expertise keywords,

**When** the system calculates the matching score,

**Then** the score should follow this formula:

`(Number of common keywords × 2) + Same department (+1) + Grade served (+1)`

### AC-AM-06: Tie-Breaking Rule

**Given** two or more eligible advisors have the same matching score,

**When** the system selects an advisor,

**Then** the advisor with fewer assigned students should be selected.

### AC-AM-07: Advisor Capacity

**Given** an advisor has reached the maximum capacity of 30 students,

**When** the matching process runs,

**Then** that advisor should not be considered an eligible candidate.

### AC-AM-08: No Eligible Advisor

**Given** no advisor meets the minimum matching requirements or has available capacity,

**When** the matching process runs,

**Then** the student's matching status should become `Pending Matching`.

---

## 4. Appointment Management

### AC-AP-01: Successful Appointment Booking

**Given** a student has an assigned advisor and an available office-hour slot,

**When** the student books that slot,

**Then** the system should create the appointment successfully with status `Booked`.

### AC-AP-02: Only Assigned Advisor's Slots

**Given** a student has an assigned advisor,

**When** the student attempts to book an appointment,

**Then** the system should only allow booking from their assigned advisor's available office hours.

### AC-AP-03: Prevent Double Booking

**Given** an office-hour slot has already been booked,

**When** another student attempts to book the same slot,

**Then** the system should reject the request with HTTP 409 Conflict.

### AC-AP-04: One Active Appointment Per Student

**Given** a student already has an active appointment,

**When** the student attempts to book another appointment,

**Then** the system should reject the request according to the appointment rules.

### AC-AP-05: Prevent Past Appointments

**Given** an office-hour slot is in the past,

**When** a student attempts to book that slot,

**Then** the system should reject the booking request.

### AC-AP-06: Appointment Cancellation

**Given** a student has an appointment with status `Booked`,

**When** the student cancels their own appointment,

**Then** the appointment status should change to `Cancelled`.

### AC-AP-07: Appointment Completion

**Given** an advisor has conducted an appointment,

**When** the advisor marks the appointment as completed,

**Then** the appointment status should change to `Completed`.

---

## 5. Advisor Change Requests

### AC-CR-01: Submit Advisor Change Request

**Given** a student has an assigned advisor,

**When** the student selects a reason and provides an explanation containing at least 20 characters,

**Then** the system should accept the advisor change request.

### AC-CR-02: Required Explanation

**Given** a student is submitting an advisor change request,

**When** the explanation contains fewer than 20 characters,

**Then** the system should reject the request.

### AC-CR-03: One Pending Request

**Given** a student already has a pending advisor change request,

**When** the student attempts to submit another request,

**Then** the system should prevent the creation of another pending request.

### AC-CR-04: Admin Approval

**Given** an administrator reviews a pending advisor change request,

**When** the administrator approves the request,

**Then** the system should initiate a new advisor matching process that excludes the previous advisor.

### AC-CR-05: Admin Rejection

**Given** an administrator reviews a pending advisor change request,

**When** the administrator rejects the request and provides a reason,

**Then** the request should be marked as rejected and the rejection reason should be recorded.

### AC-CR-06: Cancel Future Appointments After Approval

**Given** an advisor change request has been approved,

**When** the student is assigned a new advisor,

**Then** future appointments with the previous advisor should be cancelled and the student should be notified by email.

---

## 6. Advisor Management

### AC-AD-01: Manage Expertise Keywords

**Given** an advisor is updating their profile,

**When** the advisor selects their expertise keywords,

**Then** the system should save the selected keywords.

### AC-AD-02: Manage Grade Levels

**Given** an advisor is updating their profile,

**When** the advisor specifies the grade levels they serve,

**Then** the system should save the selected grade levels.

### AC-AD-03: Manage Office Hours

**Given** an advisor is managing their availability,

**When** the advisor creates or updates office-hour slots,

**Then** the system should display the available slots for eligible students.

### AC-AD-04: View Assigned Students

**Given** an advisor is logged in,

**When** the advisor views their student list,

**Then** only students assigned to that advisor should be displayed.

---

## 7. Administration and Privacy

### AC-PR-01: View Pending Matching Students

**Given** a student has the matching status `Pending Matching`,

**When** an administrator views pending matching records,

**Then** the student should be visible in the administrator's list.

### AC-PR-02: GPA Privacy

**Given** a user does not have permission to view a student's GPA,

**When** that user attempts to access the GPA,

**Then** the system should deny access to the information.

### AC-PR-03: Advisor Change Explanation Privacy

**Given** an advisor change request contains a private explanation,

**When** an advisor attempts to access that explanation,

**Then** the system should deny access.

### AC-PR-04: Admin Access to Change Requests

**Given** an administrator is authorized,

**When** the administrator views advisor change requests,

**Then** the administrator should be able to access the request details and explanations.

---

## 8. QA Notes

- These acceptance criteria are draft requirements prepared for Product Backlog Issue #17.
- Final wording and story mapping must be reviewed with the Product Owner.
- HTTP 400 Bad Request is specified for invalid input values.
- HTTP 409 Conflict is specified for an already occupied appointment slot.
- Other HTTP response codes should be confirmed in the OpenAPI contract.
- These criteria will be used as the basis for future acceptance testing and API testing with Postman.
- Test execution will take place after the corresponding application features are implemented.
