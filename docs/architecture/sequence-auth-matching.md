# Sequence Diagrams: Registration, Login and Matching

| Item | Value |
|---|---|
| Project | Career Advisor Matching and Appointment System (SENG 321, Team 8) |
| Sprint | Sprint 2 |
| Issue | #67 |
| Owner | Yağız (DevOps and CI/CD Infrastructure Engineer) |
| Reviewers | Ebrar and Fatima |
| Consulted | Fatima for matching |
| Sources | `docs/srs.md`, `openapi.yaml` v0.5.0 (#70), D-14, D-19 and D-20 |

These diagrams use the operation names and terms of OpenAPI v0.5.0. Authentication and profile requests pass through the Django REST API; weekly matching is an internal batch and never runs as a side effect of saving a profile.

## 1. Student registration and e-mail verification

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Web as React Web App
    participant API as Django REST API
    participant DB as PostgreSQL
    participant Mail as E-mail Service

    Student->>Web: Enter full name, s + 9-digit e-mail and password
    Web->>API: registerStudent(email, password, fullName)
    API->>API: Normalize e-mail and validate ^s[0-9]{9}@ankarabilim.edu.tr$
    API->>DB: Check normalized e-mail uniqueness

    alt Invalid address, weak password or duplicate e-mail
        DB-->>API: Existing account or validation result
        API-->>Web: 400 VALIDATION_ERROR or 409 EMAIL_ALREADY_EXISTS
        Web-->>Student: Show field-level error
    else Valid new student
        API->>DB: Create inactive STUDENT account and one-time token
        DB-->>API: Account and token created
        API->>Mail: Send verification link containing token
        Mail-->>Student: Verification e-mail
        API-->>Web: 201 registration accepted
        Web-->>Student: Ask the student to verify e-mail

        Student->>Web: Open verification link
        Web->>API: verifyEmail(token)
        API->>DB: Find unused, unexpired token and inactive account

        alt Token invalid, expired or already used
            DB-->>API: No usable token
            API-->>Web: 400 verification error
            Web-->>Student: Show invalid/expired link message
        else Token valid
            API->>DB: Activate account and consume token atomically
            DB-->>API: Account active
            API-->>Web: 200 e-mail verified
            Web-->>Student: Continue to login
        end
    end
```

The registration endpoint does not reveal or assign an advisor. Only addresses matching the institutional student pattern can self-register; advisor accounts are created by an administrator.

## 2. Login

```mermaid
sequenceDiagram
    autonumber
    actor User as Student / Advisor / Administrator
    participant Web as React Web App
    participant API as Django REST API
    participant DB as PostgreSQL

    User->>Web: Enter e-mail and password
    Web->>API: login(email, password)
    API->>DB: Load user by normalized e-mail
    DB-->>API: User, password hash, role and verified flag
    API->>API: Verify password and account state

    alt Credentials invalid
        API-->>Web: 401 INVALID_CREDENTIALS
        Web-->>User: Show generic login error
    else E-mail not verified or account inactive
        API-->>Web: 403 account not active
        Web-->>User: Ask user to complete verification
    else Credentials valid and account active
        API->>API: Issue signed bearer token with configured expiry
        API-->>Web: 200 token and user role
        Web->>Web: Store token using the selected secure client strategy
        Web-->>User: Open the role-specific home page
    end
```

All protected operations validate the bearer token and role. A valid token with the wrong role produces 403; a missing, invalid or expired token produces 401.

## 3. Student profile completion

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Web as React Web App
    participant API as Django REST API
    participant DB as PostgreSQL

    Student->>Web: Open profile form
    par Load reference data
        Web->>API: listDepartments()
        API->>DB: Read departments
        DB-->>API: Department list
        API-->>Web: 200 departments
    and
        Web->>API: listInterests()
        API->>DB: Read active interests
        DB-->>API: Interest list
        API-->>Web: 200 interests
    end

    Student->>Web: Enter year, department, GPA and 1-5 interests
    Web->>API: saveMyStudentProfile(profile)
    API->>API: Authenticate STUDENT and validate all fields

    alt Invalid year, GPA, department or interest selection
        API-->>Web: 400 VALIDATION_ERROR with field details
        Web-->>Student: Show field-level errors
    else Valid profile
        API->>DB: Upsert profile and mark waiting if no advisor is assigned
        DB-->>API: Saved profile and match status
        API-->>Web: 200 profile, waiting state and nextAssignmentAt
        Web-->>Student: Show saved profile and next weekly run
        Note over API,DB: Saving a profile does not run matching
    end
```

Changes to the profile take effect in a later matching run. GPA is stored for the student and assigned advisor but is never used in the matching score.

## 4. Weekly advisor matching

```mermaid
sequenceDiagram
    autonumber
    participant Clock as Scheduler (Sunday 22:00 Europe/Istanbul)
    participant Cmd as Django Management Command
    participant Match as Matching Service
    participant DB as PostgreSQL

    Clock->>Cmd: Start scheduled matching run
    Cmd->>Match: run(trigger=scheduled, fixedSeed?)
    Match->>DB: Begin transaction and acquire run lock

    alt Another matching run is active
        DB-->>Match: Active run exists
        Match-->>Cmd: Reject overlapping run (same rule as manual 409)
        Cmd-->>Clock: Record skipped/failed trigger
    else No active run
        Match->>DB: Create RUNNING MatchingRun
        Match->>DB: Load waiting students and advisors with free quota
        DB-->>Match: Profiles, interests, years, departments and live counts
        Match->>Match: Order students by fewest candidates, then registration time

        loop Each waiting student
            Match->>Match: Round 1: served year + shared interest, highest score
            alt No Round 1 candidate
                Match->>Match: Round 2: shared interest, year requirement removed
            end
            alt Still no candidate
                Match->>Match: Round 3: same department first, then most free quota
                Match->>Match: Break remaining tie with seeded random choice
            end

            alt Advisor with free quota selected
                Match->>DB: Save permanent assignment, round, score and match reasons
                Match->>DB: Increment advisor count for the current run
            else No advisor has free quota
                Match->>DB: Keep student in WAITING state
            end
        end

        Match->>DB: Mark run COMPLETED with assigned/waiting counts
        DB-->>Match: Commit transaction and release lock
        Match-->>Cmd: Run summary
        Cmd-->>Clock: Scheduled run completed
    end
```

An administrator can invoke `runMatchingNow`; it calls the same Matching Service with `trigger=manual`. A change-request approval uses `trigger=change_request` for one student and excludes the previous advisor. All paths share the same concurrency lock, scoring rules and persisted run history.

## 5. Traceability

| Flow | SRS requirements | OpenAPI/internal operations | Decisions |
|---|---|---|---|
| Registration and verification | FR-01 to FR-04 | `registerStudent`, `verifyEmail`, `resendVerification` | D-14, D-19 |
| Login | FR-05, FR-06 | `login`, bearer authentication | D-14, D-26 |
| Profile completion | FR-09 to FR-13 | `listDepartments`, `listInterests`, `saveMyStudentProfile` | D-23, D-25, D-26 |
| Weekly matching | FR-14 to FR-22 | Internal matching engine, `runMatchingNow`, `listMatchingRuns`, `getMyAdvisor` | D-17, D-20, D-24 |

The names in this document depend on the OpenAPI v0.5.0 alignment in #70 and the matching SRS terminology update in #57.
