import { redirect } from "next/navigation";

import { StudentAttendanceForm } from "@/components/forms/student-attendance-form";
import { StudentAttendanceNav } from "@/components/teacher/student-attendance-nav";
import { fieldClassName, labelClassName } from "@/components/ui/field";
import { getStudentAttendanceForDate } from "@/lib/dal/attendance";
import { getTeacherIdForAuth } from "@/lib/dal/auth";
import {
  listActiveHeadSections,
  listActiveStudentsInSection,
} from "@/lib/dal/teacher-panel";

export const instant = false;

export default async function TeacherStudentAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; sectionId?: string }>;
}) {
  const params = await searchParams;
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) redirect("/login?next=/teacher");

  const headSections = await listActiveHeadSections(teacherId);
  if (headSections.length === 0) redirect("/teacher");

  const date = params.date || new Date().toISOString().slice(0, 10);
  const sectionId =
    params.sectionId &&
    headSections.some((s) => s.sectionId === params.sectionId)
      ? params.sectionId
      : headSections[0].sectionId;

  const [students, existing] = await Promise.all([
    listActiveStudentsInSection(sectionId),
    getStudentAttendanceForDate(sectionId, date),
  ]);

  const byStudent = new Map(
    existing.map((row) => [row.student_id, row] as const)
  );

  return (
    <div className="space-y-6">
      <StudentAttendanceNav current="/teacher/attendance" />
      <p className="text-sm text-zinc-500">
        Mark daily attendance for students in sections where you are the active
        head teacher.
      </p>

      <form className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="sectionId" className={labelClassName}>
            Section
          </label>
          <select
            id="sectionId"
            name="sectionId"
            defaultValue={sectionId}
            className={fieldClassName}
          >
            {headSections.map((section) => (
              <option key={section.sectionId} value={section.sectionId}>
                {section.className} – {section.sectionName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date" className={labelClassName}>
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={date}
            className={fieldClassName}
          />
        </div>
        <button
          type="submit"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700"
        >
          Load
        </button>
      </form>

      <StudentAttendanceForm
        date={date}
        sectionId={sectionId}
        students={students.map((student) => {
          const current = byStudent.get(student.id);
          return {
            id: student.id,
            name: student.full_name,
            rollNumber: student.roll_number,
            status:
              (current?.status as "present" | "absent" | "leave") ?? "present",
            remarks: current?.remarks ?? "",
          };
        })}
      />
    </div>
  );
}
