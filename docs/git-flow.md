# Git-Flow Policy

This policy describes how the team uses Git and GitHub in Sprint 1.

## Branches

| Branch | Purpose |
|---|---|
| `main` | Assessed and released versions only. Each sprint submission gets a tag (`sprint-1`, `sprint-2`, ...). |
| `develop` | Integrated work for the next release. Default branch. |
| `feature/<issue>-<short-name>` | Short-lived branch for one story, defect or task. Example: `feature/16-openapi`. |
| `release/<version>` | Optional. Used only if a real stabilization need appears. |
| `hotfix/<issue>-<short-name>` | Optional. Urgent fix based on a released `main` version. |

## Rules

1. No direct pushes to `main` or `develop`.
2. Every change is linked to an issue.
3. Every pull request describes the change and gives test or review evidence.
4. At least one teammate reviews each pull request.
5. Required checks must pass before merge (once a CI workflow exists).
6. Every member works with their own GitHub account.

## Workflow

1. Pick or create an issue and assign yourself.
2. Create `feature/<issue>-<short-name>` from `develop`.
3. Commit with short, clear messages.
4. Open a pull request into `develop`. Write `Related to #N`, or `Closes #N` if the work is complete.
5. Add a reviewer and move the issue to In Review on the project board.
6. After approval, merge and delete the feature branch.
7. At sprint end, `develop` is merged into `main` through a pull request and tagged `sprint-N`.

## Pull request checklist

- [ ] Linked issue
- [ ] Short summary of the change
- [ ] Test or review evidence
- [ ] Reviewer assigned

## Enforcement

Branch protection is configured with GitHub rulesets for `main` and `develop`. Because the repository is private on a free organization plan, GitHub does not enforce rulesets automatically. The team therefore applies these rules by discipline and checks the commit history regularly for direct pushes.
