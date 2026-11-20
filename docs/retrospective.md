# Sprint 1 Retrospective

Date: November 3, 2026
Facilitator: Şevval Nil UÇAR (Scrum Master)
Attendees: Aybüke BALÇIK, Şevval Nil UÇAR, Fatima Zehra ÖKTEM, Sümeyye Ebrar COMART, Yağız Efe DERE, Emine BARAN

## What went well
- The repository, the `develop` branch, the issues, and the project board were set up in the first days, and the first change (RACI, PR #10) went through the full pull request flow.
- The team met on October 27 and November 1 and recorded decisions in the decision log.
- The Product Owner prepared a clear task list that assigned work to each member.
- Review comments led to real corrections, for example in the QA documents.
- Core system decisions (30-minute appointment cancellation window, Sunday 22:00 weekly batch run, 20-student initial advisor quota, and PDF CV upload) were successfully finalized and recorded in the decision log.

## What could be improved
- Two project boards existed at the same time, which caused confusion about where to track work.
- Some files were added to the wrong folder initially.
- Branch protection did not work while the repository was private; it only became effective after the repository was made public.
- A change was committed directly to `develop` on October 31 before protection was enforced.
- Business rule updates late in the sprint required multiple revisions across specifications and decision records.
- Documents that were first written in Turkish had to be translated into English.
- Pull requests were opened late, so reviews and merges were concentrated on the delivery day.
- Individual contributions to the repository were uneven at the start.

## Action items for Sprint 2
- Keep one project board only. Owner: Nil
- Check that the ruleset is active before the sprint starts. Owner: Nil and Yağız
- Confirm decisions with the Product Owner before writing documents; record changes in the decision log. Owner: Aybüke
- Write all documents in English from the start. Owner: all
- Open pull requests early and review at least one pull request per week. Owner: all
- Every member opens at least one pull request in the first week. Owner: all
- Fix weekly meeting slots. Owner: Nil

---

# Sprint 2 Retrospective

Date: November 23, 2026
Facilitator: Şevval Nil UÇAR (Scrum Master)
Attendees: Aybüke BALÇIK, Şevval Nil UÇAR, Fatima Zehra ÖKTEM, Sümeyye Ebrar COMART, Yağız Efe DERE, Emine BARAN

## Follow-up of the Sprint 1 action items
| Action | Result |
|---|---|
| Keep one project board only | Done. One board with a Sprint field and a view for each sprint. |
| Check that the ruleset is active | Done. The repository is public and the ruleset is active. |
| Confirm decisions before writing documents | Partly. Core rules (such as FR-26 and D-27) were confirmed early, but the advisor interest collection method (D-25) had to be changed late in the sprint. |
| Write all documents in English from the start | Done. All Sprint 2 documents, diagrams, and UI screens were written in English from the start. |
| Open pull requests early | Partly. On November 18 no branch or pull request existed yet. |
| Every member opens a pull request in the first week | Done. Every team member opened pull requests for their assigned tasks during the sprint, though work started later in the week. |
| Fix weekly meeting slots | Not done. Carried over to Sprint 3; coordination was mostly handled asynchronously via chat. |

## What went well
- All Sprint 2 issues were opened with an owner and a reviewer before the work started, and the board shows them in a Sprint 2 view.
- The user flows and the student screens were designed for desktop and phone, and the review led to useful corrections: one active appointment per student, a register screen and a "waiting for a match" screen.
- The quality measures and the advisor and admin screens were corrected after review comments.
- When the advisors had no time for the form, the team prepared seed data for 24 advisors after the instructor's advice and documented the method.

## What could be improved
- Work started late. On November 18 there were no branches or pull requests.
- Some Figma frames exported incomplete images because parts were outside the frame, so screenshots had to be used.
- The plan to collect interests from the advisors with a form failed and was replaced late in the sprint.
- Some pull requests needed changes after review because they did not follow the checklist of their issue.
- Dates and names were not consistent across documents (for example the weekly assignment date, file names and NFR numbers), so a consistency check was needed at the end.
- The plan to collect interests from the advisors with a form did not work, because the advisors did not have time. After the instructor's advice, the team prepared the data from public sources.

## Action items for Sprint 3
- Open a draft pull request within two days after starting a task. Owner: all
- Use the checklist of the issue as the checklist of the pull request before asking for review. Owner: all
- Set up the GitHub Actions pipeline early and check the 50 percent coverage target every week. Owner: Yağız
- Run a short consistency check (names, IDs, dates) each week, not only at the end. Owner: Ebrar
- Create the Sprint 3 MVP stories as issues on the board before the sprint starts. Owner: Aybüke
- Fix weekly meeting slots and keep the stand-up records every week. Owner: Nil
