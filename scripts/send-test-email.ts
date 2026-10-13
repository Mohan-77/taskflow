import { readFileSync } from "fs";
import { resolve } from "path";
import { sendTaskCreatedEmail } from "@/lib/email";

function loadEnvFile() {
  let text: string;

  try {
    text = readFileSync(resolve(process.cwd(), ".env"), "utf8");
  } catch {
    return;
  }

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");

    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadEnvFile();

  const recipient = process.env.EMAIL_TEST_TO?.trim();

  if (!recipient) {
    console.error(
      "EMAIL_TEST_TO is missing. Add it to .env, then run this script again."
    );
    process.exitCode = 1;
    return;
  }

  const result = await sendTaskCreatedEmail({
    to: recipient,
    taskTitle: "TaskFlow email test",
  });

  if (!result.success) {
    console.error(result.message);
    process.exitCode = 1;
    return;
  }

  console.log("Test email sent.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.name : "Error");
  process.exitCode = 1;
});
