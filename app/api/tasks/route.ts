import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/mongoose";
import TaskModel from "@/lib/models/Task";
import { sendTaskCreatedEmail } from "@/lib/email";
import { headers } from "next/headers";

export async function GET() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Please log in first." },
      { status: 401 }
    );
  }

  try {
    await connectMongoose();

    const tasks = await TaskModel.find({
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return NextResponse.json(
      { success: false, message: "Could not retrieve tasks." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Please log in first." },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { success: false, message: "Task title is required." },
      { status: 400 }
    );
  }

  const payload = body as { title?: unknown; description?: unknown };

  if (typeof payload.title !== "string" || payload.title.trim() === "") {
    return NextResponse.json(
      { success: false, message: "Task title is required." },
      { status: 400 }
    );
  }

  if (
    payload.description !== undefined &&
    typeof payload.description !== "string"
  ) {
    return NextResponse.json(
      { success: false, message: "Description must be a string." },
      { status: 400 }
    );
  }

  const title = payload.title.trim();
  const description =
    typeof payload.description === "string" ? payload.description.trim() : "";

  try {
    await connectMongoose();

    const task = await TaskModel.create({
      title,
      description,
      userId: session.user.id,
    });

    try {
      const emailResult = await sendTaskCreatedEmail({
        to: session.user.email,
        taskTitle: task.title,
      });

      if (!emailResult.success) {
        console.error("Task email error:", emailResult.message);
      }
    } catch (error) {
      console.error(
        "Task email error:",
        error instanceof Error ? error.name : "Error"
      );
    }

    return NextResponse.json(
      { success: true, task },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create task error:", error);

    return NextResponse.json(
      { success: false, message: "Could not create the task." },
      { status: 500 }
    );
  }
}
