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

## Repository workflow

- `main`: assessed and released versions only, tagged per sprint.
- `develop`: integrated work for the next release (default branch).
- `feature/<issue>-<short-name>`: one branch per issue.
- No direct pushes to `main` or `develop`. Every change goes through a pull request linked to an issue and reviewed by at least one teammate.

## License

Licensed under the Apache License 2.0. See [LICENSE](LICENSE).

## Sprint 1 submission

- Release tag: `sprint-1`
- Project board: [GitHub Project](https://github.com/orgs/seng321-group8/projects/4)
- Issues: [GitHub Issues](https://github.com/seng321-group8/SENG321-Project/issues)
- Pull requests: [GitHub Pull Requests](https://github.com/seng321-group8/SENG321-Project/pulls?q=is%3Apr)
