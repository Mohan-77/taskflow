# TaskFlow Deployment Guide

**Status:** deployed. The live site is https://taskflow-gules-eight-93.vercel.app/. The author reported on 14 October 2026 that the main account, task, and profile-photo features were tested there. This guide does not include a new screenshot set. Successful creation-email delivery on that site has not been recorded as verified.

There is no `vercel.json`. The repository has an `origin` remote. Local setup detail is also in Chapter 7 of [TaskFlow_Project_Report.md](./TaskFlow_Project_Report.md).

## GitHub preparation

1. The GitHub repository already has an `origin` remote. Do not create a second one unless you are moving the project.
2. Confirm `.gitignore` ignores `.env*` and `/public/avatars/*`.
3. Do not commit `.env`, screenshots that show a personal email address, or avatar files.
4. Push the branch the course requires. Do not force-push `main`.

```bash
git remote add origin <repository-url>
git push -u origin HEAD
```

Run those commands yourself when you are ready. This guide does not push for you.

## Vercel deployment

The current production site is https://taskflow-gules-eight-93.vercel.app/. These steps describe that host. They are not a claim that every future deployment was retested.

1. In Vercel, import the GitHub repository.
2. Framework preset: Next.js. The build command in `package.json` is `next build --turbopack`. If the host rejects that flag, use the host’s documented Next.js build command and record the change.
3. Add environment variables for the Production environment:

| Name | Placeholder | Required |
| --- | --- | --- |
| `MONGODB_URI_PRO` | `<production-mongodb-connection-string>` | Yes |
| `BETTER_AUTH_SECRET` | `<random string, at least 32 characters>` | Yes |
| `BETTER_AUTH_URL` | `https://taskflow-gules-eight-93.vercel.app` | Yes |
| `RESEND_API_KEY` | `<resend-api-key>` | Only if email should send |
| `EMAIL_FROM` | `<verified sender>` | Only if email should send |

Do not put the local development URI in `MONGODB_URI_PRO`. Do not put `EMAIL_TEST_TO` on the production host unless you intend to run the test script there.

4. Deploy.
5. `BETTER_AUTH_URL` must be exactly `https://taskflow-gules-eight-93.vercel.app`, with `https`, no path, and no trailing slash. A different origin makes registration return “Invalid origin”.

## Database configuration

- Production reads `MONGODB_URI_PRO` through `lib/mongodb-uri.ts`. Development reads `MONGODB_URI_DEV` if it is set, and otherwise `MONGODB_URI`.
- The app always uses the database name `taskflow` (`lib/db.ts` and `lib/mongoose.ts`).
- The MongoDB user needs read and write access to that database.
- Registering a user creates Better Auth’s user, session, and account data.
- Creating a task creates documents in `tasks`.
- The current `mongodbAdapter(db)` call does not enable the adapter’s transaction helper, because no MongoClient is passed into the adapter options. Do not document a replica set as a requirement of this code unless you change that call.

Use a separate database user or cluster for production if you do not want student test data in the live database.

## Profile images in production

`POST /api/profile/avatar` stores the image bytes in MongoDB for the signed-in user. `GET /api/profile/avatar` returns those bytes only to that user. The live site does not need a writable `public/avatars` directory. The author reported that profile-photo upload works locally. A separate rejection test, such as a non-image file, is still not recorded.

## Email in production

Resend’s documentation, accessed 13 October 2026, says a verified domain is required for normal sending and that the shared test sender is limited: https://resend.com/docs/send-with-nextjs

`EMAIL_FROM` must be a sender the provider accepts for the signed-in user’s address. A rejected email still allows task creation to return HTTP 201. Successful delivery on https://taskflow-gules-eight-93.vercel.app/ has not been recorded. Do not describe the live site as sending verified email until a message is received and noted without copying addresses or secrets into the report.

## Production testing

After the first deploy, and only against data you are allowed to create:

1. Open `/` , `/login`, and `/register`.
2. While logged out, open `/dashboard` and confirm the login page.
3. Register or sign in.
4. Create a task and confirm it appears only for that account.
5. Edit, toggle completion, and delete it.
6. Sign out and confirm `/dashboard` returns to login.
7. If a second account exists, confirm it cannot read the first account’s task.
8. Check function logs for secrets. Logs should not contain `MONGODB_URI`, `BETTER_AUTH_SECRET`, or `RESEND_API_KEY`.

## Troubleshooting

| Problem | Check |
| --- | --- |
| Build fails on the host | Node version and the build command. Reproduce with `npm run build` locally. |
| Auth errors only in production | `BETTER_AUTH_URL` must be the public origin. `BETTER_AUTH_SECRET` must be set. |
| Database timeout | The host’s network must be allowed by MongoDB’s access list. |
| Tasks save, email does not | Provider dashboard and `EMAIL_FROM`. The app treats email failure as non-blocking. |
| Photo upload fails | The response message. Production no longer writes `public/avatars`. |
| “Invalid origin” on register or login | `BETTER_AUTH_URL` must be `https://taskflow-gules-eight-93.vercel.app`. |
| Logged-in local site breaks after a local production build | Restart `npm run dev`. The build replaces `.next`. |
