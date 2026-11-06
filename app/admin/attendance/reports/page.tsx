import { AttendanceNav } from "@/components/admin/attendance-nav";
import { cardClassName, fieldClassName } from "@/components/ui/field";
import { getTeacherAttendanceReport } from "@/lib/dal/attendance";

export const instant = false;

export default async function AttendanceReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const report = await getTeacherAttendanceReport({
    from: params.from,
    to: params.to,
  });

  return (
    <div className="space-y-6">
      <AttendanceNav current="/admin/attendance/reports" />
      <p className="text-sm text-zinc-500">
        Summary of present / absent / leave counts per teacher.
      </p>

      <form className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-3">
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
        {report.length === 0 ? (
          <p className="text-sm text-zinc-500">No attendance data in range.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Teacher</th>
                  <th className="px-3 py-2 font-medium">Present</th>
                  <th className="px-3 py-2 font-medium">Absent</th>
                  <th className="px-3 py-2 font-medium">Leave</th>
                </tr>
              </thead>
              <tbody>
                {report.map((row) => (
                  <tr
                    key={row.teacherId}
                    className="border-b border-zinc-100 dark:border-zinc-900"
                  >
                    <td className="px-3 py-3 font-medium">
                      {row.name}
                      {row.employeeId ? (
                        <span className="ml-2 text-xs text-zinc-500">
                          {row.employeeId}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-3">{row.present}</td>
                    <td className="px-3 py-3">{row.absent}</td>
                    <td className="px-3 py-3">{row.leave}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
