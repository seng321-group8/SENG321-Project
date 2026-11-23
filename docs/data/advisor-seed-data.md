# Advisor Seed Data

## Purpose
The system needs advisor data (department, interests, years served, office hours, introduction) for development, testing and demonstration. The data is in `docs/data/advisor-seed.json` and is loaded into the database when the application starts for the first time.

## How the data was prepared
- The course instructor advised the team not to collect the data from each advisor in person, because the advisors do not have time, and allowed the team to simulate missing information (D-28).
- The team shared 24 advisors between the six team members (four advisors each) and filled in the advisor form on their behalf, using the advisors' public faculty pages, CVs and publications.
- Interest keywords from the form were mapped to the shared interest list in `docs/interest-list.md` (D-25).
- Missing office hours, one advisor without any answer, and invalid fields (personal e-mail addresses, office hours that did not fit 30-minute slots) were simulated or corrected.
- Introductions were shortened to 2–3 sentences and translated into English.

## Content of `advisor-seed.json`

| Key | Content |
|---|---|
| `max_interests_per_user` | 5 (D-25) |
| `departments` | The five departments of the Faculty of Engineering |
| `interests` | 44 interests with their group: `technical` or `sector` |
| `advisors` | 24 advisors: code, department, years served, interests (1–5), introduction, online meetings offered, quota, weekly office hours |

## Rules the data follows
- Office hours start and end on a 30-minute boundary and do not overlap (FR-23).
- Each advisor has 1 to 5 interests from the list (FR-10, FR-12).
- Quota is 20, except two advisors who asked for 10 and 15 (FR-08). Total capacity is 465 students.
- Every interest on the list is offered by at least one advisor.

## Status of the data
This is seed data. It is not a confirmed response from each advisor and is used only for development and demonstration.

## Privacy
Advisor names and e-mail addresses are not stored in this repository. Advisors are identified by codes (ADV-01 to ADV-24).
