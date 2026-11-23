# Sequence: Appointment and Advisor Change

> Issue #68 · Reviewers: Nil, Fatima
> Paths, bodies and status codes follow `openapi.yaml` v0.5.0 (#70).

## 1. Appointment: request, confirm, e-mail with .ics

```mermaid
sequenceDiagram
    actor S as Student
    participant API as Backend API
    participant DB as Database
    participant Mail as E-mail service
    actor A as Advisor

    S->>API: GET /advisors/{advisorId}/available-slots
    API-->>S: 200 free slots (officeHourId, startAt, endAt)

    S->>API: POST /appointments (officeHourId, startAt, meetingType, note)
    API->>DB: Check own advisor, 30-minute grid, window, slot free, no other active appointment
    alt startAt not a bookable time
        API-->>S: 400 INVALID_START_TIME
    else online not offered
        API-->>S: 400 ONLINE_NOT_OFFERED
    else slot taken or active appointment exists
        API-->>S: 409 SLOT_ALREADY_BOOKED / ACTIVE_APPOINTMENT_EXISTS
    else free
        API->>DB: INSERT appointment (status=REQUESTED)
        API->>Mail: New request e-mail to the advisor
        API-->>S: 201 Created (REQUESTED)
    end

    A->>API: POST /appointments/{id}/confirm (meetingLink if needed)
    API->>DB: status=CONFIRMED (Google Meet link or manual link)
    API->>API: Create .ics file
    API->>Mail: Confirmation e-mail with .ics to the student
    API-->>A: 200 OK

    opt The advisor rejects
        A->>API: POST /appointments/{id}/reject (reason)
        API->>DB: status=REJECTED, slot is free again
        API->>Mail: Rejection e-mail to the student
        API-->>A: 200 OK
    end
```

## 2. Cancellation and the 30-minute lock

An appointment cannot be cancelled by either side within 30 minutes of its start.

```mermaid
sequenceDiagram
    actor U as Student / Advisor
    participant API as Backend API
    participant DB as Database
    participant Mail as E-mail service

    U->>API: POST /appointments/{id}/cancel (reason)
    API->>DB: Get the appointment
    alt reason is missing
        API-->>U: 400 Validation error
    else status is not REQUESTED or CONFIRMED
        API-->>U: 409 Conflict
    else startAt - now <= 30 min
        API-->>U: 409 CANCELLATION_WINDOW_CLOSED
    else can be cancelled
        API->>DB: status=CANCELLED, cancelled_by, cancellation_reason, cancelled_at=now
        API->>Mail: Cancellation e-mail to the other side
        API-->>U: 200 OK
    end
```

## 3. Advisor change request and re-matching

```mermaid
sequenceDiagram
    actor S as Student
    participant API as Backend API
    participant DB as Database
    participant M as Matching service
    actor AD as Administrator
    participant Mail as E-mail service

    S->>API: POST /advisor-change-requests (reason, explanation)
    API->>DB: Is there a PENDING request?
    alt a PENDING request exists
        API-->>S: 409 Conflict
    else none
        API->>DB: INSERT change_request (PENDING)
        API->>Mail: Notification to the administrator
        API-->>S: 201 Created
    end

    AD->>API: POST /admin/advisor-change-requests/{id}/decision (APPROVED, decisionNote)
    API->>DB: status=APPROVED
    API->>M: Re-match this student without the current advisor (trigger=change_request)
    M->>DB: INSERT matching_run (RUNNING, change_request_id)
    M->>DB: Score with the matching rules and free quota
    M->>DB: INSERT matching_results, run=COMPLETED
    alt another advisor found
        M-->>API: New advisor
        API->>DB: students.advisor_id = new advisor, new_advisor_id set, outcome=reassigned
        API->>DB: Future REQUESTED/CONFIRMED appointments with the old advisor become CANCELLED
        API->>Mail: Notification to the student, the old and the new advisor
    else no other advisor has free quota
        API->>DB: outcome=kept_current_advisor, student keeps the advisor, no appointment is cancelled
        API->>Mail: Notification to the student
    end
    API-->>AD: 200 OK

    opt The administrator rejects
        AD->>API: POST /admin/advisor-change-requests/{id}/decision (REJECTED, decisionNote)
        API->>DB: status=REJECTED
        API->>Mail: Notification to the student
        API-->>AD: 200 OK
    end
```

## 4. Appointment state diagram

```mermaid
stateDiagram-v2
    [*] --> REQUESTED : student requests
    REQUESTED --> CONFIRMED : advisor confirms
    REQUESTED --> REJECTED : advisor rejects
    REQUESTED --> CANCELLED : cancel (not within 30 min of start)
    CONFIRMED --> CANCELLED : cancel (not within 30 min of start)
    CONFIRMED --> COMPLETED : advisor marks as held
    CONFIRMED --> NO_SHOW : advisor marks as no-show
    REJECTED --> [*]
    CANCELLED --> [*]
    COMPLETED --> [*]
    NO_SHOW --> [*]
```
