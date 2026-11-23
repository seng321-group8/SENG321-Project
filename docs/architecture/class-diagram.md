# Class Diagram and Database (ER)

> Issue #69 · Reviewers: Ebrar, Fatima
> Names follow `openapi.yaml` v0.5.0 (#70). API fields are camelCase; database columns are the same names in snake_case.

## 1. Class diagram

```mermaid
classDiagram
    class User {
        <<abstract>>
        +UUID id
        +String email
        +String passwordHash
        +String fullName
        +Role role
        +boolean emailVerified
        +DateTime createdAt
    }
    class Student {
        +String studentNo
        +int year
        +double gpa
        +MatchStatus matchStatus
        +UUID advisorId
    }
    class Advisor {
        +int[] servedYears
        +String bio
        +boolean offersOnline
        +int quota
    }
    class Admin
    class Department {
        +UUID id
        +String name
    }
    class Interest {
        +UUID id
        +String name
        +boolean active
    }
    class Cv {
        +String fileName
        +int sizeBytes
        +DateTime uploadedAt
    }
    class OfficeHour {
        +UUID id
        +int dayOfWeek
        +Time startTime
        +Time endTime
        +String location
    }
    class Appointment {
        +UUID id
        +DateTime startAt
        +DateTime endAt
        +MeetingType meetingType
        +AppointmentStatus status
        +String location
        +String meetingLink
        +String meetingLinkSource
        +String note
        +String cancelledBy
        +String cancellationReason
        +String rejectionReason
        +DateTime cancelledAt
        +isCancellable() boolean
    }
    class ChangeRequest {
        +UUID id
        +ChangeReason reason
        +String explanation
        +ChangeRequestStatus status
        +String outcome
        +String decisionNote
        +DateTime createdAt
        +DateTime decidedAt
    }
    class MatchingRun {
        +UUID id
        +Trigger trigger
        +RunStatus status
        +DateTime startedAt
        +DateTime finishedAt
        +int processedCount
        +int assignedCount
        +int waitingCount
    }
    class MatchingResult {
        +UUID id
        +int round
        +int score
        +boolean sameDepartment
        +boolean servesStudentYear
    }

    User <|-- Student
    User <|-- Advisor
    User <|-- Admin
    Student "*" --> "1" Department
    Advisor "*" --> "1" Department
    Student "*" -- "*" Interest : interests
    Advisor "*" -- "*" Interest : interests
    Student "1" --> "0..1" Cv : has
    Student "*" --> "0..1" Advisor : assigned advisor
    Advisor "1" --> "*" OfficeHour : defines
    Student "1" --> "*" Appointment : requests
    Advisor "1" --> "*" Appointment : receives
    OfficeHour "1" --> "*" Appointment : booked from
    Student "1" --> "*" ChangeRequest : opens
    ChangeRequest "*" --> "1" Advisor : current advisor
    ChangeRequest "*" --> "0..1" Advisor : new advisor
    Admin "1" --> "*" ChangeRequest : decides
    Admin "0..1" --> "*" MatchingRun : starts manually
    ChangeRequest "0..1" --> "*" MatchingRun : triggers
    MatchingRun "1" --> "*" MatchingResult : produces
    MatchingResult "*" --> "1" Student
    MatchingResult "*" --> "1" Advisor
```

Notes
- `studentNo` is derived from the e-mail address (`s` + 9 digits). It is read-only and unique.
- Office hours are weekly rules. Free 30-minute slots are computed from them and are not stored.
- `Advisor.quota` replaces `maxStudents` (D-17).
- `ChangeRequest.newAdvisorId` is set only when an approved request is re-matched.

## 2. ER diagram

```mermaid
erDiagram
    USERS {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar full_name
        varchar role "STUDENT | ADVISOR | ADMIN"
        boolean email_verified
        timestamp created_at
    }
    DEPARTMENTS {
        uuid id PK
        varchar name UK
    }
    STUDENTS {
        uuid user_id PK, FK
        varchar student_no UK
        uuid department_id FK
        smallint year
        numeric gpa
        varchar match_status "matched | waiting"
        uuid advisor_id FK "nullable"
        varchar cv_file_name "nullable"
        int cv_size_bytes "nullable"
        timestamp cv_uploaded_at "nullable"
    }
    ADVISORS {
        uuid user_id PK, FK
        uuid department_id FK
        smallint_array served_years
        text bio
        boolean offers_online
        int quota
        boolean google_calendar_connected
    }
    ADMINS {
        uuid user_id PK, FK
    }
    INTERESTS {
        uuid id PK
        varchar name UK
        boolean active
    }
    STUDENT_INTERESTS {
        uuid student_id PK, FK
        uuid interest_id PK, FK
    }
    ADVISOR_INTERESTS {
        uuid advisor_id PK, FK
        uuid interest_id PK, FK
    }
    OFFICE_HOURS {
        uuid id PK
        uuid advisor_id FK
        smallint day_of_week "1 = Monday ... 7 = Sunday"
        time start_time
        time end_time
        varchar location
    }
    APPOINTMENTS {
        uuid id PK
        uuid student_id FK
        uuid advisor_id FK
        uuid office_hour_id FK
        timestamp start_at
        timestamp end_at
        varchar meeting_type "online | in_person"
        varchar status "REQUESTED | CONFIRMED | REJECTED | CANCELLED | COMPLETED | NO_SHOW"
        varchar location "nullable"
        varchar meeting_link "nullable"
        varchar meeting_link_source "google_meet | manual, nullable"
        varchar note "nullable"
        varchar cancelled_by "student | advisor, nullable"
        varchar cancellation_reason "nullable"
        varchar rejection_reason "nullable"
        timestamp cancelled_at "nullable"
        timestamp created_at
    }
    CHANGE_REQUESTS {
        uuid id PK
        uuid student_id FK
        uuid current_advisor_id FK
        uuid new_advisor_id FK "nullable"
        varchar reason "time_conflict | field_mismatch | communication_issue | year_change | other"
        text explanation
        varchar status "PENDING | APPROVED | REJECTED"
        varchar outcome "reassigned | kept_current_advisor, nullable"
        varchar decision_note "nullable"
        uuid decided_by FK "nullable, admin"
        timestamp created_at
        timestamp decided_at "nullable"
    }
    MATCHING_RUNS {
        uuid id PK
        uuid triggered_by FK "nullable, admin"
        uuid change_request_id FK "nullable"
        varchar trigger "scheduled | manual | change_request"
        varchar status "RUNNING | COMPLETED | FAILED"
        timestamp started_at
        timestamp finished_at "nullable"
        int processed_count
        int assigned_count
        int waiting_count
    }
    MATCHING_RESULTS {
        uuid id PK
        uuid run_id FK
        uuid student_id FK
        uuid advisor_id FK "nullable when waiting"
        smallint round
        smallint score
        boolean same_department
        boolean serves_student_year
    }

    USERS ||--o| STUDENTS : "is a"
    USERS ||--o| ADVISORS : "is a"
    USERS ||--o| ADMINS : "is a"
    DEPARTMENTS ||--o{ STUDENTS : has
    DEPARTMENTS ||--o{ ADVISORS : has
    ADVISORS ||--o{ STUDENTS : "assigned advisor"
    STUDENTS ||--o{ STUDENT_INTERESTS : has
    INTERESTS ||--o{ STUDENT_INTERESTS : in
    ADVISORS ||--o{ ADVISOR_INTERESTS : has
    INTERESTS ||--o{ ADVISOR_INTERESTS : in
    ADVISORS ||--o{ OFFICE_HOURS : defines
    OFFICE_HOURS ||--o{ APPOINTMENTS : "booked from"
    STUDENTS ||--o{ APPOINTMENTS : requests
    ADVISORS ||--o{ APPOINTMENTS : receives
    STUDENTS ||--o{ CHANGE_REQUESTS : opens
    ADVISORS ||--o{ CHANGE_REQUESTS : "current advisor"
    ADMINS ||--o{ CHANGE_REQUESTS : decides
    ADMINS ||--o{ MATCHING_RUNS : starts
    CHANGE_REQUESTS ||--o{ MATCHING_RUNS : triggers
    MATCHING_RUNS ||--o{ MATCHING_RESULTS : produces
    STUDENTS ||--o{ MATCHING_RESULTS : for
    ADVISORS ||--o{ MATCHING_RESULTS : suggested
```

## 3. Constraints and notes

- `appointments`: for the same `advisor_id` and `start_at`, at most one `REQUESTED` or `CONFIRMED` row (unique partial index). This gives exactly one winner when two students request the same slot (FR-26).
- `appointments`: `start_at` must be on a 30-minute boundary inside an office-hour rule of that advisor; `end_at = start_at + 30 minutes`.
- A student has at most one active (`REQUESTED` or `CONFIRMED`) appointment.
- Cancellation is not allowed within 30 minutes of `start_at` (409 `CANCELLATION_WINDOW_CLOSED`).
- The number of students with the same `advisor_id` cannot exceed `advisors.quota`; the quota cannot be set below that number.
- `change_requests`: a student has at most one `PENDING` request.
- `matching_results`: `(run_id, student_id)` is unique.
- `office_hours`: rules of the same advisor on the same day cannot overlap; the duration is a multiple of 30 minutes.
- Role is stored in `users.role`; `students`, `advisors` and `admins` share the primary key with `users.id`.
- Privacy: `students.gpa`, the CV and `change_requests.explanation` follow the visibility rules of FR-40.
