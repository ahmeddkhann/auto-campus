import { AttendanceNav } from "@/components/admin/attendance-nav";
import { cardClassName, fieldClassName } from "@/components/ui/field";
import {
  listTeacherAttendanceHistory,
  listTeachersForAttendance,
} from "@/lib/dal/attendance";

export const instant = false;

export default async function TeacherAttendanceHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ teacherId?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const [rows, teachers] = await Promise.all([
    listTeacherAttendanceHistory({
      teacherId: params.teacherId,
      from: params.from,
      to: params.to,
    }),
    listTeachersForAttendance(),
  ]);

  return (
    <div className="space-y-6">
      <AttendanceNav current="/admin/attendance/teachers/history" />
      <p className="text-sm text-zinc-500">
        Browse teacher attendance history by teacher and date range.
      </p>

      <form className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-4">
        <select
          name="teacherId"
          defaultValue={params.teacherId ?? ""}
          className={fieldClassName}
        >
          <option value="">All teachers</option>
          {teachers.map((teacher) => {
            const profile = Array.isArray(teacher.profiles)
              ? teacher.profiles[0]
              : teacher.profiles;
            return (
              <option key={teacher.id} value={teacher.id}>
                {profile?.full_name}
              </option>
            );
          })}
        </select>
        <input
          type="date"
          name="from"
          defaultValue={params.from ?? ""}
          className={fieldClassName}
        />
        <input
          type="date"
          name="to"
          defaultValue={params.to ?? ""}
          className={fieldClassName}
        />
        <button
          type="submit"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700"
        >
          Filter
        </button>
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
                  <th className="px-3 py-2 font-medium">Teacher</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const teacher = Array.isArray(row.teachers)
                    ? row.teachers[0]
                    : row.teachers;
                  const profile = teacher
                    ? Array.isArray(teacher.profiles)
                      ? teacher.profiles[0]
                      : teacher.profiles
                    : null;
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="px-3 py-3">
                        {new Date(row.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3">{profile?.full_name ?? "—"}</td>
                      <td className="px-3 py-3 capitalize">{row.status}</td>
                      <td className="px-3 py-3">{row.remarks || "—"}</td>
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
