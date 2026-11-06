import Link from "next/link";

import { cardClassName, fieldClassName } from "@/components/ui/field";
import { listSalaryPayments } from "@/lib/dal/salaries";

export const instant = false;

export default async function SalaryPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; type?: string }>;
}) {
  const params = await searchParams;
  const payments = await listSalaryPayments({
    month: params.month ? Number(params.month) : undefined,
    year: params.year ? Number(params.year) : undefined,
    employeeType: params.type,
  });

  return (
    <div className="space-y-6">
      <Link href="/admin/salaries" className="text-sm font-medium text-blue-600">
        ← Back to salaries
      </Link>

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
        <select
          name="type"
          defaultValue={params.type ?? ""}
          className={fieldClassName}
        >
          <option value="">All types</option>
          <option value="teacher">Teacher</option>
          <option value="support_staff">Support staff</option>
          <option value="principal">Principal</option>
        </select>
        <button
          type="submit"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700"
        >
          Filter
        </button>
      </form>

      <div className={cardClassName}>
        {payments.length === 0 ? (
          <p className="text-sm text-zinc-500">No salary payments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Period</th>
                  <th className="px-3 py-2 font-medium">Base</th>
                  <th className="px-3 py-2 font-medium">Bonus</th>
                  <th className="px-3 py-2 font-medium">Total</th>
                  <th className="px-3 py-2 font-medium">Paid at</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-100 dark:border-zinc-900"
                  >
                    <td className="px-3 py-3 capitalize">
                      {row.employee_type.replace("_", " ")}
                    </td>
                    <td className="px-3 py-3">
                      {row.month}/{row.year}
                    </td>
                    <td className="px-3 py-3">
                      {Number(row.base_salary).toFixed(2)}
                    </td>
                    <td className="px-3 py-3">
                      {Number(row.bonus).toFixed(2)}
                    </td>
                    <td className="px-3 py-3 font-medium">
                      {Number(row.total_amount).toFixed(2)}
                    </td>
                    <td className="px-3 py-3">
                      {row.paid_at
                        ? new Date(row.paid_at).toLocaleDateString()
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
