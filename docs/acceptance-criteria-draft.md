# Acceptance Criteria Draft

## 1. Purpose

This document defines the draft acceptance criteria for the Career Advisor Matching and Appointment System.

The criteria describe the conditions that each system feature must satisfy to be considered complete and acceptable.

These criteria are prepared as a QA contribution to Product Backlog Issue #17. They will be reviewed and aligned with the final user stories in `docs/backlog.md` when the Product Owner completes the backlog.

---

## 2. Student Profile Management (Linked to US-01)

### AC-SP-01: Valid Student Profile (Linked to US-01)

**Given** a student is creating or updating their profile,

**When** the student enters a valid department, grade level, GPA, and expertise keywords,

**Then** the system should accept and save the profile successfully.

### AC-SP-02: GPA Boundary Validation (Linked to US-01)

**Given** a student is entering their GPA,

**When** the student enters a value between 0.0 and 4.0, including both boundaries,

**Then** the system should accept the value.

### AC-SP-03: Invalid GPA (Linked to US-01)

**Given** a student is entering their GPA,

**When** the student enters a value below 0.0 or above 4.0,

**Then** the system should reject the request with HTTP 400 Bad Request.

### AC-SP-04: Grade Level Validation (Linked to US-01)

**Given** a student is entering their grade level,

**When** the student enters a value from 1 to 4,

**Then** the system should accept the value.

### AC-SP-05: Invalid Grade Level (Linked to US-01)

**Given** a student is entering their grade level,

**When** the student enters a value outside the range of 1 to 4,

**Then** the system should reject the request with HTTP 400 Bad Request.

### AC-SP-06: Expertise Keyword Limit (Linked to US-01)

**Given** a student is selecting expertise keywords,

**When** the student selects between 1 and 5 predefined keywords,

**Then** the system should accept the selection.

### AC-SP-07: Invalid Expertise Keyword Selection (Linked to US-01)

**Given** a student is selecting expertise keywords,

**When** the student selects no keywords or more than 5 keywords,

**Then** the system should reject the profile submission.

---

## 3. Account Security & Email Verification (Linked to US-02)

### AC-EV-01: Account Registration Email Verification (Linked to US-02)

**Given** a student or advisor registers a new account,

**When** the user submits their valid email address,

**Then** the system should send a verification link via email and keep the account status as `Pending Verification`.

### AC-EV-02: Complete Email Verification (Linked to US-02)

**Given** a user has received a verification email,

**When** the user clicks the verification link within the expiration time,

**Then** the account status should change to `Active` and allow login.

---

## 4. Weekly & 3-Round Advisor Matching (Linked to US-03)

### AC-AM-01: Weekly Batch Matching Execution (Linked to US-03)

**Given** students are waiting for matching in status `Pending Matching`,

**When** the system triggers the scheduled weekly matching job,

**Then** the system should execute the 3-round CV matching algorithm for all pending students.

### AC-AM-02: 3-Round Matching Process (Linked to US-03)

**Given** the weekly matching process starts,

**When** the system evaluates candidates,

**Then** it must execute 3 rounds: 
- **Round 1:** Exact department and highest expertise keyword match.
- **Round 2:** Grade level match with shared keywords.
- **Round 3:** General keyword matching across available advisor capacities.

### AC-AM-03: Department Match (Linked to US-03)

**Given** a student and an eligible advisor belong to the same department,

**When** the matching score is calculated,

**Then** the advisor should receive 1 additional point.

### AC-AM-04: Grade Level Match (Linked to US-03)

**Given** an advisor serves the student's grade level,

**When** the matching score is calculated,

**Then** the advisor should receive 1 additional point.

### AC-AM-05: Matching Score Calculation (Linked to US-03)

**Given** an eligible advisor and a student share expertise keywords,

**When** the system calculates the matching score during the weekly 3-round evaluation,

**Then** the score should follow this formula:

`(Number of common keywords × 2) + Same department (+1) + Grade served (+1)`

### AC-AM-06: Tie-Breaking Rule (Linked to US-03)

**Given** two or more eligible advisors have the same matching score,

**When** the system selects an advisor,

**Then** the advisor with fewer assigned students should be selected.

### AC-AM-07: Advisor Capacity (Linked to US-03)

**Given** an advisor has reached the maximum capacity of 30 students,

**When** the matching process runs,

**Then** that advisor should not be considered an eligible candidate.

### AC-AM-08: No Eligible Advisor (Linked to US-03)

**Given** no advisor meets the minimum matching requirements or has available capacity after 3 rounds,

