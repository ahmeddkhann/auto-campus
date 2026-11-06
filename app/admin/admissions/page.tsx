import Link from "next/link";

import { cardClassName, fieldClassName } from "@/components/ui/field";
import {
  listAdmissions,
  listClassesForAdmission,
} from "@/lib/dal/admissions";

export const instant = false;

export default async function AdmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; classId?: string }>;
}) {
  const params = await searchParams;
  const [admissions, classes] = await Promise.all([
    listAdmissions({
      status: params.status || undefined,
      classId: params.classId || undefined,
    }),
    listClassesForAdmission(),
  ]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Review online admission applications. Approve into a section or reject
        with a reason.
      </p>

      <form className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-3">
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className={fieldClassName}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          name="classId"
          defaultValue={params.classId ?? ""}
          className={fieldClassName}
        >
          <option value="">All classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700"
        >
          Filter
        </button>
      </form>

      <div className={cardClassName}>
        {admissions.length === 0 ? (
          <p className="text-sm text-zinc-500">No applications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Student</th>
                  <th className="px-3 py-2 font-medium">Class</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Submitted</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admissions.map((row) => {
                  const classRow = Array.isArray(row.classes)
                    ? row.classes[0]
                    : row.classes;
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="px-3 py-3">
                        <div className="font-medium">{row.student_name}</div>
                        <div className="text-xs text-zinc-500">
                          {row.email || "—"}
                        </div>
                      </td>
                      <td className="px-3 py-3">{classRow?.name ?? "—"}</td>
                      <td className="px-3 py-3 capitalize">{row.status}</td>
                      <td className="px-3 py-3">
                        {new Date(row.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3">
                        <Link
                          href={`/admin/admissions/${row.id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Review
                        </Link>
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
