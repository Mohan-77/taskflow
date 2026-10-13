# TaskFlow Test Plan

**Date of this plan:** 13 October 2026

There is no automated suite. Status values mean:

- **Observed:** a local development session recorded this result. It is not a stored screenshot in the repository.
- **Partial:** some evidence exists, or only part of the case was seen.
- **Not tested:** the code exists, but this result was not recorded.
- **Not retested:** someone reported an earlier result, and it was not repeated for this document.

The author should run every row and replace Actual result with their own notes. Do not copy these statuses into a submission as personal lab work unless the author performed them.

Full narrative: Chapter 8 of [TaskFlow_Project_Report.md](./TaskFlow_Project_Report.md).

These IDs match Chapter 8 of the project report. Do not renumber them.

| ID | Feature | Preconditions | Steps | Expected result | Actual result | Status |
| --- | --- | --- | --- | --- | --- | --- |
| T-01 | Typecheck | Dependencies installed | `npx tsc --noEmit` | Exit 0 | Exit 0 on 13 October 2026 | Observed |
| T-02 | Production build | Dependencies installed | `npm run build` | Build completes | Exit 0. Next.js 15.5.27 included `/api/profile/avatar`. Image-tag warnings did not fail the build | Observed |
| T-03 | Registration validation | Logged out | Submit empty, space-only name, bad email, short password | Field errors, no account | Messages shown. Stayed on the registration page | Observed |
| T-04 | Successful registration | New email | Submit valid data | Dashboard opens | Earlier local sign-up succeeded. Not scripted for this plan | Partial |
| T-05 | Login | Existing account | Correct password | Dashboard opens | A development browser reached the dashboard. A wrong password also produced HTTP 401 in the dev log. The login error text was not archived | Observed |
| T-06 | Protected dashboard | Logged out | Open `/dashboard` | Login page | Login page shown | Observed |
| T-07 | Logout | Signed in | Log out, then open `/dashboard` | Login page both times | Sign-out HTTP 200, then login page | Observed |
| T-08 | Create task | Signed in | Title and description | 201, row appears, counts increase | Temporary task created. Counts increased. Success notice shown | Observed |
| T-09 | Empty title | Signed in | Submit spaces | No create. Title-required message | Form blocks this. API 400 is in the route and was not re-run for this plan | Partial |
| T-10 | Edit and status | Signed in, task exists | Save status In Progress | 200, counts change | Temporary task updated. PUT 200. Counts changed | Observed |
| T-11 | Checkbox | Signed in | Toggle the checkbox | Completed, then pending, and counts refresh | Same PUT route as edit. A dedicated click was not recorded | Not tested |
| T-12 | Search and filter | At least two tasks | Search a title and select a status | Matching rows only. Account counts stay unchanged | Title search limited the list. Description-only search was not recorded separately | Observed |
| T-13 | Delete | Signed in | Confirm delete | Row gone, counts drop | Temporary task DELETE 200 | Observed |
| T-14 | Delete cancel | Signed in | Open the dialog and choose Cancel | Row remains | Implemented. A separate recorded click was not kept | Not tested |
| T-15 | Other user’s task | Two accounts | From the second account, list, read, update, and delete the first user’s task | Omitted from the list. Read, update, and delete return 404 | Developer reported that list and read failed for the other account. Update and delete across accounts were not recorded as finished | Partial |
| T-16 | Invalid status | Signed in | PUT a status outside the enum, such as `done` | 400 and the task is unchanged | The route has the check. Earlier 400 logs did not keep the response body | Partial |
| T-17 | Email success | Resend allows the recipient | Create a task | Provider accepts the message and the task is saved | Delivery was reported during development. Not repeated | Not retested |
| T-18 | Email failure still saves | Provider rejects the send | Create a task | HTTP 201 and a server log line | A local create returned 201 while Resend logged an error | Observed |
| T-19 | Profile photo | Signed in, small PNG | Upload | Photo shows after refresh | Not run | Not tested |
| T-20 | Profile photo rejection | Signed in | Non-image or a file over 2 MB | HTTP 400 and no user-image change | Not run | Not tested |
| T-21 | Narrow layout | Signed in | View around 390 CSS pixels wide | No horizontal overflow. Menu contains Log out | Checked on an earlier dashboard revision, not this photo revision | Partial |
| T-22 | Production host | A real deployment | Sign in and create a task | Same rules as local | No live URL verified | Not tested |

## Evidence still required

- Screenshots S1–S10 listed in the project report, Chapter 6.
- T-11, a recorded checkbox click that sets completed and then pending.
- T-12, a description-only search combined with a status filter.
- T-14, cancel on the delete dialog.
- T-15, a repeated second-account list and read, plus PUT and DELETE that return 404 and leave the task unchanged.
- T-16, an invalid status response body and confirmation that the task did not change.
- T-17, an email the provider accepts.
- T-19 and T-20, profile upload success and rejection.
- T-21, the current layout at phone width.
- T-22, a live host, only after a real deployment.
- The author’s own execution notes if the teacher requires personal testing rather than this development log.
