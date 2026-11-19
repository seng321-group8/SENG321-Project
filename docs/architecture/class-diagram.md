# Class Diagram ve Veritabanı (ER)

> Issue #69 · İnceleyenler: Ebrar, Fatima
> Not: İsimler OpenAPI şemalarıyla aynı olmalı. Şüpheli alanlar `TODO(openapi)` ile işaretlendi, OpenAPI'ye bakıp eşitlenecek.

## 1. Class Diagram

```mermaid
classDiagram
    class User {
        <<abstract>>
        +UUID id
        +String email
        +String passwordHash
        +String fullName
        +Role role
        +DateTime createdAt
    }
    class Student {
        +String studentNo
        +String department
        +int year
        +UUID advisorId
    }
    class Advisor {
        +String title
        +String department
        +String office
        +int maxStudents
    }
    class Admin
    class Interest {
        +UUID id
        +String name
    }
    class OfficeHour {
        +UUID id
        +DayOfWeek dayOfWeek
        +Time startTime
        +Time endTime
        +int slotMinutes
        +boolean isActive
    }
    class Appointment {
        +UUID id
        +DateTime startAt
        +DateTime endAt
        +AppointmentStatus status
        +String topic
        +String rejectionReason
        +DateTime cancelledAt
        +isCancellable() boolean
    }
    class ChangeRequest {
        +UUID id
        +String reason
        +ChangeRequestStatus status
        +DateTime reviewedAt
        +DateTime createdAt
    }
    class MatchingRun {
        +UUID id
        +TriggerType triggerType
        +RunStatus status
        +DateTime startedAt
        +DateTime finishedAt
    }
    class MatchingResult {
        +UUID id
        +double score
    }

    User <|-- Student
    User <|-- Advisor
    User <|-- Admin
    Student "*" -- "*" Interest : ilgi alanı
    Advisor "*" -- "*" Interest : uzmanlık
    Advisor "1" --> "*" OfficeHour : tanımlar
    Student "1" --> "*" Appointment : talep eder
    Advisor "1" --> "*" Appointment : alır
    OfficeHour "1" --> "*" Appointment : slot
    Student "1" --> "*" ChangeRequest : açar
    ChangeRequest "*" --> "1" Advisor : mevcut danışman
    ChangeRequest "*" --> "0..1" Advisor : istenen danışman
    Admin "1" --> "*" ChangeRequest : değerlendirir
    Admin "1" --> "*" MatchingRun : tetikler
    MatchingRun "1" --> "*" MatchingResult : üretir
    MatchingResult "*" --> "1" Student
    MatchingResult "*" --> "1" Advisor
```

## 2. ER Diyagramı

```mermaid
erDiagram
    USERS {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar full_name
        varchar role "STUDENT | ADVISOR | ADMIN"
        timestamp created_at
    }
    STUDENTS {
        uuid user_id PK, FK
        varchar student_no UK
        varchar department
        int year
        uuid advisor_id FK "nullable"
    }
    ADVISORS {
        uuid user_id PK, FK
        varchar title
        varchar department
        varchar office
        int max_students
    }
    ADMINS {
        uuid user_id PK, FK
    }
    INTERESTS {
        uuid id PK
        varchar name UK
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
        smallint day_of_week
        time start_time
        time end_time
        int slot_minutes
        boolean is_active
    }
    APPOINTMENTS {
        uuid id PK
        uuid student_id FK
        uuid advisor_id FK
        uuid office_hour_id FK
        timestamp start_at
        timestamp end_at
        varchar status "REQUESTED | CONFIRMED | REJECTED | COMPLETED | NO_SHOW | CANCELLED"
        varchar topic
        varchar rejection_reason
        timestamp cancelled_at
        timestamp created_at
    }
    CHANGE_REQUESTS {
        uuid id PK
        uuid student_id FK
        uuid current_advisor_id FK
        uuid requested_advisor_id FK "nullable"
        varchar reason
        varchar status "PENDING | APPROVED | REJECTED"
        uuid reviewed_by FK "nullable, admin"
        timestamp reviewed_at
        timestamp created_at
    }
    MATCHING_RUNS {
        uuid id PK
        uuid triggered_by FK "nullable, admin"
        varchar trigger_type "MANUAL | CHANGE_REQUEST | SCHEDULED"
        varchar status "RUNNING | COMPLETED | FAILED"
        timestamp started_at
        timestamp finished_at
    }
    MATCHING_RESULTS {
        uuid id PK
        uuid run_id FK
        uuid student_id FK
        uuid advisor_id FK
        numeric score
    }

    USERS ||--o| STUDENTS : "is a"
    USERS ||--o| ADVISORS : "is a"
    USERS ||--o| ADMINS : "is a"
    ADVISORS ||--o{ STUDENTS : "danışmanlık"
    STUDENTS ||--o{ STUDENT_INTERESTS : has
    INTERESTS ||--o{ STUDENT_INTERESTS : in
    ADVISORS ||--o{ ADVISOR_INTERESTS : has
    INTERESTS ||--o{ ADVISOR_INTERESTS : in
    ADVISORS ||--o{ OFFICE_HOURS : defines
    OFFICE_HOURS ||--o{ APPOINTMENTS : "slot"
    STUDENTS ||--o{ APPOINTMENTS : requests
    ADVISORS ||--o{ APPOINTMENTS : receives
    STUDENTS ||--o{ CHANGE_REQUESTS : opens
    ADVISORS ||--o{ CHANGE_REQUESTS : "current"
    ADMINS ||--o{ CHANGE_REQUESTS : reviews
    ADMINS ||--o{ MATCHING_RUNS : triggers
    MATCHING_RUNS ||--o{ MATCHING_RESULTS : produces
    STUDENTS ||--o{ MATCHING_RESULTS : for
    ADVISORS ||--o{ MATCHING_RESULTS : suggested
```

## 3. Kısıtlar ve notlar

- `appointments`: aynı `advisor_id` için çakışan `[start_at, end_at)` aralığında `REQUESTED`/`CONFIRMED` kayıt olamaz (exclusion constraint veya servis katmanı kontrolü).
- `students.advisor_id` sayısı `advisors.max_students` değerini geçemez.
- `change_requests`: bir öğrencinin aynı anda tek `PENDING` talebi olabilir.
- `matching_results`: `(run_id, student_id)` benzersiz.
- Rol ayrımı `users.role` ile yapılır; alt tablolar (`students`, `advisors`, `admins`) `user_id` ile PK paylaşır.
- TODO(openapi): alan adları (`studentNo`, `slotMinutes`, `topic` vb.) camelCase/snake_case olarak OpenAPI ile birebir eşitlenecek.
