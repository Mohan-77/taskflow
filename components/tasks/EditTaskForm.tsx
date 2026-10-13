"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DeleteTaskButton from "@/components/tasks/DeleteTaskButton";

type TaskStatus = "pending" | "in-progress" | "completed";

type EditTaskResponse = {
  success?: boolean;
  message?: string;
  task?: {
    title?: string;
  };
};

const TASK_STATUSES: TaskStatus[] = ["pending", "in-progress", "completed"];

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
};

function isTaskStatus(value: string): value is TaskStatus {
  return TASK_STATUSES.some((status) => status === value);
}

type EditTaskFormProps = {
  taskId: string;
  title: string;
  description: string;
  status: string;
  createdAt?: string;
};

export default function EditTaskForm({
  taskId,
  title,
  description,
  status,
  createdAt,
}: EditTaskFormProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftDescription, setDraftDescription] = useState(description);
  const [draftStatus, setDraftStatus] = useState<TaskStatus>(
    isTaskStatus(status) ? status : "pending"
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!success) {
      return;
    }

    const timer = window.setTimeout(() => setSuccess(""), 4000);
    return () => window.clearTimeout(timer);
  }, [success]);

  function clearFeedback() {
    setError("");
    setSuccess("");
  }

  async function toggleComplete() {
    if (loading || toggling) {
      return;
    }

    setError("");
    setToggling(true);

    try {
      const response = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status === "completed" ? "pending" : "completed",
        }),
      });

      let data: EditTaskResponse | null = null;

      try {
        data = (await response.json()) as EditTaskResponse;
      } catch {
        data = null;
      }

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok || !data?.success || !data.task) {
        setError(data?.message || "Could not update the task.");
        return;
      }

      router.refresh();
    } catch {
      setError("Request failed. Check your connection and try again.");
    } finally {
      setToggling(false);
    }
  }

  function startEditing() {
    setDraftTitle(title);
    setDraftDescription(description);
    setDraftStatus(isTaskStatus(status) ? status : "pending");
    clearFeedback();
    setEditing(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    clearFeedback();

    const trimmedTitle = draftTitle.trim();
    const trimmedDescription = draftDescription.trim();

    if (!trimmedTitle) {
      setError("Task title is required.");
      return;
    }

    if (!isTaskStatus(draftStatus)) {
      setError("Status must be pending, in-progress, or completed.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          description: trimmedDescription,
          status: draftStatus,
        }),
      });

      let data: EditTaskResponse | null = null;

      try {
        data = (await response.json()) as EditTaskResponse;
      } catch {
        data = null;
      }

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok || !data?.success || !data.task) {
        setError(data?.message || "Could not update the task.");
        return;
      }

      setEditing(false);
      setSuccess("Task updated.");
      router.refresh();
    } catch {
      setError("Request failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (editing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4 px-4 py-4 sm:px-5">
        <div>
          <label
            htmlFor={`edit-title-${taskId}`}
            className="mb-2 block text-sm font-medium text-gray-800"
          >
            Task Title
          </label>
          <input
            id={`edit-title-${taskId}`}
            type="text"
            value={draftTitle}
            onChange={(event) => {
              setDraftTitle(event.target.value);
              clearFeedback();
            }}
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor={`edit-description-${taskId}`}
            className="mb-2 block text-sm font-medium text-gray-800"
          >
            Description
          </label>
          <textarea
            id={`edit-description-${taskId}`}
            value={draftDescription}
            onChange={(event) => {
              setDraftDescription(event.target.value);
              clearFeedback();
            }}
            disabled={loading}
            rows={3}
            className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor={`edit-status-${taskId}`}
            className="mb-2 block text-sm font-medium text-gray-800"
          >
            Status
          </label>
          <select
            id={`edit-status-${taskId}`}
            value={draftStatus}
            onChange={(event) => {
              const nextStatus = event.target.value;
              if (isTaskStatus(nextStatus)) {
                setDraftStatus(nextStatus);
              }
              clearFeedback();
            }}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-600 disabled:opacity-60 sm:w-auto"
          >
            {TASK_STATUSES.map((option) => (
              <option key={option} value={option}>
                {STATUS_LABELS[option]}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => {
              clearFeedback();
              setEditing(false);
            }}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  const currentStatus: TaskStatus = isTaskStatus(status) ? status : "pending";
  const createdLabel = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="px-4 py-4 sm:px-5">
      <div className="flex items-start gap-3">
          <button
            type="button"
            role="checkbox"
            aria-checked={currentStatus === "completed"}
            aria-busy={toggling}
            aria-label={
              currentStatus === "completed"
                ? `Mark ${title} as pending`
                : `Mark ${title} as completed`
            }
            disabled={toggling}
            onClick={toggleComplete}
            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700 focus-visible:ring-offset-2 ${
              currentStatus === "completed"
                ? "border-violet-700 bg-violet-700 text-white"
                : "border-slate-300 bg-white text-transparent hover:border-violet-700"
            } disabled:opacity-60`}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M7.6 13.2 4.4 10l-1.1 1.1 4.3 4.3L16.7 6.3 15.6 5.2z" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="min-w-0 flex-1">
                <h3 className="break-words font-semibold leading-6 text-slate-900">{title}</h3>
                <p className="mt-1 break-words text-sm leading-5 text-slate-600">
                  {description || "No description provided."}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:w-80 md:justify-end">
          <span
            className={`inline-flex min-w-24 justify-center rounded-full px-2.5 py-1 text-xs font-semibold ${
              currentStatus === "completed"
                ? "bg-emerald-50 text-emerald-800"
                : currentStatus === "in-progress"
                  ? "bg-violet-50 text-violet-800"
                  : "bg-amber-50 text-amber-800"
            }`}
          >
            {STATUS_LABELS[currentStatus]}
          </span>
          {createdLabel && (
            <time className="w-28 text-right text-sm text-slate-500" dateTime={createdAt}>
              {createdLabel}
            </time>
          )}
          <button
            type="button"
            aria-label={`Edit ${title}`}
            onClick={startEditing}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700 focus-visible:ring-offset-2"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 20h4l10-10-4-4L4 16v4z" strokeLinejoin="round" />
              <path d="M13 7l4 4" />
            </svg>
          </button>
          <DeleteTaskButton taskId={taskId} taskTitle={title} variant="icon" />
              </div>
            </div>

            {success && (
              <p role="status" className="mt-3 text-sm text-emerald-800">
                {success}
              </p>
            )}
            {error && (
              <p role="alert" className="mt-3 text-sm text-red-700">
                {error}
              </p>
            )}
          </div>
        </div>
    </div>
  );
}