**When** the weekly matching process concludes,

**Then** the student's matching status should remain `Pending Matching`.

---

## 5. Appointment Management & Approvals (Linked to US-04, US-05)

### AC-AP-01: Appointment Request Submission (Linked to US-04)

**Given** a student has an assigned advisor and an available office-hour slot,

**When** the student requests an appointment,

**Then** the system should create the appointment request with status `Pending Approval`.

### AC-AP-02: Advisor Approval Process (Linked to US-04)

**Given** an advisor has a pending appointment request,

**When** the advisor approves the request,

**Then** the appointment status should change to `Booked` and notify both student and advisor.

### AC-AP-03: Advisor Rejection Process (Linked to US-04)

**Given** an advisor has a pending appointment request,

**When** the advisor rejects the request with a reason,

**Then** the appointment status should change to `Rejected` and the slot should become available again.

### AC-AP-04: Google Meet Link Generation (Linked to US-05)

**Given** an appointment request has been approved by the advisor,

**When** the status changes to `Booked`,

**Then** the system should automatically generate a Google Meet link and attach it to the appointment details and calendar invitation.

### AC-AP-05: Prevent Double Booking (Linked to US-04)

**Given** an office-hour slot has already been requested or booked,

**When** another student attempts to book the same slot,

**Then** the system should reject the request with HTTP 409 Conflict.

### AC-AP-06: Prevent Past Appointments (Linked to US-04)

**Given** an office-hour slot is in the past,

**When** a student attempts to book that slot,

**Then** the system should reject the booking request.

### AC-AP-07: Appointment Cancellation (30-Minute Window) (Linked to US-04)

**Given** a student or advisor has an appointment starting in 30 minutes or more,

**When** they cancel the appointment,

**Then** the appointment status should change to `Cancelled` and the Google Meet link should be invalidated.

### AC-AP-08: Late Cancellation Restriction (Linked to US-04)

**Given** an appointment is scheduled to start in less than 30 minutes,

**When** a user attempts to cancel the appointment,

**Then** the system should reject the cancellation request and the appointment status should remain `Booked`.

### AC-AP-09: Appointment Completion (Linked to US-04)

**Given** an advisor has conducted an appointment,

**When** the advisor marks the appointment as completed,

**Then** the appointment status should change to `Completed`.

---

## 6. Advisor Change Requests (Linked to US-06)

### AC-CR-01: Submit Advisor Change Request (Linked to US-06)

**Given** a student has an assigned advisor,

**When** the student selects a reason and provides an explanation containing at least 20 characters,

**Then** the system should accept the advisor change request.

### AC-CR-02: Required Explanation (Linked to US-06)

**Given** a student is submitting an advisor change request,

**When** the explanation contains fewer than 20 characters,

**Then** the system should reject the request.

### AC-CR-03: One Pending Request (Linked to US-06)

**Given** a student already has a pending advisor change request,

**When** the student attempts to submit another request,

**Then** the system should prevent the creation of another pending request.

### AC-CR-04: Admin Approval (Linked to US-06)

**Given** an administrator reviews a pending advisor change request,

**When** the administrator approves the request,

**Then** the system should initiate a new advisor matching process in the next weekly cycle that excludes the previous advisor.

### AC-CR-05: Admin Rejection (Linked to US-06)

**Given** an administrator reviews a pending advisor change request,

**When** the administrator rejects the request and provides a reason,

**Then** the request should be marked as rejected and the rejection reason should be recorded.

### AC-CR-06: Cancel Future Appointments After Approval (Linked to US-06)

**Given** an advisor change request has been approved,

**When** the student is assigned a new advisor,

**Then** future appointments with the previous advisor should be cancelled and the previous advisor should be notified by email.

---

## 7. Advisor Management (Linked to US-07)

### AC-AD-01: Manage Expertise Keywords (Linked to US-07)

**Given** an advisor is updating their profile,

**When** the advisor selects their expertise keywords,

**Then** the system should save the selected keywords.

### AC-AD-02: Manage Grade Levels (Linked to US-07)

**Given** an advisor is updating their profile,

**When** the advisor specifies the grade levels they serve,

**Then** the system should save the selected grade levels.

### AC-AD-03: Manage Office Hours (Linked to US-07)

**Given** an advisor is managing their availability,

**When** the advisor creates or updates office-hour slots,

**Then** the system should display the available slots for eligible students.

### AC-AD-04: View Assigned Students (Linked to US-07)

**Given** an advisor is logged in,

**When** the advisor views their student list,

**
