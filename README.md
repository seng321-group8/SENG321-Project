# Career Advisor Matching and Appointment System

SENG 321 Software Engineering Project, Group 8.

A web system that matches students with suitable career advisors and lets them book appointments in one place.

## Team and Roles

| Member | Role | Primary responsibility |
|---|---|---|
| Aybüke BALÇIK | Product Owner and Requirements Engineer | Requirements engineering and product vision: user stories, acceptance criteria, product backlog, prioritization |
| Şevval Nil UÇAR | Scrum Master and Agile Process Coach | Agile process management and communication: RACI matrix, stand-up and retrospective records, impediment tracking, project board |
| Fatima Zehra ÖKTEM | Lead Software Architect and Technical Lead | System and software architecture: C4 and UML diagrams, API-first decisions, code review leadership |
| Sümeyye Ebrar COMART | QA and Test Automation Engineer | Quality assurance: test plans, unit, integration and end-to-end tests, defect tracking, coverage monitoring |
| Yağız Efe DERE | DevOps and CI/CD Infrastructure Engineer | Infrastructure and deployment: GitHub Actions pipeline, Docker configuration, docker-compose |
| Emine BARAN | Implementation and Integration Engineer | Feature implementation, cross-component integration, API and UI coordination, integration defect resolution |

Detailed responsibilities per activity: [RACI matrix](docs/raci.md).

## Documentation

- [Team roles and RACI](docs/raci.md)
- [Decision log](docs/decision.md)
- [Project proposal](docs/proposal.md)
- [System vision and boundary](docs/vision-boundary.md)
- [Git-Flow policy](docs/git-flow.md)
- [Product backlog](docs/backlog.md)
- [OpenAPI contract](openapi.yaml)
- [Stand-up records](docs/standups.md)
- [Sprint 1 retrospective](docs/retrospective.md)

## Repository workflow

- `main`: assessed and released versions only, tagged per sprint.
- `develop`: integrated work for the next release (default branch).
- `feature/<issue>-<short-name>`: one branch per issue.
- No direct pushes to `main` or `develop`. Every change goes through a pull request linked to an issue and reviewed by at least one teammate.

## Local development

The project skeleton uses Django REST Framework, PostgreSQL, React and Docker Compose.

1. Copy the example configuration:

   ```bash
   cp .env.example .env
   ```

2. Replace the local-only secret and passwords in `.env`.

3. Build and start the complete stack:

   ```bash
   docker-compose up --build
   ```

4. Open the web client at <http://localhost:5173>. The API health endpoint is available at <http://localhost:8000/api/health/> and versioned API routes start at `/api/v1/`.

PostgreSQL and uploaded CV files use named volumes. Stop the containers with `docker-compose down`; add `-v` only when intentionally deleting local database and CV data.

For host-side backend development, install `backend/requirements-dev.txt`, run commands from `backend/`, and leave `POSTGRES_HOST` unset to use the local SQLite fallback. Frontend commands run from `frontend/` with `npm install`, `npm run lint` and `npm run build`.

## License

Licensed under the Apache License 2.0. See [LICENSE](LICENSE).

## Sprint 1 Submission

Team: Group 8
Project: Career Advisor Matching and Appointment System
Repository: https://github.com/seng321-group8/SENG321-Project
Release tag: [sprint-1](https://github.com/seng321-group8/SENG321-Project/releases/tag/sprint-1)

### Team members
| Name | Role | GitHub |
|---|---|---|
| Aybüke BALÇIK | Product Owner and Requirements Engineer | @aybuke9 |
| Şevval Nil UÇAR | Scrum Master and Agile Process Coach | @niluccr |
| Fatima Zehra ÖKTEM | Lead Software Architect and Technical Lead | @fatimazhroktem |
| Sümeyye Ebrar COMART | QA and Test Automation Engineer | @ebrarcomart |
| Yağız Efe DERE | DevOps and CI/CD Infrastructure Engineer | @yagizder |
| Emine BARAN | Implementation and Integration Engineer | @Eminebaran |

### Deliverables
| Deliverable | File | Issue | Pull requests |
|---|---|---|---|
| Project proposal | docs/proposal.md | #14 | #39 |
| System vision and boundary | docs/vision-boundary.md | #15 | #31, #48, #51 |
| OpenAPI draft | openapi.yaml | #16 | #32, #33, #43, #49 |
| Roles and RACI matrix | docs/raci.md | #9 | #10, #11, #21 |
| Git-Flow workflow and README | docs/git-flow.md | #18 | #12, #20, #22, #23, #24, #26, #27, #30, #44 |
| Product backlog | docs/backlog.md | #17 | #32, #41 |
| Decision log | docs/decision.md | #13 | #19, #25, #35 |
| Acceptance criteria and test matrix | docs/acceptance-criteria-draft.md, docs/test-scenario-matrix.md | #17 | #34, #38, #40, #42, #46 |
| Stand-up records and retrospective | docs/standups.md, docs/retrospective.md | #13 | #28, #29, #45, #47, #52 |

### Evidence
- Release tag: `sprint-1`
- Project board: [GitHub Project](https://github.com/orgs/seng321-group8/projects/4)
- Issues: [GitHub Issues](https://github.com/seng321-group8/SENG321-Project/issues)
- Pull requests: [GitHub Pull Requests](https://github.com/seng321-group8/SENG321-Project/pulls?q=is%3Apr)
- Commits: [GitHub Commits](https://github.com/seng321-group8/SENG321-Project/commits/develop/)
