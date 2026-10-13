"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteTaskResponse = {
  success?: boolean;
  message?: string;
};

export default function DeleteTaskButton({
  taskId,
  taskTitle = "this task",
  variant = "text",
}: {
  taskId: string;
  taskTitle?: string;
  variant?: "text" | "icon";
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`, {
        method: "DELETE",
      });

      let data: DeleteTaskResponse | null = null;

      try {
        data = (await response.json()) as DeleteTaskResponse;
      } catch {
        data = null;
      }

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok || !data?.success) {
        setError(data?.message || "Could not delete the task.");
        return;
      }

      setConfirming(false);
      router.refresh();
    } catch {
      setError("Request failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (variant === "icon") {
    return (
      <div className="relative">
        <button
          type="button"
          aria-label="Delete task"
          onClick={() => {
            setError("");
            setConfirming(true);
          }}
          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700 focus-visible:ring-offset-2"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M4 7h16" strokeLinecap="round" />
            <path d="M9 7V5h6v2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 7l1 12h6l1-12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {confirming && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
            onClick={() => {
              if (!loading) setConfirming(false);
            }}
          >
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby={`delete-title-${taskId}`}
              aria-describedby={`delete-description-${taskId}`}
              className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <h2 id={`delete-title-${taskId}`} className="text-base font-semibold text-slate-900">
                Delete this task?
              </h2>
              <p id={`delete-description-${taskId}`} className="mt-2 text-sm text-slate-600">
                “{taskTitle}” will be removed from your account. This cannot be undone.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={loading}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  autoFocus
                  className="rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Deleting..." : "Delete task"}
                </button>
              </div>
              {error && (
                <p role="alert" className="mt-3 text-sm text-red-700">
                  {error}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="flex flex-col items-start gap-2">
        <p className="text-sm text-gray-700">Delete this task?</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Confirm"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-100 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={() => {
          setError("");
          setConfirming(true);
        }}
        className="w-fit rounded-lg border border-red-200 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        Delete
      </button>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
