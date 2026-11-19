# Advisor and Administrator Screens

Figma design file: LINK

Each screen is designed for two sizes:

| Device | Frame size |
| :--- | :--- |
| Desktop | 1440 x 1024 px |
| Phone (iPhone 14 & 15 Pro) | 393 x 852 px |

The screens follow the advisor and administrator flows in [user-flows.md](user-flows.md) and align with system rules and API endpoints.

## Advisor Screens

### 1. Advisor Login and Profile / Office Hours
Advisors sign in with their institutional account, manage their profile and availability/office hours, and specify meeting type preferences (in-person or online, with Google Calendar / Google Meet support when connected).

### 2. Assigned Advisees and Student CVs
Advisors view the students matched and assigned to them through the weekly matching process, inspect student profiles, and review uploaded student CVs (PDF, up to 2 MB).

### 3. Appointment Requests and Schedule Management
Advisors review incoming office-hour appointment requests, approve or reject them, prevent double bookings, manage upcoming sessions, and record outcomes (`CONFIRMED`, `COMPLETED`, `NO_SHOW`, or cancellation handling respecting the 30-minute lock rule).

## Administrator Screens

### 4. Advisor Quota and Matching Overview
Administrators configure and monitor advisor quotas (default quota of 20 advisees unless updated), oversee weekly matching runs (scheduled Sunday 22:00), and verify assignment results.

### 5. Advisor Change Requests
Administrators review student requests to change their assigned advisor, inspect relevant context, and approve or reject requests.

### 6. System and Account Administration
Administrators oversee user accounts, role/status records, and operational settings across the platform.
