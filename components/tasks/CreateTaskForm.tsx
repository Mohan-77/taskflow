"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CreateTaskResponse = {
  success?: boolean;
  message?: string;
  task?: {
    title?: string;
  };
};

export default function CreateTaskForm({
  variant = "card",
  onSuccess,
}: {
  variant?: "card" | "plain";
  onSuccess?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function clearFeedback() {
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    clearFeedback();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setSuccess("");
      setError("Task title is required.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          description: trimmedDescription,
        }),
      });

      let data: CreateTaskResponse | null = null;

      try {
        data = (await response.json()) as CreateTaskResponse;
      } catch {
        data = null;
      }

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok || !data?.success || !data.task) {
        setError(
          data?.message || "Could not create the task. Please try again."
        );
        return;
      }

      setTitle("");
      setDescription("");
      setSuccess("Task created successfully.");
      router.refresh();
      onSuccess?.();
    } catch {
      setError("Request failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const form = (
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="task-title"
            className="mb-2 block text-sm font-medium text-gray-800"
          >
            Task Title
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              clearFeedback();
            }}
            required
            disabled={loading}
            autoFocus={variant === "plain"}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-violet-500 disabled:opacity-60"
            placeholder="What needs to be done?"
          />
        </div>

        <div>
          <label
            htmlFor="task-description"
            className="mb-2 block text-sm font-medium text-gray-800"
          >
            Description
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              clearFeedback();
            }}
            disabled={loading}
            rows={4}
            className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-violet-500 disabled:opacity-60"
            placeholder="Add more detail (optional)"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="text-sm text-green-600">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-violet-700 px-4 py-2.5 font-semibold text-white hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating task..." : "Create Task"}
        </button>
      </form>
  );

  if (variant === "plain") {
    return form;
  }

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-semibold text-slate-900">Create Task</h2>
      <p className="mt-2 text-slate-500">
        Add a title and an optional description.
      </p>
      <div className="mt-6">{form}</div>
    </section>
  );
}
