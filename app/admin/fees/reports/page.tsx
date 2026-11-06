import { FeeNav } from "@/components/admin/fee-nav";
import { cardClassName, fieldClassName } from "@/components/ui/field";
import { getFeeReport } from "@/lib/dal/fees";

export const instant = false;

export default async function FeeReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const report = await getFeeReport({
    month: params.month ? Number(params.month) : undefined,
    year: params.year ? Number(params.year) : undefined,
  });

  return (
    <div className="space-y-6">
      <FeeNav current="/admin/fees/reports" />
      <p className="text-sm text-zinc-500">
        Collected vs outstanding fees for the selected period.
      </p>

      <form className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-3">
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
        <button
          type="submit"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700"
        >
          Filter
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={cardClassName}>
          <p className="text-sm text-zinc-500">Records</p>
          <p className="mt-2 text-2xl font-semibold">{report.count}</p>
        </div>
        <div className={cardClassName}>
          <p className="text-sm text-zinc-500">Collected</p>
          <p className="mt-2 text-2xl font-semibold">
            {report.collected.toFixed(2)}
          </p>
        </div>
        <div className={cardClassName}>
          <p className="text-sm text-zinc-500">Outstanding</p>
          <p className="mt-2 text-2xl font-semibold">
            {report.outstanding.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
