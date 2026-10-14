"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import ProfilePhoto from "@/components/dashboard/ProfilePhoto";
import CreateTaskForm from "@/components/tasks/CreateTaskForm";
import EditTaskForm from "@/components/tasks/EditTaskForm";

type TaskStatus = "pending" | "in-progress" | "completed";
type StatusFilter = "all" | TaskStatus;

export type DashboardTask = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

const FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700 focus-visible:ring-offset-2";

function greetingFor(name: string) {
  const hour = new Date().getHours();
  const hello =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const first = name.trim().split(/\s+/)[0] || "there";
  return `${hello}, ${first}`;
}

function Icon({
  name,
}: {
  name: "check" | "list" | "clock" | "plus" | "search" | "menu" | "tasks";
}) {
  const common = {
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
  } as const;

  if (name === "check") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M8.5 12.4 11 14.8l4.6-5.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4.5L15 15" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "plus") {
    return (
      <svg {...common}>
        <path d="M12 6v12M6 12h12" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "search") {
    return (
      <svg {...common} className="h-4 w-4">
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16.5 20 20.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "menu") {
    return (
      <svg {...common}>
        <path d="M5 7h14M5 12h14M5 17h14" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "tasks") {
    return (
      <svg {...common}>
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <path d="M8 9h8M8 13h8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4" strokeLinecap="round" />
    </svg>
  );
}

type Notice = {
  id: number;
  message: string;
  tone: "success" | "error";
};

export default function DashboardView({
  name,
  email,
  image,
  tasks,
}: {
  name: string;
  email: string;
  image: string | null;
  tasks: DashboardTask[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const photoSrc = image?.startsWith("/api/profile/avatar") ? image : null;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "Escape") {
        setCreateOpen(false);
        setSidebarOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timer = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function showNotice(message: string, tone: Notice["tone"] = "success") {
    setNotice({ id: Date.now(), message, tone });
  }

  const counts = useMemo(
    () => ({
      all: tasks.length,
      pending: tasks.filter((task) => task.status === "pending").length,
      "in-progress": tasks.filter((task) => task.status === "in-progress").length,
      completed: tasks.filter((task) => task.status === "completed").length,
    }),
    [tasks]
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      const matchesQuery =
        needle.length === 0 ||
        task.title.toLowerCase().includes(needle) ||
        task.description.toLowerCase().includes(needle);

      return matchesStatus && matchesQuery;
    });
  }, [query, statusFilter, tasks]);

  function openCreate() {
    setSidebarOpen(false);
    setCreateOpen(true);
  }

  const activeFilter = FILTERS.find((filter) => filter.id === statusFilter);
  const trimmedQuery = query.trim();

  function scrollToTasks() {
    setSidebarOpen(false);
    document.getElementById("my-tasks")?.scrollIntoView({ behavior: "smooth" });
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-700 text-white">
          <Icon name="check" />
        </span>
        <span>
          <span className="block text-base font-semibold text-slate-900">TaskFlow</span>
          <span className="block text-xs text-slate-500">Plan, do, achieve</span>
        </span>
      </div>

      <nav className="space-y-1 px-3" aria-label="Dashboard">
        <a
          href="#overview"
          onClick={() => setSidebarOpen(false)}
          className={`flex items-center gap-3 rounded-lg bg-violet-50 px-3 py-2.5 text-sm font-medium text-violet-800 ${focusRing}`}
          aria-current="page"
        >
          <Icon name="tasks" />
          Dashboard
        </a>
        <button
          type="button"
          onClick={scrollToTasks}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 ${focusRing}`}
        >
          <Icon name="list" />
          My Tasks
        </button>
        <button
          type="button"
          onClick={openCreate}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 ${focusRing}`}
        >
          <Icon name="plus" />
          Create Task
        </button>
      </nav>

      <div className="mt-auto border-t border-slate-200 p-4">
        <ProfilePhoto
          name={name}
          email={email}
          image={photoSrc}
          onNotice={showNotice}
        />
        <LogoutButton
          label="Log out"
          className={`mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 ${focusRing}`}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:block">
        {sidebar}
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-30 bg-slate-900/40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-[#f5f6f8]/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
              className={`rounded-lg border border-slate-200 bg-white p-2 text-slate-700 lg:hidden ${focusRing}`}
            >
              <Icon name="menu" />
            </button>

            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search tasks</span>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon name="search" />
              </span>
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search titles and descriptions"
                className={`w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-16 text-sm text-slate-900 ${focusRing}`}
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-500 sm:inline">
                Ctrl K
              </kbd>
            </label>

            <button
              type="button"
              aria-label="Open account menu"
              onClick={() => setSidebarOpen(true)}
              className={`shrink-0 overflow-hidden rounded-full lg:hidden ${focusRing}`}
            >
              {photoSrc ? (
                <img src={photoSrc} alt="" className="h-9 w-9 object-cover" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center bg-violet-100 text-sm font-semibold text-violet-800">
                  {(name.trim()[0] || "T").toUpperCase()}
                </span>
              )}
            </button>
          </div>
        </header>

        <main id="overview" className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {greetingFor(name)}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Review your work and keep the next task moving.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreate}
              className={`inline-flex items-center justify-center gap-2 rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 ${focusRing}`}
            >
              <Icon name="plus" />
              Create Task
            </button>
          </div>

          {notice && (
            <div
              role="status"
              className={`fixed bottom-4 right-4 z-50 flex w-[min(100%-2rem,22rem)] items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${
                notice.tone === "error"
                  ? "border-red-200 bg-white text-red-700"
                  : "border-emerald-200 bg-white text-emerald-800"
              }`}
            >
              <p>{notice.message}</p>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => setNotice(null)}
                className={`rounded px-1 text-slate-500 hover:text-slate-800 ${focusRing}`}
              >
                Close
              </button>
            </div>
          )}

          <section aria-label="Task statistics" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Total Tasks" value={counts.all} icon="tasks" tone="text-slate-700 bg-slate-100" />
            <StatCard label="Completed" value={counts.completed} icon="check" tone="text-emerald-800 bg-emerald-50" />
            <StatCard label="Pending" value={counts.pending} icon="clock" tone="text-amber-800 bg-amber-50" />
            <StatCard label="In Progress" value={counts["in-progress"]} icon="list" tone="text-violet-800 bg-violet-50" />
          </section>

          <section id="my-tasks" className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
              <h2 className="text-lg font-semibold text-slate-900">My Tasks</h2>
              <p className="mt-1 text-sm text-slate-600">
                {counts.all === 0
                  ? "No tasks yet."
                  : `${counts.all} task${counts.all === 1 ? "" : "s"} in your account.`}
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-5" role="toolbar" aria-label="Filter tasks by status">
              {FILTERS.map((filter) => {
                const selected = statusFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setStatusFilter(filter.id)}
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ${focusRing} ${
                      selected
                        ? "bg-violet-700 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {filter.label}
                    <span className="ml-1.5">{counts[filter.id]}</span>
                  </button>
                );
              })}
            </div>

            {(trimmedQuery || statusFilter !== "all") && (
              <p className="px-4 pb-3 text-sm text-slate-600 sm:px-5">
                Showing {filtered.length}{" "}
                {filtered.length === 1 ? "task" : "tasks"}
                {trimmedQuery ? ` matching “${trimmedQuery}”` : ""}
                {statusFilter !== "all" ? ` in ${activeFilter?.label}` : ""}.
              </p>
            )}

            {filtered.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-base font-medium text-slate-900">
                  {tasks.length === 0 ? "You have no tasks yet." : "No tasks match this view."}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {tasks.length === 0
                    ? "Create a task to start tracking your work."
                    : "Try a different status or clear the search."}
                </p>
                {tasks.length === 0 && (
                  <button
                    type="button"
                    onClick={openCreate}
                    className={`mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 ${focusRing}`}
                  >
                    <Icon name="plus" />
                    Create Task
                  </button>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-slate-200">
                {filtered.map((task) => (
                  <li key={task.id}>
                    <EditTaskForm
                      taskId={task.id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      createdAt={task.createdAt}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>

      {createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
          onClick={() => setCreateOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-task-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="create-task-title" className="text-lg font-semibold text-slate-900">
                  Create Task
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Add a title and an optional description.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setCreateOpen(false)}
                className={`rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 ${focusRing}`}
              >
                Close
              </button>
            </div>
            <CreateTaskForm
              variant="plain"
              onSuccess={() => {
                setCreateOpen(false);
                showNotice("Task created successfully.");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: "check" | "list" | "clock" | "tasks";
  tone: string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}>
          <Icon name={icon} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
    </article>
  );
}
