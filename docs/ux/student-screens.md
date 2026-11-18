# Student Screens

Figma design file: [LINK](https://www.figma.com/design/4EBRTQr6qI3nCYrgwtjXFN/Career-Advisor-Matching---Screens?node-id=0-1&t=FTJWB3RPnHpztpoo-1)

Each screen is designed for two sizes:

| Device | Frame size |
|---|---|
| Desktop | 1440 x 1024 px |
| Phone (iPhone 14 & 15 Pro) | 393 x 852 px |

The screens follow the student flow in [user-flows.md](user-flows.md).

## 1. Log in and register

Students log in with the school email (s + 9 digits, for example s123456789@ankarabilim.edu.tr). New students switch to Register and click the verification link sent to their inbox.

![Log in, desktop](images/1-auth-desktop.png)
![Log in, mobile](images/1-auth-mobile.png)

## 2. Student profile

The student enters year, department, GPA and interests, and can upload a CV (PDF, optional). The profile is used for the weekly advisor matching.

![Profile, desktop](images/2-profile-desktop.png)
![Profile, mobile](images/2-profile-mobile.png)

## 3. My advisor

The student sees the assigned advisor, the reason for the match and the weekly assignment time (Sunday 22:00). From this screen the student can request an appointment or an advisor change.

![My advisor, desktop](images/3-my-advisor-desktop.png)
![My advisor, mobile](images/3-my-advisor-mobile.png)

## 4. Appointments

The student requests an appointment from the advisor's office hours and chooses online (Google Meet) or in-person. The list shows the status of each appointment (REQUESTED, CONFIRMED). Confirmed appointments have a calendar file (.ics). Cancellation is locked 30 minutes before the meeting.

![Appointments, desktop](images/4-appointments-desktop.png)
![Appointments, mobile](images/4-appointments-mobile.png)

## 5. Advisor change request

The student selects a reason, writes an explanation (at least 20 characters) and sends the request to the administrator. Only one pending request is allowed at a time. If the request is approved, the student is matched again and the previous advisor is excluded.

![Advisor change, desktop](images/5-advisor-change-desktop.png)
![Advisor change, mobile](images/5-advisor-change-mobile.png)
