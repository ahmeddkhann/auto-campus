"use client";

import { Menu } from "lucide-react";

import { logout } from "@/actions/auth";

export function AdminHeader({
  title,
  userName,
  onMenuClick,
}: {
  title: string;
  userName: string;
  onMenuClick: () => void;
}) {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg border border-zinc-200 p-2 lg:hidden dark:border-zinc-700"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-xs text-zinc-500 sm:hidden">{userName}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="hidden text-sm text-zinc-600 dark:text-zinc-300 sm:block">
          {userName}
        </p>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
