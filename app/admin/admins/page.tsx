import { cardClassName } from "@/components/ui/field";
import { PageActions } from "@/components/ui/page-actions";
import { listAdmins } from "@/lib/dal/users";

export const instant = false;

export default async function AdminAdminsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const admins = await listAdmins(params.q);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          View other administrators. You can create new admins; editing or
          deleting other admins is not allowed.
        </p>
        <PageActions href="/admin/admins/new" label="Add admin" />
      </div>

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Search by name or email"
          className="w-full max-w-md rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
        />
        <button
          type="submit"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700"
        >
          Search
        </button>
      </form>

      <div className={cardClassName}>
        {admins.length === 0 ? (
          <p className="text-sm text-zinc-500">No admins found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Phone</th>
                  <th className="px-3 py-2 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-b border-zinc-100 dark:border-zinc-900"
                  >
                    <td className="px-3 py-3 font-medium">{admin.full_name}</td>
                    <td className="px-3 py-3">{admin.email}</td>
                    <td className="px-3 py-3">{admin.phone || "—"}</td>
                    <td className="px-3 py-3">
                      {admin.created_at
                        ? new Date(admin.created_at).toLocaleDateString()
                        : "—"}
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
