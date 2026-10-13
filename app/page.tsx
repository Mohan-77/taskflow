
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900">
        TaskFlow
      </h1>

      <p className="mt-4 max-w-lg text-lg text-gray-600">
        Organize your tasks, manage your time, and
        stay productive every day.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-900 hover:bg-gray-100"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
