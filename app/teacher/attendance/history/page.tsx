import { redirect } from "next/navigation";

import { StudentAttendanceNav } from "@/components/teacher/student-attendance-nav";
import {
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import { listStudentAttendanceHistory } from "@/lib/dal/attendance";
import { getTeacherIdForAuth } from "@/lib/dal/auth";
import {
  listActiveHeadSections,
  listActiveStudentsInSection,
} from "@/lib/dal/teacher-panel";

export const instant = false;

export default async function TeacherStudentAttendanceHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    sectionId?: string;
    studentId?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const params = await searchParams;
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) redirect("/login?next=/teacher");

  const headSections = await listActiveHeadSections(teacherId);
  if (headSections.length === 0) redirect("/teacher");

  const sectionId =
    params.sectionId &&
    headSections.some((s) => s.sectionId === params.sectionId)
      ? params.sectionId
      : headSections[0].sectionId;

  const [students, rows] = await Promise.all([
    listActiveStudentsInSection(sectionId),
    listStudentAttendanceHistory({
      sectionId,
      studentId: params.studentId || undefined,
      from: params.from || undefined,
      to: params.to || undefined,
    }),
  ]);

  return (
    <div className="space-y-6">
      <StudentAttendanceNav current="/teacher/attendance/history" />
      <p className="text-sm text-zinc-500">
        Attendance history for sections you actively head.
      </p>

      <form className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-2 lg:grid-cols-5">
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
          <label htmlFor="studentId" className={labelClassName}>
            Student
          </label>
          <select
            id="studentId"
            name="studentId"
            defaultValue={params.studentId ?? ""}
            className={fieldClassName}
          >
            <option value="">All students</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.full_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="from" className={labelClassName}>
            From
          </label>
          <input
            id="from"
            name="from"
            type="date"
            defaultValue={params.from ?? ""}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="to" className={labelClassName}>
            To
          </label>
          <input
            id="to"
            name="to"
            type="date"
            defaultValue={params.to ?? ""}
            className={fieldClassName}
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700"
          >
            Filter
          </button>
        </div>
      </form>

      <div className={cardClassName}>
        {rows.length === 0 ? (
          <p className="text-sm text-zinc-500">No attendance records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Student</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const student = Array.isArray(row.students)
                    ? row.students[0]
                    : row.students;
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="px-3 py-2">{row.date}</td>
                      <td className="px-3 py-2">
                        {student?.full_name ?? "—"}
                        {student?.roll_number ? (
                          <span className="ml-2 text-xs text-zinc-500">
                            {student.roll_number}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-2 capitalize">{row.status}</td>
                      <td className="px-3 py-2 text-zinc-500">
                        {row.remarks ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
