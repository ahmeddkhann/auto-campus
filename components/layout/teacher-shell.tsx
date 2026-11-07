"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { TeacherHeader } from "@/components/layout/teacher-header";
import { TeacherSidebar } from "@/components/layout/teacher-sidebar";

function titleFromPath(pathname: string) {
  if (pathname === "/teacher") return "Dashboard";
  if (pathname.startsWith("/teacher/classes/")) return "Class section";
  if (pathname.startsWith("/teacher/classes")) return "My classes";
  if (pathname.startsWith("/teacher/students")) return "Students";
  if (pathname.startsWith("/teacher/tests/new")) return "Create test";
  if (pathname.startsWith("/teacher/tests/")) return "Test marks";
  if (pathname.startsWith("/teacher/tests")) return "Tests";
  if (pathname.startsWith("/teacher/exams/new")) return "Create exam";
  if (pathname.startsWith("/teacher/exams/")) return "Exam marks";
  if (pathname.startsWith("/teacher/exams")) return "Exams";
  if (pathname.startsWith("/teacher/attendance/history"))
    return "Attendance history";
  if (pathname.startsWith("/teacher/attendance")) return "Student attendance";
  if (pathname.startsWith("/teacher/my-attendance")) return "My attendance";
  if (pathname.startsWith("/teacher/salary")) return "My salary";
  if (pathname.startsWith("/teacher/profile")) return "Profile";
  return "Teacher";
}

export function TeacherShell({
  userName,
  showAttendanceNav,
  children,
}: {
  userName: string;
  showAttendanceNav: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <TeacherSidebar
        open={open}
        onClose={() => setOpen(false)}
        showAttendanceNav={showAttendanceNav}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TeacherHeader
          title={titleFromPath(pathname)}
          userName={userName}
          onMenuClick={() => setOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
