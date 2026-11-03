# Daily Stand-up Records

## Meeting 1 – October 27, 2026
Attendees: Aybüke BALÇIK, Şevval Nil UÇAR, Fatima Zehra ÖKTEM, Sümeyye Ebrar COMART, Yağız Efe DERE, Emine BARAN
Format: Online (Google Meet)

### Meeting Purpose
Project kick-off, role assignment, and initial product brainstorming.

### Decisions and Topics Discussed
- **Role Assignments:** The six team roles were distributed among the members. It was agreed that the Scrum Master will formalize these into a RACI matrix.
- **Project Topic:** "Career Advisor Matching and Appointment System".
- **Problem & Solution Brainstorming:** Discussed the core issue of students struggling to find the right career advisor. Proposed an automated, rule-based matching system based on department, year, and keywords (no AI).
- **System Actors:** Identified Students, Career Advisors (faculty members), and System Administrators as the primary users.
- **Matching & Business Rules:** Discussed the initial algorithm (scoring based on shared keywords and department) and constraints (e.g., maximum one active appointment per student, no overlapping office hours).
- **Open Decisions (To be resolved next meeting):** 
  1. Platform choice (web vs. mobile).
  2. Integration of video meeting links (Zoom/Meet/Teams).
  3. Feasibility of CV uploads (PDF only, max 2MB).
  4. Default student quota for advisors.

### Action Items & Next Steps
- **Nil (Scrum Master):** Set up the GitHub organization, repository, and project board. Create the initial Git-Flow rules and prepare the `docs/raci.md` file based on today's role distribution.
- **Aybüke (Product Owner):** Draft the Project Proposal (problem definition, intended outcome) based on today's brainstormed scope.
- **Fatima & Emine:** Review the proposed matching flow to start thinking about the system boundary and OpenAPI structure.
- **All Members:** Evaluate the "Open Decisions" to finalize the Sprint 1 scope in the next meeting.

---

## Meeting 1 – October 27, 2026
Attendees: Aybüke BALÇIK, Şevval Nil UÇAR, Fatima Zehra ÖKTEM, Sümeyye Ebrar COMART, Yağız Efe DERE, Emine BARAN
Format: Online (Google Meet)

### Meeting Purpose
Project kick-off, role assignment, and initial product brainstorming.

### Decisions and Topics Discussed
- **Role Assignments:** The six team roles were distributed among the members. It was agreed that the Scrum Master will formalize these into a RACI matrix.
- **Project Topic:** "Career Advisor Matching and Appointment System".
- **Problem & Solution Brainstorming:** Discussed the core issue of students struggling to find the right career advisor. Proposed an automated, rule-based matching system based on department, year, and keywords (no AI).
- **System Actors:** Identified Students, Career Advisors (faculty members), and System Administrators as the primary users.
- **Matching & Business Rules:** Discussed the initial algorithm (scoring based on shared keywords and department) and constraints (e.g., maximum one active appointment per student, no overlapping office hours).
- **Open Decisions (To be resolved next meeting):** 
  1. Platform choice (web vs. mobile).
  2. Integration of video meeting links (Zoom/Meet/Teams).
  3. Feasibility of CV uploads (PDF only, max 2MB).
  4. Default student quota for advisors.

### Action Items & Next Steps
- **Nil (Scrum Master):** Set up the GitHub organization, repository, and project board. Create the initial Git-Flow rules and prepare the `docs/raci.md` file based on today's role distribution.
- **Aybüke (Product Owner):** Draft the Project Proposal (problem definition, intended outcome) based on today's brainstormed scope.
- **Fatima & Emine:** Review the proposed matching flow to start thinking about the system boundary and OpenAPI structure.
- **All Members:** Evaluate the "Open Decisions" to finalize the Sprint 1 scope in the next meeting.

---

## Meeting 2 – November 1, 2026
Attendees: Aybüke BALÇIK, Şevval Nil UÇAR, Fatima Zehra ÖKTEM, Sümeyye Ebrar COMART, Yağız Efe DERE, Emine BARAN
Format: Online (Google Meet)

### Decisions and Topics
- Technology: Python and Django for the backend; JavaScript, HTML, CSS and React for the web frontend.
- Feature Additions: CV upload and external video meetings added (video depends on instructor's preference).
- Cancellation Rule: Appointments cannot be cancelled within 30 minutes before start time (applies to both students and advisors).
- Matching & Capacity:
  - Advisor quota: Default set to 30 students until clarified with the instructor (to be verified with the instructor during Tuesday's class).
  - Grade levels: Advisors choose which student grade levels they serve.
  - Interest areas: Students and advisors select 1–5 interest areas. Unmatched students default to advisors with the most free capacity. Equal match scores default to the advisor with fewer assigned students.
  - Match Visibility: Students can view the reasoning behind their advisor match.
- Execution & Profile: Advisors write a short introduction text. Automatic advisor assignment runs weekly every Sunday at 22:00 (Istanbul time).
- Working Groups & Roles (Parallel Development Strategy): 
  To execute the API-first approach effectively, the team was divided into two parallel streams:
  - Group A (Product & UI): Aybüke, Nil, Ebrar.
  - Group B (Platform & API): Yağız, Emine, Fatima.

### Impediments & Technical Decisions
- Branch Protection Limitation: Rulesets are not enforced on private repositories under the GitHub Free organization plan. 
- Solution: Nil and Yağız agreed to switch the repository to `public` to properly enforce branch protection rules.

### Next Steps & Action Items
- Aybüke: Update `decision.md` (supersede old 6 decisions with D-14–D-27 via PR #35), `proposal.md` (PR #39), and `backlog.md` (PR #41).
- Fatima: Translate `vision-boundary.md` and `openapi.yaml` to English, add constraints/missing fields, and create PRs.
- Ebrar: Update acceptance criteria and test matrix to reflect the 30-min cancellation rule, weekly 3-round matching, CV, Google Meet, and email verification.
- Emine: Map backlog user stories to OpenAPI operations and open a tracking issue for the weekly matching logic.
- Yağız: Open at least one PR from individual account and assist Nil in making the repo `public` for branch rulesets.
- Nil: Merge Aybüke's PR #35, update `standups.md` (Nov 1) and `retrospective.md` (Nov 3). Open and merge `develop` -> `main` PR before delivery.
