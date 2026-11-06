import Link from "next/link";

import {
  buttonSecondaryClassName,
  cardClassName,
} from "@/components/ui/field";
import {
  headTeacherName,
  listSectionsWithHeadTeachers,
} from "@/lib/dal/head-teachers";

export const instant = false;

export default async function HeadTeachersOverviewPage() {
  const rows = await listSectionsWithHeadTeachers();

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Overview of permanent and active temporary head teachers. Appoint or
        change heads from each section&apos;s Manage page.
      </p>

      <div className={cardClassName}>
        {rows.length === 0 ? (
          <p className="text-sm text-zinc-500">No sections yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Class</th>
                  <th className="px-3 py-2 font-medium">Section</th>
                  <th className="px-3 py-2 font-medium">Permanent head</th>
                  <th className="px-3 py-2 font-medium">Temporary head</th>
                  <th className="px-3 py-2 font-medium">Temp expiry</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-100 dark:border-zinc-900"
                  >
                    <td className="px-3 py-3 font-medium">{row.className}</td>
                    <td className="px-3 py-3">{row.name}</td>
                    <td className="px-3 py-3">
                      {headTeacherName(row.permanent) ?? "—"}
                    </td>
                    <td className="px-3 py-3">
                      {headTeacherName(row.temporary) ?? "—"}
                      {row.temporary?.duration
                        ? ` (${row.temporary.duration})`
                        : ""}
                    </td>
                    <td className="px-3 py-3 text-zinc-500">
                      {row.temporary?.expires_at
                        ? new Date(row.temporary.expires_at).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-3">
                      <Link
                        href={`/admin/classes/sections/${row.id}`}
                        className={buttonSecondaryClassName}
                      >
                        Manage
                      </Link>
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
