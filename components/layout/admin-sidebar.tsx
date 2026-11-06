"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Shield,
  UserCircle,
  Users,
  School,
  Wrench,
  FileText,
  Banknote,
  UserCog,
} from "lucide-react";

const navItems: Array<{
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  matchPrefix?: string;
}> = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  {
    href: "/admin/teachers",
    label: "Teachers",
    icon: Users,
    matchPrefix: "/admin/teachers",
  },
  {
    href: "/admin/teachers/assignments",
    label: "Assignments",
    icon: ClipboardCheck,
    exact: true,
  },
  { href: "/admin/head-teachers", label: "Head teachers", icon: UserCog },
  { href: "/admin/students", label: "Students", icon: GraduationCap },
  { href: "/admin/admins", label: "Admins", icon: Shield },
  { href: "/admin/classes", label: "Classes", icon: School },
  { href: "/admin/subjects", label: "Subjects", icon: BookOpen },
  {
    href: "/admin/attendance/teachers",
    label: "Teacher attendance",
    icon: ClipboardCheck,
    matchPrefix: "/admin/attendance",
  },
  {
    href: "/admin/staff",
    label: "Support staff",
    icon: Users,
    matchPrefix: "/admin/staff",
  },
  { href: "/admin/scholarships", label: "Scholarships", icon: CreditCard },
  { href: "/admin/fines", label: "Fines", icon: Banknote },
  {
    href: "/admin/fees/structures",
    label: "Fees",
    icon: CreditCard,
    matchPrefix: "/admin/fees",
  },
  { href: "/admin/salaries", label: "Salaries", icon: Banknote },
  { href: "/admin/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/admin/admissions", label: "Admissions", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/profile", label: "Profile", icon: UserCircle },
];

function isActive(
  pathname: string,
  href: string,
  exact?: boolean,
  matchPrefix?: string
) {
  if (exact) return pathname === href;
  const prefix = matchPrefix ?? href;
  if (pathname === prefix) return true;
  if (pathname.startsWith(`${prefix}/`)) {
    // Prefer more specific sibling links (e.g. Assignments under Teachers).
    if (prefix === "/admin/teachers" && pathname.startsWith("/admin/teachers/assignments")) {
      return false;
    }
    return true;
  }
  return false;
}

export function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

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
          <GraduationCap className="h-6 w-6 text-blue-600" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">Auto Campus</p>
            <p className="text-xs text-zinc-500">Admin panel</p>
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
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
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
