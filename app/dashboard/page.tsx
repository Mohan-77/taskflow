import { redirect } from "next/navigation";
import DashboardView, {
  type DashboardTask,
} from "@/components/dashboard/DashboardView";
import { connectMongoose } from "@/lib/mongoose";
import { getServerSession } from "@/lib/session";
import Task from "@/lib/models/Task";

const TASK_STATUSES = ["pending", "in-progress", "completed"] as const;

function isTaskStatus(
  value: string
): value is DashboardTask["status"] {
  return TASK_STATUSES.some((status) => status === value);
}

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  await connectMongoose();

  const tasks = await Task.find({
    userId: session.user.id,
  })
    .sort({ createdAt: -1 })
    .lean();

  const dashboardTasks: DashboardTask[] = tasks.flatMap((task) => {
    if (!isTaskStatus(task.status)) {
      return [];
    }

    return [
      {
        id: task._id.toString(),
        title: task.title,
        description: task.description ?? "",
        status: task.status,
        createdAt: task.createdAt
          ? new Date(task.createdAt).toISOString()
          : "",
        updatedAt: task.updatedAt
          ? new Date(task.updatedAt).toISOString()
          : "",
      },
    ];
  });

  return (
    <DashboardView
      name={session.user.name || "there"}
      email={session.user.email}
      image={session.user.image ?? null}
      tasks={dashboardTasks}
    />
  );
}
