import { redirect } from "next/navigation";

import {
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import { listTeacherAttendanceHistory } from "@/lib/dal/attendance";
import { getTeacherIdForAuth } from "@/lib/dal/auth";

export const instant = false;

export default async function TeacherOwnAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) redirect("/login?next=/teacher");

  const rows = await listTeacherAttendanceHistory({
    teacherId,
    from: params.from || undefined,
    to: params.to || undefined,
  });

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Your attendance records as marked by the admin. This view is read-only.
      </p>

      <form className="flex flex-wrap items-end gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
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
        <button
          type="submit"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700"
        >
          Filter
        </button>
      </form>

      <div className={cardClassName}>
        {rows.length === 0 ? (
          <p className="text-sm text-zinc-500">No attendance records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-100 dark:border-zinc-900"
                  >
                    <td className="px-3 py-2">{row.date}</td>
                    <td className="px-3 py-2 capitalize">{row.status}</td>
                    <td className="px-3 py-2 text-zinc-500">
                      {row.remarks ?? "—"}
                    </td>
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
