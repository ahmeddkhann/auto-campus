import { redirect } from "next/navigation";

import { TeacherShell } from "@/components/layout/teacher-shell";
import {
  getTeacherIdForAuth,
  verifySession,
} from "@/lib/dal/auth";
import { listActiveHeadSections } from "@/lib/dal/teacher-panel";

export const instant = false;

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await verifySession();

  if (!user || user.role !== "teacher" || !profile) {
    redirect("/login?next=/teacher");
  }

  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) {
    redirect("/login?next=/teacher");
  }

  const headSections = await listActiveHeadSections(teacherId);

  return (
    <TeacherShell
      userName={profile.full_name || profile.email}
      showAttendanceNav={headSections.length > 0}
    >
      {children}
    </TeacherShell>
  );
}
