# TaskFlow Submission Checklist

Use this list before handing the project to a teacher. Placeholders in the report must be replaced with real academic details. Do not invent research results to make the list look finished.

**Documentation date:** 14 October 2026. The live site is https://taskflow-gules-eight-93.vercel.app/.

## Documents completed

| Document | State |
| --- | --- |
| `README.md` | Replaced with a project overview and links |
| `docs/TaskFlow_Project_Report.md` | Chapters 1–11, references, appendices |
| `docs/RESEARCH_AND_DESIGN.md` | Written. Primary research is marked missing |
| `docs/USER_GUIDE.md` | Written from the implemented screens |
| `docs/TECHNICAL_DOCUMENTATION.md` | Written from the current routes and models |
| `docs/TEST_PLAN.md` | Written. Many rows are not fully tested |
| `docs/DEPLOYMENT_GUIDE.md` | Updated for the live Vercel site. Email delivery there is not verified |
| `docs/SUBMISSION_CHECKLIST.md` | This file |

## Details only the author can supply

- [ ] Student name
- [ ] Student ID
- [ ] Institution
- [ ] Course name and code
- [ ] Supervisor
- [ ] Submission date
- [ ] Any required cover page, word count, or declaration
- [ ] A short personal reflection, if the course asks what you learned
- [ ] Repository URL after the project is pushed

## Screenshots required

None are stored in the repository. Capture these from the running app. Crop out personal email addresses if the course does not need them.

- [ ] S1 Home page
- [ ] S2 Registration validation message
- [ ] S3 Login page
- [ ] S4 Dashboard with the four counts and at least one task
- [ ] S5 Create-task dialog
- [ ] S6 Search or filter result line
- [ ] S7 Edit form
- [ ] S8 Delete confirmation
- [ ] S9 Profile photo after a successful upload
- [ ] S10 Logged-out visit to `/dashboard` showing the login page

## Tests that still need a recorded run

- [ ] T-11 Checkbox completion and return to pending, with counts
- [ ] T-12 Description-only search combined with a status filter
- [ ] T-14 Delete cancellation
- [ ] T-15 Second account cannot list or read another user’s task, and PUT and DELETE return 404 without changing the task
- [ ] T-16 Invalid status body and an unchanged task
- [ ] T-17 Email that the provider accepts, including on the live site
- [ ] T-20 Profile photo rejection
- [ ] T-21 Current layout at phone, tablet, and desktop widths
- [ ] Your own written notes if the course requires a personal test log. The author reported on 14 October 2026 that the main live-site features were tested. Screenshots are still missing.

Observed local results for typecheck, build, registration validation, login, logout, create, edit, delete, and one email failure are already described in `docs/TEST_PLAN.md`. Replace them with your own evidence if the teacher requires that.

## Missing research evidence

- [ ] No survey or interview notes exist. Do not invent them.
- [ ] No sourced comparison of other task products exists.
- [ ] Official pages for TypeScript, Tailwind, MongoDB, Mongoose, and Vercel were listed but not retrieved on 13 October 2026. Open them and record the access date.
- [ ] Pages that were retrieved: Next.js App Router, Better Auth introduction, Resend with Next.js.

## Incomplete or unverified features

- [ ] Due dates and priorities are not implemented. They are future work.
- [ ] Categories, calendar scheduling, teams, and magic-link login are not implemented.
- [ ] Profile photo rejection (T-20) is not recorded.
- [ ] `GET /api/tasks` exists, but the dashboard loads tasks with `Task.find` instead.
- [ ] DELETE and GET/PUT disagree on the status code for an invalid task id.
- [ ] The live site is https://taskflow-gules-eight-93.vercel.app/. The author reported testing the main features there on 14 October 2026. Screenshots are not in the repository.
- [ ] Creation-email delivery on the live site is not verified.
- [ ] `npx tsx scripts/send-test-email.ts` depends on `tsx`, which is not listed in `package.json`.

## Final checks

- [ ] `.env` is not committed.
- [ ] No API keys, passwords, or personal emails are in the Markdown files.
- [ ] README links open the documents above.
- [ ] The report’s feature list matches the code you are submitting.
- [ ] You can explain authentication, `userId`, and the email-failure behavior without reading secrets aloud.
- [ ] You did not describe AI-written documentation as if it were a user study or your own test log.
