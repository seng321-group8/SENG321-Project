# Career Advisor Matching and Appointment System

SENG 321 Software Engineering Project, Group 8.

A web system that matches students with suitable career advisors and lets them book appointments in one place.

## Team and Roles

| Member | Role | Primary responsibility |
|---|---|---|
| Aybüke BALÇIK | Product Owner and Requirements Engineer | Requirements engineering and product vision: user stories, acceptance criteria, product backlog, prioritization |
| Şevval Nil UÇAR | Scrum Master and Agile Process Coach | Agile process management and communication: RACI matrix, stand-up and retrospective records, impediment tracking, project board |
| Fatima Zehra ÖKTEM | Lead Software Architect and Technical Lead | System and software architecture: C4 and UML diagrams, API-first decisions, code review leadership |
| Ebrar COMART | QA and Test Automation Engineer | Quality assurance: test plans, unit, integration and end-to-end tests, defect tracking, coverage monitoring |
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
- [Software requirements specification](docs/srs.md)
- [Use cases](docs/use-cases.md)
- [Non-functional and security requirements](docs/nfr.md)
- [Quality measures](docs/quality-measures.md)
- UX: [user flows](docs/ux/user-flows.md), [student screens](docs/ux/student-screens.md), [advisor and admin screens](docs/ux/advisor-admin-screens.md)
- Architecture: [C4 model](docs/architecture/c4.md), [deployment view](docs/architecture/deployment.md), [sequence diagrams: registration and matching](docs/architecture/sequence-auth-matching.md), [sequence diagrams: appointment and advisor change](docs/architecture/appointment-change.md), [class diagram](docs/architecture/class-diagram.md)
- [Interest list](docs/interest-list.md) and [advisor seed data](docs/data/advisor-seed-data.md)
- [Stand-up records](docs/standups.md)
- [Retrospectives](docs/retrospective.md)

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
| Aybüke BALÇIK | Product Owner and Requirements Engineer | [@aybuke9](https://github.com/aybuke9) |
| Şevval Nil UÇAR | Scrum Master and Agile Process Coach | [@niluccr](https://github.com/niluccr) |
| Fatima Zehra ÖKTEM | Lead Software Architect and Technical Lead | [@fatimazhroktem](https://github.com/fatimazhroktem) |
| Ebrar COMART | QA and Test Automation Engineer | [@ebrarcomart](https://github.com/ebrarcomart) |
| Yağız Efe DERE | DevOps and CI/CD Infrastructure Engineer | [@yagizder](https://github.com/yagizder) |
| Emine BARAN | Implementation and Integration Engineer | [@Eminebaran](https://github.com/Eminebaran) |

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

---

## Sprint 2 Submission

Team: Group 8
Project: Career Advisor Matching and Appointment System
Repository: https://github.com/seng321-group8/SENG321-Project
Release tag: [sprint-2](https://github.com/seng321-group8/SENG321-Project/releases/tag/sprint-2)

### Team members
| Name | Role | GitHub | Sprint 2 work | Issues | Pull requests |
|---|---|---|---|---|---|
| Aybüke BALÇIK | Product Owner and Requirements Engineer | [@aybuke9](https://github.com/aybuke9) | SRS, use cases, refined backlog, interest list, decision log | [#57](https://github.com/seng321-group8/SENG321-Project/issues/57), [#58](https://github.com/seng321-group8/SENG321-Project/issues/58), [#59](https://github.com/seng321-group8/SENG321-Project/issues/59), [#72](https://github.com/seng321-group8/SENG321-Project/issues/72) | [#74](https://github.com/seng321-group8/SENG321-Project/pull/74), [#75](https://github.com/seng321-group8/SENG321-Project/pull/75), [#76](https://github.com/seng321-group8/SENG321-Project/pull/76), [#83](https://github.com/seng321-group8/SENG321-Project/pull/83), [#105](https://github.com/seng321-group8/SENG321-Project/pull/105), [#113](https://github.com/seng321-group8/SENG321-Project/pull/113), [#114](https://github.com/seng321-group8/SENG321-Project/pull/114) |
| Şevval Nil UÇAR | Scrum Master and Agile Process Coach | [@niluccr](https://github.com/niluccr) | User flows, student screens, advisor seed data, submission and release | [#62](https://github.com/seng321-group8/SENG321-Project/issues/62), [#63](https://github.com/seng321-group8/SENG321-Project/issues/63), [#71](https://github.com/seng321-group8/SENG321-Project/issues/71), [#72](https://github.com/seng321-group8/SENG321-Project/issues/72) | [#73](https://github.com/seng321-group8/SENG321-Project/pull/73), [#77](https://github.com/seng321-group8/SENG321-Project/pull/77), [#82](https://github.com/seng321-group8/SENG321-Project/pull/82), [#111](https://github.com/seng321-group8/SENG321-Project/pull/111), [#115](https://github.com/seng321-group8/SENG321-Project/pull/115)–[#122](https://github.com/seng321-group8/SENG321-Project/pull/122) |
| Fatima Zehra ÖKTEM | Lead Software Architect and Technical Lead | [@fatimazhroktem](https://github.com/fatimazhroktem) | C4 model, OpenAPI contract, SRS–API alignment | [#65](https://github.com/seng321-group8/SENG321-Project/issues/65), [#70](https://github.com/seng321-group8/SENG321-Project/issues/70) | [#78](https://github.com/seng321-group8/SENG321-Project/pull/78), [#101](https://github.com/seng321-group8/SENG321-Project/pull/101), [#104](https://github.com/seng321-group8/SENG321-Project/pull/104), [#112](https://github.com/seng321-group8/SENG321-Project/pull/112) |
| Ebrar COMART | QA and Test Automation Engineer | [@ebrarcomart](https://github.com/ebrarcomart) | Quality measures, advisor and admin screens | [#61](https://github.com/seng321-group8/SENG321-Project/issues/61), [#64](https://github.com/seng321-group8/SENG321-Project/issues/64) | [#80](https://github.com/seng321-group8/SENG321-Project/pull/80), [#81](https://github.com/seng321-group8/SENG321-Project/pull/81) |
| Yağız Efe DERE | DevOps and CI/CD Infrastructure Engineer | [@yagizder](https://github.com/yagizder) | NFR and security requirements, deployment view, sequence diagrams (registration, login, matching) | [#60](https://github.com/seng321-group8/SENG321-Project/issues/60), [#66](https://github.com/seng321-group8/SENG321-Project/issues/66), [#67](https://github.com/seng321-group8/SENG321-Project/issues/67) | [#106](https://github.com/seng321-group8/SENG321-Project/pull/106), [#107](https://github.com/seng321-group8/SENG321-Project/pull/107), [#108](https://github.com/seng321-group8/SENG321-Project/pull/108) |
| Emine BARAN | Implementation and Integration Engineer | [@Eminebaran](https://github.com/Eminebaran) | Class diagram and ER, sequence diagrams (appointment, advisor change) | [#68](https://github.com/seng321-group8/SENG321-Project/issues/68), [#69](https://github.com/seng321-group8/SENG321-Project/issues/69) | [#79](https://github.com/seng321-group8/SENG321-Project/pull/79), [#102](https://github.com/seng321-group8/SENG321-Project/pull/102), [#103](https://github.com/seng321-group8/SENG321-Project/pull/103) |

### Deliverables
| Deliverable | File | Issue | Pull requests |
|---|---|---|---|
| Software requirements specification | [`docs/srs.md`](docs/srs.md) | [#57](https://github.com/seng321-group8/SENG321-Project/issues/57) | [#74](https://github.com/seng321-group8/SENG321-Project/pull/74), [#104](https://github.com/seng321-group8/SENG321-Project/pull/104), [#114](https://github.com/seng321-group8/SENG321-Project/pull/114) |
| Use cases and coverage matrix | [`docs/use-cases.md`](docs/use-cases.md) | [#58](https://github.com/seng321-group8/SENG321-Project/issues/58) | [#75](https://github.com/seng321-group8/SENG321-Project/pull/75), [#105](https://github.com/seng321-group8/SENG321-Project/pull/105) |
| Refined product backlog | [`docs/backlog.md`](docs/backlog.md) | [#59](https://github.com/seng321-group8/SENG321-Project/issues/59) | [#76](https://github.com/seng321-group8/SENG321-Project/pull/76) |
| Non-functional and security requirements | [`docs/nfr.md`](docs/nfr.md) | [#60](https://github.com/seng321-group8/SENG321-Project/issues/60) | [#107](https://github.com/seng321-group8/SENG321-Project/pull/107) |
| Quality measures | [`docs/quality-measures.md`](docs/quality-measures.md) | [#61](https://github.com/seng321-group8/SENG321-Project/issues/61) | [#80](https://github.com/seng321-group8/SENG321-Project/pull/80) |
| User flows | [`docs/ux/user-flows.md`](docs/ux/user-flows.md) | [#62](https://github.com/seng321-group8/SENG321-Project/issues/62) | [#73](https://github.com/seng321-group8/SENG321-Project/pull/73) |
| Student screens | [`docs/ux/student-screens.md`](docs/ux/student-screens.md) | [#63](https://github.com/seng321-group8/SENG321-Project/issues/63) | [#77](https://github.com/seng321-group8/SENG321-Project/pull/77) |
| Advisor and admin screens | [`docs/ux/advisor-admin-screens.md`](docs/ux/advisor-admin-screens.md) | [#64](https://github.com/seng321-group8/SENG321-Project/issues/64) | [#81](https://github.com/seng321-group8/SENG321-Project/pull/81) |
| C4 model | [`docs/architecture/c4.md`](docs/architecture/c4.md) | [#65](https://github.com/seng321-group8/SENG321-Project/issues/65) | [#78](https://github.com/seng321-group8/SENG321-Project/pull/78), [#112](https://github.com/seng321-group8/SENG321-Project/pull/112) |
| Deployment view | [`docs/architecture/deployment.md`](docs/architecture/deployment.md) | [#66](https://github.com/seng321-group8/SENG321-Project/issues/66) | [#106](https://github.com/seng321-group8/SENG321-Project/pull/106) |
| Sequence diagrams: registration, login, matching | [`docs/architecture/sequence-auth-matching.md`](docs/architecture/sequence-auth-matching.md) | [#67](https://github.com/seng321-group8/SENG321-Project/issues/67) | [#108](https://github.com/seng321-group8/SENG321-Project/pull/108) |
| Sequence diagrams: appointment, advisor change | [`docs/architecture/appointment-change.md`](docs/architecture/appointment-change.md) | [#68](https://github.com/seng321-group8/SENG321-Project/issues/68) | [#79](https://github.com/seng321-group8/SENG321-Project/pull/79), [#103](https://github.com/seng321-group8/SENG321-Project/pull/103) |
| Class diagram and database schema | [`docs/architecture/class-diagram.md`](docs/architecture/class-diagram.md) | [#69](https://github.com/seng321-group8/SENG321-Project/issues/69) | [#79](https://github.com/seng321-group8/SENG321-Project/pull/79), [#102](https://github.com/seng321-group8/SENG321-Project/pull/102) |
| OpenAPI contract | [`openapi.yaml`](openapi.yaml) | [#70](https://github.com/seng321-group8/SENG321-Project/issues/70) | [#101](https://github.com/seng321-group8/SENG321-Project/pull/101) |
| Advisor interest list and seed data | [`docs/interest-list.md`](docs/interest-list.md), [`docs/data/advisor-seed.json`](docs/data/advisor-seed.json), [`docs/data/advisor-seed-data.md`](docs/data/advisor-seed-data.md) | [#72](https://github.com/seng321-group8/SENG321-Project/issues/72) | [#82](https://github.com/seng321-group8/SENG321-Project/pull/82), [#83](https://github.com/seng321-group8/SENG321-Project/pull/83) |
| Decision log updates (D-21, D-25, D-28) | [`docs/decision.md`](docs/decision.md) | [#72](https://github.com/seng321-group8/SENG321-Project/issues/72) | [#83](https://github.com/seng321-group8/SENG321-Project/pull/83), [#113](https://github.com/seng321-group8/SENG321-Project/pull/113) |
| Submission, stand-ups, retrospective | [`README.md`](README.md), [`CONTRIBUTIONS.md`](CONTRIBUTIONS.md), [`docs/standups.md`](docs/standups.md), [`docs/retrospective.md`](docs/retrospective.md) | [#71](https://github.com/seng321-group8/SENG321-Project/issues/71) | [#111](https://github.com/seng321-group8/SENG321-Project/pull/111), [#115](https://github.com/seng321-group8/SENG321-Project/pull/115)–[#122](https://github.com/seng321-group8/SENG321-Project/pull/122) |

### Design files
- [User flows (FigJam)](https://www.figma.com/board/yCbRs4vPk9B99bneEDwANZ/Career-Advisor-Matching---User-Flows?node-id=0-1&t=vo9uhkk9qqeXH3nt-1)
- [Student screens (Figma)](https://www.figma.com/design/4EBRTQr6qI3nCYrgwtjXFN/Career-Advisor-Matching---Screens?node-id=0-1&t=FTJWB3RPnHpztpoo-1)
- [Advisor and admin screens (Figma)](https://www.figma.com/design/YWPkjTqH5NflMmNDhqw4uu/Untitled?node-id=0-1&t=FJpGnegomFfEfPso-1)

### Evidence
- Release: [sprint-2](https://github.com/seng321-group8/SENG321-Project/releases/tag/sprint-2)
- Milestone: [Sprint 2](https://github.com/seng321-group8/SENG321-Project/milestone/1?closed=1)
- Individual contributions: [CONTRIBUTIONS.md](CONTRIBUTIONS.md)
- Project board: [GitHub Project](https://github.com/orgs/seng321-group8/projects/4) (view "Sprint 2")
- Issues: [GitHub Issues](https://github.com/seng321-group8/SENG321-Project/issues)
- Pull requests: [GitHub Pull Requests](https://github.com/seng321-group8/SENG321-Project/pulls?q=is%3Apr)
- Commits: [GitHub Commits](https://github.com/seng321-group8/SENG321-Project/commits/develop/)
