# TaskFlow User Guide

This guide explains how to use TaskFlow. Setup for developers is in [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) and Chapter 7 of [TaskFlow_Project_Report.md](./TaskFlow_Project_Report.md).

Use the address printed by the development server. It is often `http://localhost:3000`, but the port can differ.

## Create an account

1. Open the home page and choose **Get Started**.
2. Enter your name, email address, and a password of 8 to 128 characters.
3. Enter the same password again.
4. Choose **Create account**.

If the name is only spaces, the form says “Full name is required.” If the passwords differ, it says “Passwords do not match.” An invalid email or a short password is also rejected. Fix the field and submit again.

## Sign in and sign out

1. Choose **Login** on the home page.
2. Enter the same email address and password.
3. Choose **Sign in**.
4. To leave, open the dashboard sidebar and choose **Log out**. On a phone, use the menu button or the round avatar to open the sidebar first.

After logout, the login page is shown. The dashboard will not open until you sign in again.

## The dashboard

The dashboard shows:

- A greeting that uses the first word of your name.
- **Total Tasks**, **Completed**, **Pending**, and **In Progress**.
- **My Tasks**, the list of your tasks.

Those counts always describe your whole account. A search does not change the four numbers. It only changes which rows are visible.

## Create a task

1. Choose **Create Task**.
2. Enter a title. A description is optional.
3. Submit.

You should see “Task created successfully.” for a few seconds. You can also choose **Close** on that notice. The task starts as **Pending**.

A blank title is rejected. The task is not saved.

TaskFlow tries to email the address on your account. If email is not set up, the task can still appear in the list. The page does not show a separate email-failure warning.

## Search and filter

Type in **Search titles and descriptions**. Then choose **All**, **Pending**, **In Progress**, or **Completed**.

A row is shown only when both of these are true:

- The status matches the button you chose, or you chose All.
- The search text is empty, or it appears in the title or the description.

The line under the buttons tells you how many tasks are showing. If none match, your tasks are still saved. Clear the search or choose All.

## Edit a task

1. Choose the pencil control on the row.
2. Change the title, description, or status.
3. Choose **Save changes**.

“Task updated.” appears briefly. **Cancel** discards the edit.

The checkbox is separate. It marks the task **Completed**. Choose it again to set the task back to **Pending**. Use the edit form if you want **In Progress**.

## Delete a task

1. Choose the trash control.
2. Read the dialog. It names the task.
3. Choose **Delete task** to remove it, or **Cancel** to keep it.

## Change your photo

In the sidebar, choose the photo or **Change photo**. Use a JPG, PNG, WEBP, or GIF file of 2 MB or less. A short notice says “Profile photo updated.” when the save succeeds.

This upload was not clicked through when the guide was written. If it fails, note the message and continue using the initials avatar.

## Troubleshooting

| What you see | What it means |
| --- | --- |
| The dashboard jumps to the login page | You are signed out. Sign in again. |
| “Full name is required.” | The name is empty after spaces are removed. |
| “Passwords do not match.” | The two password fields differ. |
| “Task title is required.” | The title is empty or only spaces. |
| “Request failed. Check your connection and try again.” | The browser did not get a response. Check that the server is running. |
| A red message from the server | Read the sentence. It is the API `message`, such as an invalid status or a missing task. |
| The task exists but no email arrived | Mail is optional for saving the task. The sender and your account email must be allowed by the email provider. |

TaskFlow does not have due dates, priorities, categories, or shared task lists.
