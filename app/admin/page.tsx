import Link from "next/link";

import { logout } from "@/actions/auth";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">Admin panel</p>
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold">You are signed in</h2>
          <p className="mt-2 text-sm text-zinc-500">
            The admin panel is ready for the next implementation phase. Management
            modules will appear here.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-semibold text-blue-600"
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </main>
  );
}
