# TaskFlow

TaskFlow is a personal task web application. A registered user can create, search, filter, edit, complete, and delete only their own tasks. Creating a task tries to email that user. The user can also upload a profile photo.

The live site is [https://taskflow-gules-eight-93.vercel.app/](https://taskflow-gules-eight-93.vercel.app/).

## Features that are implemented

- Home, registration, and login pages.
- Email-and-password accounts with Better Auth.
- A dashboard that requires a session.
- Task create, list, edit, status change, and delete.
- Server-side checks so task queries include the signed-in user id.
- Browser search across titles and descriptions, combined with status filters.
- Four counts: total, completed, pending, and in progress.
- A confirmation dialog before delete.
- Profile photo upload stored in MongoDB for the signed-in user, then shown from `/api/profile/avatar`.
- A creation email that does not block the save if sending fails. Delivery of that email on the live site has not been recorded as verified.

## Not implemented

- Due dates, priorities, categories, and task assignment.
- A scheduling calendar.
- Magic-link login.
- An automated test suite.

## Technology

| Piece | Choice |
| --- | --- |
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| UI | React 19 and Tailwind CSS 4 |
| Accounts | Better Auth with the MongoDB adapter |
| Tasks | Mongoose |
| Database | MongoDB, database name `taskflow` |
| Email | Resend |

## Setup

Prerequisites: Node.js, npm, and a MongoDB database. Resend is required only for email.

```bash
npm install
```

Create `.env` in the project root. Do not commit it.

```text
MONGODB_URI=<local-mongodb-connection-string>
MONGODB_URI_DEV=<optional-development-connection-string>
MONGODB_URI_PRO=<production-mongodb-connection-string>
BETTER_AUTH_SECRET=<random-string-at-least-32-characters>
BETTER_AUTH_URL=<base-url-including-protocol-and-port>
RESEND_API_KEY=<resend-api-key>
EMAIL_FROM=<sender-address>
EMAIL_TEST_TO=<address-for-the-test-script-only>
```

Development uses `MONGODB_URI_DEV` when it is set, and otherwise `MONGODB_URI`. Production uses `MONGODB_URI_PRO` only. On the live site, `BETTER_AUTH_URL` must be `https://taskflow-gules-eight-93.vercel.app` with no path.

```bash
npm run dev
```

Open the local URL printed by the dev server.

Checks:

```bash
npx tsc --noEmit
npm run build
```

## Documentation

| Document | Contents |
| --- | --- |
| [docs/TaskFlow_Project_Report.md](docs/TaskFlow_Project_Report.md) | Academic report |
| [docs/RESEARCH_AND_DESIGN.md](docs/RESEARCH_AND_DESIGN.md) | Research gaps and design notes |
| [docs/USER_GUIDE.md](docs/USER_GUIDE.md) | How to use the application |
| [docs/TECHNICAL_DOCUMENTATION.md](docs/TECHNICAL_DOCUMENTATION.md) | Architecture and API |
| [docs/TEST_PLAN.md](docs/TEST_PLAN.md) | Cases and what has actually been observed |
| [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) | GitHub and Vercel outline |
| [docs/SUBMISSION_CHECKLIST.md](docs/SUBMISSION_CHECKLIST.md) | What you still need to add |

## Security note

Task routes take the owner from the session. Do not put connection strings, auth secrets, or API keys in documentation or screenshots.
