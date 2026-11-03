# Test Scenario Matrix

## 1. Purpose

This document defines the test scenario matrix for the Career Advisor Matching and Appointment System, covering functional, validation, and integration tests mapped to acceptance criteria and backlog stories.

---

## 2. Student Profile Management Tests (Linked to US-01)

| Test ID | Scenario Description | Expected Outcome | Associated AC / Story |
| :--- | :--- | :--- | :--- |
| **AT-SP-01** | Student enters valid profile details (department, grade, GPA, keywords). | Profile is saved successfully. | AC-SP-01 / US-01 |
| **AT-SP-02** | Student enters GPA within boundaries (0.0 to 4.0). | GPA is accepted. | AC-SP-02 / US-01 |
| **AT-SP-03** | Student enters invalid GPA (< 0.0 or > 4.0). | Rejected with HTTP 400 Bad Request. | AC-SP-03 / US-01 |
| **AT-SP-04** | Student enters valid grade level (1 to 4). | Grade level is accepted. | AC-SP-04 / US-01 |
| **AT-SP-05** | Student enters invalid grade level outside 1-4. | Rejected with HTTP 400 Bad Request. | AC-SP-05 / US-01 |
| **AT-SP-06** | Student selects 1 to 5 predefined keywords. | Keywords are accepted. | AC-SP-06 / US-01 |
| **AT-SP-07** | Student selects 0 or >5 keywords. | Profile submission is rejected. | AC-SP-07 / US-01 |

---

## 3. Account Security & Email Verification Tests (Linked to US-02)

| Test ID | Scenario Description | Expected Outcome | Associated AC / Story |
| :--- | :--- | :--- | :--- |
| **AT-EV-01** | User registers with a valid email address. | Verification email is sent, status is `Pending Verification`. | AC-EV-01 / US-02 |
| **AT-EV-02** | User clicks valid email verification link. | Account status becomes `Active` and login is enabled. | AC-EV-02 / US-02 |

---

## 4. Weekly & 3-Round Advisor Matching Tests (Linked to US-03)

| Test ID | Scenario Description | Expected Outcome | Associated AC / Story |
| :--- | :--- | :--- | :--- |
| **AT-AM-01** | Weekly scheduled matching job runs for pending students. | Executes 3-round CV matching algorithm. | AC-AM-01 / US-03 |
| **AT-AM-02** | 3-round matching execution sequence. | Follows Round 1 (Dept + Keywords), Round 2 (Grade + Keywords), Round 3 (General Capacity). | AC-AM-02 / US-03 |
| **AT-AM-03** | Student and advisor share the same department. | Advisor receives +1 bonus score. | AC-AM-03 / US-03 |
| **AT-AM-04** | Advisor serves student's grade level. | Advisor receives +1 bonus score. | AC-AM-04 / US-03 |
| **AT-AM-05** | Matching score calculation formula check. | Score correctly totals keywords, department, and grade points. | AC-AM-05 / US-03 |
| **AT-AM-06** | Tie-breaking rule between advisors with equal scores. | Advisor with fewer assigned students is selected. | AC-AM-06 / US-03 |
| **AT-AM-07** | Advisor reaches maximum capacity of 30 students. | Advisor is excluded from eligible candidates. | AC-AM-07 / US-03 |
| **AT-AM-08** | No advisor meets criteria after 3 rounds. | Student status remains `Pending Matching`. | AC-AM-08 / US-03 |

---

## 5. Appointment Management & Approval Tests (Linked to US-04, US-05)

| Test ID | Scenario Description | Expected Outcome | Associated AC / Story |
| :--- | :--- | :--- | :--- |
| **AT-AP-01** | Student requests an available office-hour slot. | Appointment is created with status `Pending Approval`. | AC-AP-01 / US-04 |
| **AT-AP-02** | Advisor approves pending appointment request. | Status changes to `Booked` and notifications are sent. | AC-AP-02 / US-04 |
| **AT-AP-03** | Advisor rejects appointment request with reason. | Status changes to `Rejected` and slot becomes available. | AC-AP-03 / US-04 |
| **AT-AP-04** | Approved appointment generates Google Meet link. | Google Meet link is generated and added to invitation. | AC-AP-04 / US-05 |
| **AT-AP-05** | Student attempts to book already requested/booked slot. | Rejected with HTTP 409 Conflict. | AC-AP-05 / US-04 |
| **AT-AP-06** | Student attempts to book a past slot. | Booking request is rejected. | AC-AP-06 / US-04 |
| **AT-AP-07** | Student or advisor cancels appointment $\ge$ 30 minutes prior. | Status changes to `Cancelled`, Meet link is invalidated. | AC-AP-07 / US-04 |
| **AT-AP-08** | User attempts to cancel appointment $<$ 30 minutes prior. | Cancellation is rejected, status remains `Booked`. | AC-AP-08 / US-04 |
| **AT-AP-09** | Advisor marks appointment as completed. | Status changes to `Completed`. | AC-AP-09 / US-04 |

---

## 6. Advisor Change Requests Tests (Linked to US-06)

| Test ID | Scenario Description | Expected Outcome | Associated AC / Story |
| :--- | :--- | :--- | :--- |
| **AT-CR-01** | Student submits advisor change request with valid explanation ($\ge$ 20 chars). | Request is accepted. | AC-CR-01 / US-06 |
| **AT-CR-02** | Student submits change request with short explanation ($<$ 20 chars). | Request is rejected. | AC-CR-02 / US-06 |
| **AT-CR-03** | Student with active pending request tries to submit another. | System prevents duplicate pending request. | AC-CR-03 / US-06 |
| **AT-CR-04** | Admin approves advisor change request. | Triggers new weekly matching cycle excluding previous advisor. | AC-CR-04 / US-06 |
| **AT-CR-05** | Admin rejects advisor change request with reason. | Request is marked as rejected, reason recorded. | AC-CR-05 / US-06 |
| **AT-CR-06** | Approved change request cancels future appointments & notifies old advisor. | Future appointments cancelled, email sent to previous advisor. | AC-CR-06 / US-06 |
All detailed test cases in this section are planned test cases. They will be executed after the corresponding system features and API endpoints are implemented.

