import { Resend } from "resend";

type SendTaskCreatedEmailInput = {
  to: string;
  taskTitle: string;
};

export type SendTaskCreatedEmailResult =
  | { success: true }
  | { success: false; message: string };

export async function sendTaskCreatedEmail({
  to,
  taskTitle,
}: SendTaskCreatedEmailInput): Promise<SendTaskCreatedEmailResult> {
  if (typeof window !== "undefined") {
    return {
      success: false,
      message: "Email can only be sent from the server.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return {
      success: false,
      message: "Email is not configured.",
    };
  }

  const recipient = to.trim();
  const title = taskTitle.trim();

  if (!recipient || !title) {
    return {
      success: false,
      message: "Recipient email and task title are required.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: recipient,
      subject: "Your TaskFlow task was created",
      text: `Your task "${title}" was created.`,
    });

    if (error) {
      console.error("Task email error:", error.name);
      return {
        success: false,
        message: "Could not send the task email.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error(
      "Task email error:",
      error instanceof Error ? error.name : "Error"
    );
    return {
      success: false,
      message: "Could not send the task email.",
    };
  }
}
