import { deleteMaintenanceCost } from "@/actions/maintenance";
import { cardClassName, fieldClassName } from "@/components/ui/field";
import {
  getMaintenanceMonthlySummary,
  listMaintenanceCosts,
} from "@/lib/dal/maintenance";

import { MaintenanceForm } from "./maintenance-form";

export const instant = false;

export default async function MaintenancePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; category?: string }>;
}) {
  const params = await searchParams;
  const month = params.month ? Number(params.month) : undefined;
  const year = params.year ? Number(params.year) : undefined;
  const [costs, summary] = await Promise.all([
    listMaintenanceCosts({
      month,
      year,
      category: params.category || undefined,
    }),
    getMaintenanceMonthlySummary(year),
  ]);

  const filteredTotal = costs.reduce((sum, row) => sum + Number(row.amount), 0);

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Record facility and operations expenses and review monthly totals.
      </p>

      <MaintenanceForm />

      <form className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-4">
        <input
          name="month"
          type="number"
          min={1}
          max={12}
          placeholder="Month"
          defaultValue={params.month ?? ""}
          className={fieldClassName}
        />
        <input
          name="year"
          type="number"
          placeholder="Year"
          defaultValue={params.year ?? ""}
          className={fieldClassName}
        />
        <input
          name="category"
          placeholder="Category"
          defaultValue={params.category ?? ""}
          className={fieldClassName}
        />
        <button
          type="submit"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700"
        >
          Filter
        </button>
      </form>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className={cardClassName}>
          <h3 className="mb-2 text-base font-semibold">Filtered total</h3>
          <p className="text-2xl font-semibold">{filteredTotal.toFixed(2)}</p>
        </div>
        <div className={cardClassName}>
          <h3 className="mb-3 text-base font-semibold">Monthly summary</h3>
          {summary.length === 0 ? (
            <p className="text-sm text-zinc-500">No expenses yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {summary.slice(0, 12).map((row) => (
                <li
                  key={`${row.year}-${row.month}`}
                  className="flex justify-between border-b border-zinc-100 py-1 dark:border-zinc-900"
                >
                  <span>
                    {row.month}/{row.year}
                  </span>
                  <span className="font-medium">{row.total.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={cardClassName}>
        {costs.length === 0 ? (
          <p className="text-sm text-zinc-500">No maintenance costs found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Title</th>
                  <th className="px-3 py-2 font-medium">Category</th>
                  <th className="px-3 py-2 font-medium">Period</th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {costs.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-100 dark:border-zinc-900"
                  >
                    <td className="px-3 py-3">
                      <div className="font-medium">{row.title}</div>
                      {row.description ? (
                        <div className="text-xs text-zinc-500">
                          {row.description}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-3 py-3">{row.category || "—"}</td>
                    <td className="px-3 py-3">
                      {row.month}/{row.year}
                    </td>
                    <td className="px-3 py-3 font-medium">
                      {Number(row.amount).toFixed(2)}
                    </td>
                    <td className="px-3 py-3">
                      <form action={deleteMaintenanceCost}>
                        <input type="hidden" name="id" value={row.id} />
                        <button
                          type="submit"
                          className="text-sm font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </form>
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
