import Link from "next/link";

import { deleteSupportStaff } from "@/actions/staff";
import {
  buttonSecondaryClassName,
  cardClassName,
  fieldClassName,
} from "@/components/ui/field";
import { PageActions } from "@/components/ui/page-actions";
import { listSupportStaff } from "@/lib/dal/staff";

export const instant = false;

export default async function SupportStaffPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const staff = await listSupportStaff(params.q);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          Non-login support staff records used for salary tracking.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/staff/principal"
            className={buttonSecondaryClassName}
          >
            Principal
          </Link>
          <PageActions href="/admin/staff/new" label="Add staff" />
        </div>
      </div>

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Search name, phone, designation"
          className={`max-w-md ${fieldClassName}`}
        />
        <button
          type="submit"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700"
        >
          Search
        </button>
      </form>

      <div className={cardClassName}>
        {staff.length === 0 ? (
          <p className="text-sm text-zinc-500">No support staff yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Designation</th>
                  <th className="px-3 py-2 font-medium">Phone</th>
                  <th className="px-3 py-2 font-medium">Salary</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-100 dark:border-zinc-900"
                  >
                    <td className="px-3 py-3 font-medium">{row.full_name}</td>
                    <td className="px-3 py-3">{row.designation || "—"}</td>
                    <td className="px-3 py-3">{row.phone || "—"}</td>
                    <td className="px-3 py-3">{Number(row.salary).toFixed(2)}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/staff/${row.id}`}
                          className={buttonSecondaryClassName}
                        >
                          Edit
                        </Link>
                        <form action={deleteSupportStaff}>
                          <input type="hidden" name="id" value={row.id} />
                          <button
                            type="submit"
                            className={`${buttonSecondaryClassName} text-red-600`}
                          >
                            Delete
                          </button>
                        </form>
                      </div>
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
