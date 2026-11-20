# Interest List (D-25)

| Field | Value |
|---|---|
| Related issue | #72 |
| Owner | Aybüke BALÇIK — Product Owner |
| Reviewer | Fatima Zehra ÖKTEM — Lead Software Architect |
| Status | Final for the first release |
| Data file | `docs/data/advisor-seed.json` |

## 1. Purpose

Students and advisors choose interests from one predefined list (D-25), and matching counts the shared interests (FR-15). This document sets the initial list, loaded into the system from `docs/data/advisor-seed.json`, and the maximum number of interests per user (FR-10).

## 2. How the list was built

1. The advisor form was filled in for all 24 advisors (D-28). Question 4 asked for the topics each advisor can advise on.
2. The answers were free text in Turkish. Keywords with the same meaning were merged into one English name that a student would search for (for example *Derin Öğrenme* and *Federated Learning* → **Machine Learning**; *Bilgi Güvenliği*, *Ağ Güvenliği* and *Kriptografik Güvenlik* → **Cybersecurity**).
3. General academic and career topics were removed: academic career, MSc and PhD applications, study abroad, TÜBİTAK and research projects, scholarships, internships, CV and interview preparation, graduation projects and academic writing. Almost every advisor offered them, so they do not help to tell advisors apart, and they would use up interest slots that matter for matching. Every advisor can still help with these topics in an appointment.
4. Each advisor keeps at most 5 interests: the technical areas they listed first, then their industry sector.
5. Only interests chosen by at least one advisor are on the list, so every interest a student can choose has at least one advisor.
6. Missing or invalid form fields (office hours, a few e-mail addresses, one advisor who did not answer) were simulated, as allowed by the course instructor. The data is seed data, not a confirmed answer of each advisor (D-28).

## 3. Initial list (44 interests)

### Technical and research areas

| # | Interest | Advisors |
|---:|---|---:|
| 1 | Machine Learning | 7 |
| 2 | Cybersecurity | 6 |
| 3 | Artificial Intelligence | 4 |
| 4 | Data Science and Analytics | 4 |
| 5 | Operations Research and Optimization | 4 |
| 6 | Software Development and Programming | 4 |
| 7 | Educational Technology and E-Learning | 3 |
| 8 | Modeling and Simulation | 3 |
| 9 | Production Systems and Lean Manufacturing | 3 |
| 10 | Signal and Audio Processing | 3 |
| 11 | Supply Chain and Logistics | 3 |
| 12 | Biomedical Engineering | 2 |
| 13 | Computer Networks | 2 |
| 14 | Decision Making and Fuzzy Logic | 2 |
| 15 | Image Processing and Computer Vision | 2 |
| 16 | Mathematics | 2 |
| 17 | Nanotechnology and MEMS | 2 |
| 18 | Optics and Photonics | 2 |
| 19 | Quality Management and Six Sigma | 2 |
| 20 | Sensor Systems | 2 |
| 21 | Software Engineering | 2 |
| 22 | Statistics and Probability | 2 |
| 23 | Telecommunications | 2 |
| 24 | Web Development | 2 |
| 25 | Algorithms and Theory of Computation | 1 |
| 26 | Business Analysis and Requirements Engineering | 1 |
| 27 | Cognitive Science | 1 |
| 28 | Electronics and Circuits | 1 |
| 29 | Embedded Systems and IoT | 1 |
| 30 | Ergonomics and Human Factors | 1 |
| 31 | Human-Computer Interaction | 1 |
| 32 | Mobile App Development | 1 |
| 33 | Physics | 1 |
| 34 | Project Management | 1 |
| 35 | Renewable Energy and Solar Cells | 1 |
| 36 | Robotics and Control | 1 |

### Industry sectors

| # | Interest | Advisors |
|---:|---|---:|
| 37 | Defense Industry | 4 |
| 38 | Healthcare and Medical Technologies | 2 |
| 39 | Startups and Entrepreneurship | 2 |
| 40 | Automotive Industry | 1 |
| 41 | Banking and Finance (FinTech) | 1 |
| 42 | Manufacturing Industry | 1 |
| 43 | Software Industry | 1 |
| 44 | Telecommunications Industry | 1 |

## 4. Maximum number of interests per user

| Item | Value |
|---|---|
| Maximum per user (students and advisors) | **5** |
| Minimum | 1 |
| Advisors' interests in the seed data | 1 to 5, 4.0 on average |

**Why 5:** After the general career topics are removed, 5 interests are enough for every advisor to keep their main technical areas and one industry sector. A low limit also keeps matching fair: the score grows by 2 for every shared interest (FR-15), so a high limit would favor advisors who select many interests. The same limit applies to students.

## 5. Observations

- Machine learning (7 advisors), cybersecurity (6), artificial intelligence (4) and operations research (4) are covered by several advisors; students who choose them will usually be matched in Round 1.
- Several interests have only one advisor (for example Physics, Human-Computer Interaction, Banking and Finance). When that advisor's quota is full, students who chose only that interest are matched in Round 2 or 3 (FR-16), which is expected.
- Three advisors have only one interest (mathematics, educational technology, physics); their students will mostly come from Round 2 and 3.
- Total advisor capacity in the seed data is 465 students (quota 20 for most advisors; two advisors asked for 10 and 15).

## 6. Changes after launch

The administrator adds, renames or deactivates interests and can change the maximum (FR-09, FR-10). A deactivated interest stays on existing profiles and still counts in matching.
