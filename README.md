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
- [Advisor seed data](docs/data/advisor-seed-data.md)
- [Stand-up records](docs/standups.md)
- [Retrospectives](docs/retrospective.md)

## Repository workflow

- `main`: assessed and released versions only, tagged per sprint.
- `develop`: integrated work for the next release (default branch).
- `feature/<issue>-<short-name>`: one branch per issue.
- No direct pushes to `main` or `develop`. Every change goes through a pull request linked to an issue and reviewed by at least one teammate.

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
| Sümeyye Ebrar COMART | QA and Test Automation Engineer | [@ebrarcomart](https://github.com/ebrarcomart) |
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
| Name | Role | GitHub | Sprint 2 work |
|---|---|---|---|
| Aybüke BALÇIK | Product Owner and Requirements Engineer | @aybuke9 | SRS, use cases, backlog, interest list (#57, #58, #59, #72, #74, #75, #76, #83) |
| Şevval Nil UÇAR | Scrum Master and Agile Process Coach | @niluccr | User flows, student screens, submission (#62, #63, #71, #72, #73, #77, #82) |
| Fatima Zehra ÖKTEM | Lead Software Architect and Technical Lead | @fatimazhroktem | C4 model, OpenAPI (#65, #70, #78) |
| Sümeyye Ebrar COMART | QA and Test Automation Engineer | @ebrarcomart | Quality measures, advisor and admin screens (#61, #64, #75, #80, #81) |
| Yağız Efe DERE | DevOps and CI/CD Infrastructure Engineer | @yagizder | NFR and security, deployment view, sequence diagrams (#60, #66, #67) |
| Emine BARAN | Implementation and Integration Engineer | @Eminebaran | Sequence diagrams, class diagram (#68, #69) |

### Deliverables
| Deliverable | File | Issue | Pull requests |
|---|---|---|---|
| Software requirements specification | docs/srs.md | #57 | #74 |
| Use cases and coverage matrix | docs/use-cases.md | #58 | #75 |
| Refined product backlog | docs/backlog.md | #59 | #76 |
| Non-functional and security requirements | docs/nfr.md | #60 | #107 |
| Quality measures | docs/quality-measures.md | #61 | #80 |
| User flows | docs/ux/user-flows.md | #62 | #73 |
| Student screens | docs/ux/student-screens.md | #63 | #77 |
| Advisor and admin screens | docs/ux/advisor-admin-screens.md | #64 | #81 |
| C4 model | docs/architecture/c4.md | #65 | #78 |
| Deployment view | docs/architecture/deployment.md | #66 | #106 |
| Sequence diagrams: registration, login, matching | docs/architecture/sequence-auth-matching.md | #67 | #108 |
| Sequence diagrams: appointment, advisor change | docs/architecture/appointment-change.md | #68 | #79, #103 |
| Class diagram and database schema | docs/architecture/class-diagram.md | #69 | #79, #102 |
| OpenAPI contract | openapi.yaml | #70 | #101 |
| Advisor interest list and seed data | docs/decision.md, docs/data/advisor-seed-data.md, docs/interest-list.md, docs/data/advisor-seed.json | #72 | #82, #83 |
| Submission, stand-ups, retrospective | README.md, CONTRIBUTIONS.md, docs/standups.md, docs/retrospective.md | #71 | #111 |

### Design files
### Design files
- [User flows (FigJam)](https://www.figma.com/board/yCbRs4vPk9B99bneEDwANZ/Career-Advisor-Matching---User-Flows?node-id=0-1&t=vo9uhkk9qqeXH3nt-1)
- [Student screens (Figma)](https://www.figma.com/design/4EBRTQr6qI3nCYrgwtjXFN/Career-Advisor-Matching---Screens?node-id=0-1&t=FTJWB3RPnHpztpoo-1)
- [Advisor and admin screens (Figma)](https://www.figma.com/design/YWPkjTqH5NflMmNDhqw4uu/Untitled?node-id=0-1&t=FJpGnegomFfEfPso-1)

### Evidence
- Release tag: `sprint-2`
- Project board: [GitHub Project](https://github.com/orgs/seng321-group8/projects/4) (view "Sprint 2")
- Issues: [GitHub Issues](https://github.com/seng321-group8/SENG321-Project/issues)
- Pull requests: [GitHub Pull Requests](https://github.com/seng321-group8/SENG321-Project/pulls?q=is%3Apr)
- Commits: [GitHub Commits](https://github.com/seng321-group8/SENG321-Project/commits/develop/)
