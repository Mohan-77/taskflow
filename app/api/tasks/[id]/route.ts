import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { isValidObjectId } from "mongoose";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/mongoose";
import TaskModel from "@/lib/models/Task";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const TASK_STATUSES = ["pending", "in-progress", "completed"] as const;

type TaskStatus = (typeof TASK_STATUSES)[number];

function isTaskStatus(value: unknown): value is TaskStatus {
  return (
    typeof value === "string" &&
    TASK_STATUSES.some((status) => status === value)
  );
}

export async function GET(_request: Request, context: RouteContext) {
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

  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid task id." },
      { status: 400 }
    );
  }

  try {
    await connectMongoose();

    const task = await TaskModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error("Get task error:", error);

    return NextResponse.json(
      { success: false, message: "Could not retrieve the task." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
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

  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid task id." },
      { status: 400 }
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

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      {
        success: false,
        message: "Provide a title, description, or status to update.",
      },
      { status: 400 }
    );
  }

  const payload = body as {
    title?: unknown;
    description?: unknown;
    status?: unknown;
  };

  const updates: {
    title?: string;
    description?: string;
    status?: TaskStatus;
  } = {};

  if ("title" in payload) {
    if (typeof payload.title !== "string" || payload.title.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Task title is required." },
        { status: 400 }
      );
    }

    updates.title = payload.title.trim();
  }

  if ("description" in payload) {
    if (typeof payload.description !== "string") {
      return NextResponse.json(
        { success: false, message: "Description must be a string." },
        { status: 400 }
      );
    }

    updates.description = payload.description.trim();
  }

  if ("status" in payload) {
    if (!isTaskStatus(payload.status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Status must be pending, in-progress, or completed.",
        },
        { status: 400 }
      );
    }

    updates.status = payload.status;
  }

  if (
    updates.title === undefined &&
    updates.description === undefined &&
    updates.status === undefined
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Provide a title, description, or status to update.",
      },
      { status: 400 }
    );
  }

  try {
    await connectMongoose();

    const task = await TaskModel.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id,
      },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error("Update task error:", error);

    return NextResponse.json(
      { success: false, message: "Could not update the task." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
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

  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, message: "Task not found." },
      { status: 404 }
    );
  }

  try {
    await connectMongoose();

    const task = await TaskModel.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete task error:", error);

    return NextResponse.json(
      { success: false, message: "Could not delete the task." },
      { status: 500 }
    );
  }
}
