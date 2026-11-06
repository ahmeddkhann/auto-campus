"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

function titleFromPath(pathname: string) {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/teachers/assignments")) return "Teacher assignments";
  if (pathname.startsWith("/admin/teachers/new")) return "Add teacher";
  if (pathname.startsWith("/admin/teachers/")) return "Edit teacher";
  if (pathname.startsWith("/admin/teachers")) return "Teachers";
  if (pathname.startsWith("/admin/head-teachers")) return "Head teachers";
  if (pathname.startsWith("/admin/students/new")) return "Add student";
  if (pathname.startsWith("/admin/students/")) return "Student detail";
  if (pathname.startsWith("/admin/students")) return "Students";
  if (pathname.startsWith("/admin/admins/new")) return "Add admin";
  if (pathname.startsWith("/admin/admins")) return "Admins";
  if (pathname.startsWith("/admin/classes/sections/")) return "Manage section";
  if (pathname.startsWith("/admin/classes")) return "Classes";
  if (pathname.startsWith("/admin/subjects")) return "Subjects";
  if (pathname.startsWith("/admin/attendance/teachers/history"))
    return "Teacher attendance history";
  if (pathname.startsWith("/admin/attendance/reports"))
    return "Attendance reports";
  if (pathname.startsWith("/admin/attendance/teachers"))
    return "Teacher attendance";
  if (pathname.startsWith("/admin/staff/principal")) return "Principal";
  if (pathname.startsWith("/admin/staff/new")) return "Add support staff";
  if (pathname.startsWith("/admin/staff/")) return "Edit support staff";
  if (pathname.startsWith("/admin/staff")) return "Support staff";
  if (pathname.startsWith("/admin/scholarships")) return "Scholarships";
  if (pathname.startsWith("/admin/fines")) return "Fines";
  if (pathname.startsWith("/admin/fees/structures")) return "Fee structures";
  if (pathname.startsWith("/admin/fees/generate")) return "Generate fees";
  if (pathname.startsWith("/admin/fees/collection")) return "Fee collection";
  if (pathname.startsWith("/admin/fees/reports")) return "Fee reports";
  if (pathname.startsWith("/admin/fees")) return "Fees";
  if (pathname.startsWith("/admin/salaries/payments")) return "Salary payments";
  if (pathname.startsWith("/admin/salaries")) return "Salaries";
  if (pathname.startsWith("/admin/maintenance")) return "Maintenance";
  if (pathname.startsWith("/admin/admissions/")) return "Review admission";
  if (pathname.startsWith("/admin/admissions")) return "Admissions";
  if (pathname.startsWith("/admin/settings")) return "Site settings";
  if (pathname.startsWith("/admin/profile")) return "Profile";
  return "Admin";
}

export function AdminShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          title={titleFromPath(pathname)}
          userName={userName}
          onMenuClick={() => setOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
