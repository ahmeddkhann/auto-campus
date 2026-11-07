"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Banknote,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  School,
  UserCircle,
  Users,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  matchPrefix?: string;
};

function buildNavItems(showAttendanceNav: boolean): NavItem[] {
  const items: NavItem[] = [
    { href: "/teacher", label: "Dashboard", icon: LayoutDashboard, exact: true },
    {
      href: "/teacher/classes",
      label: "My classes",
      icon: School,
      matchPrefix: "/teacher/classes",
    },
    {
      href: "/teacher/students",
      label: "Students",
      icon: Users,
      matchPrefix: "/teacher/students",
    },
    {
      href: "/teacher/tests",
      label: "Tests",
      icon: ClipboardList,
      matchPrefix: "/teacher/tests",
    },
    {
      href: "/teacher/exams",
      label: "Exams",
      icon: BookOpen,
      matchPrefix: "/teacher/exams",
    },
  ];

  if (showAttendanceNav) {
    items.push({
      href: "/teacher/attendance",
      label: "Student attendance",
      icon: ClipboardCheck,
      matchPrefix: "/teacher/attendance",
    });
  }

  items.push(
    {
      href: "/teacher/my-attendance",
      label: "My attendance",
      icon: ClipboardCheck,
      exact: true,
    },
    {
      href: "/teacher/salary",
      label: "My salary",
      icon: Banknote,
      exact: true,
    },
    {
      href: "/teacher/profile",
      label: "Profile",
      icon: UserCircle,
      exact: true,
    }
  );

  return items;
}

function isActive(
  pathname: string,
  href: string,
  exact?: boolean,
  matchPrefix?: string
) {
  if (exact) return pathname === href;
  const prefix = matchPrefix ?? href;
  if (pathname === prefix) return true;
  return pathname.startsWith(`${prefix}/`);
}

export function TeacherSidebar({
  open,
  onClose,
  showAttendanceNav,
}: {
  open: boolean;
  onClose: () => void;
  showAttendanceNav: boolean;
}) {
  const pathname = usePathname();
  const navItems = buildNavItems(showAttendanceNav);

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform dark:border-zinc-800 dark:bg-zinc-950 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-5 dark:border-zinc-800">
          <GraduationCap
            className="h-6 w-6 text-emerald-600"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold">Auto Campus</p>
            <p className="text-xs text-zinc-500">Teacher panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(
              pathname,
              item.href,
              item.exact,
              item.matchPrefix
            );

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
