import Link from "next/link";

import {
  buttonSecondaryClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import {
  getTeacherAttendanceForDate,
  listTeachersForAttendance,
} from "@/lib/dal/attendance";

import { BulkAttendanceForm } from "./bulk-form";

export const instant = false;

export default async function TeacherAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const date = params.date || new Date().toISOString().slice(0, 10);
  const [teachers, existing] = await Promise.all([
    listTeachersForAttendance(),
    getTeacherAttendanceForDate(date),
  ]);

  const byTeacher = new Map(
    existing.map((row) => [row.teacher_id, row] as const)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          Mark daily attendance for all teachers. Existing marks for the
          selected date are loaded automatically.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/attendance/teachers/history"
            className={buttonSecondaryClassName}
          >
            History
          </Link>
          <Link
            href="/admin/attendance/reports"
            className={buttonSecondaryClassName}
          >
            Reports
          </Link>
        </div>
      </div>

      <form className="flex flex-wrap items-end gap-3">
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

      <BulkAttendanceForm
        date={date}
        teachers={teachers.map((teacher) => {
          const profile = Array.isArray(teacher.profiles)
            ? teacher.profiles[0]
            : teacher.profiles;
          const current = byTeacher.get(teacher.id);
          return {
            id: teacher.id,
            name: profile?.full_name ?? "Teacher",
            employeeId: teacher.employee_id ?? "",
            status:
              (current?.status as "present" | "absent" | "leave") ?? "present",
            remarks: current?.remarks ?? "",
          };
        })}
      />
    </div>
  );
}
