# TaskFlow Research and Design Notes

This note separates what the repository proves from research that has not been recorded. It is a companion to Chapter 2 and Chapter 3 of [TaskFlow_Project_Report.md](./TaskFlow_Project_Report.md).

**Documentation date:** 13 October 2026

## Research questions

These questions are appropriate for the project. They are not a record of answers collected from users.

1. What does a personal task list need in order to be useful without team features?
2. How should a web application stop one account from reading another account’s tasks?
3. Which libraries already in reach of a Next.js application can provide accounts, a document database, and email?

## Research approach

No survey, interview, experiment, or literature log is stored in the repository. Those activities are **unperformed** unless the author adds dated notes and sources.

A usable approach, still to be carried out if the course requires it:

1. Choose comparison criteria before reading product marketing.
2. Read vendor documentation and record the URL and access date.
3. Write findings in the author’s own words.
4. Keep technology decisions that were already made in this code labelled as implementation facts, not as research results.

## Existing solutions

A systematic comparison was **not** performed. Do not add a feature table for other products unless each cell has a source. Suggested criteria, if the author completes the study later:

| Criterion | Why it matters for TaskFlow |
| --- | --- |
| Account required | TaskFlow has no public task list. |
| Personal rather than team tasks | The data model has one `userId` and no members. |
| Status values | TaskFlow uses pending, in-progress, and completed. |
| Email on create | TaskFlow sends one plain-text message after save. |
| Self-hosted data | TaskFlow uses the project’s own MongoDB database. |

## Technology evaluation

The installed stack is recorded in `package.json` and used as follows.

| Technology | Evidence it is used | Design rationale, not a recorded study |
| --- | --- | --- |
| Next.js 15 App Router | `app/` pages and `app/api` routes | One project serves the interface and the HTTP API. |
| TypeScript, strict | `tsconfig.json` | Mismatched fields fail before runtime. |
| Tailwind CSS 4 | `app/globals.css` and component classes | Styling stays beside the markup. |
| MongoDB native driver | `lib/db.ts` | Required by the Better Auth MongoDB adapter. |
| Mongoose | `lib/models/Task.ts` | Schema and validators for tasks. |
| Better Auth 1.7.7 | `lib/auth.ts` | Email-and-password accounts and sessions. |
| Resend | `lib/email.ts` | Server-side mail after a task is created. |

Alternatives such as another database or another auth library were not compared in a saved document.

## Requirements and design decisions

Functional and non-functional requirements are listed in the project report, Chapter 2. They were derived from the code.

Decisions that are visible in the code:

- The dashboard layout redirects when `getServerSession` returns no session. A root middleware file is not used.
- Task `userId` is taken from the session on create and is part of every lookup.
- Email failure is logged and does not change the HTTP 201 response.
- Profile images are stored in MongoDB, one document per user, and served by `GET /api/profile/avatar` to that user only. The task schema is unchanged.
- Search filters tasks already loaded in the browser. It does not add a search API.

## Verified references

Accessed 13 October 2026:

- Next.js App Router: https://nextjs.org/docs/app
- Better Auth introduction: https://www.better-auth.com/docs/introduction
- Resend with Next.js: https://resend.com/docs/send-with-nextjs

Not retrieved while this note was written. Confirm before submission:

- https://www.typescriptlang.org/docs/
- https://tailwindcss.com/docs
- https://www.mongodb.com/docs/manual/
- https://mongoosejs.com/docs/guide.html
- https://vercel.com/docs

## Missing research evidence

The author still needs to supply, if the course requires them:

- Personal notes on why this problem was chosen.
- Any real comparison of existing products, with URLs and dates.
- Any survey or interview results. Do not invent participants.
- A short reflection that is actually the author’s.
