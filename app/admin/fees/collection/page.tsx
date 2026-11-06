import { FeeNav } from "@/components/admin/fee-nav";
import { cardClassName, fieldClassName } from "@/components/ui/field";
import { listClassesWithSections } from "@/lib/dal/classes";
import { listStudentFees } from "@/lib/dal/fees";

import { FeePaymentForm } from "./payment-form";

export const instant = false;

export default async function FeeCollectionPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    month?: string;
    year?: string;
    classId?: string;
  }>;
}) {
  const params = await searchParams;
  const [fees, classes] = await Promise.all([
    listStudentFees({
      status: params.status,
      month: params.month ? Number(params.month) : undefined,
      year: params.year ? Number(params.year) : undefined,
      classId: params.classId,
    }),
    listClassesWithSections(),
  ]);

  return (
    <div className="space-y-6">
      <FeeNav current="/admin/fees/collection" />
      <p className="text-sm text-zinc-500">
        Collect payments against generated student fee records. Partial payments
        are supported.
      </p>

      <form className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-5">
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
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className={fieldClassName}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
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

      <div className="space-y-4">
        {fees.length === 0 ? (
          <div className={cardClassName}>
            <p className="text-sm text-zinc-500">No fee records found.</p>
          </div>
        ) : (
          fees.map((fee) => {
            const student = Array.isArray(fee.students)
              ? fee.students[0]
              : fee.students;
            const structure = Array.isArray(fee.fee_structures)
              ? fee.fee_structures[0]
              : fee.fee_structures;
            const paid = (fee.fee_payments ?? []).reduce(
              (sum: number, p: { amount_paid: number }) =>
                sum + Number(p.amount_paid),
              0
            );
            const remaining = Math.max(Number(fee.net_amount) - paid, 0);

            return (
              <div key={fee.id} className={`${cardClassName} space-y-3`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{student?.full_name}</p>
                    <p className="text-xs text-zinc-500">
                      {structure?.fee_type} · {fee.month}/{fee.year} ·{" "}
                      {fee.status}
                    </p>
                  </div>
                  <div className="text-sm text-right">
                    <p>Net: {Number(fee.net_amount).toFixed(2)}</p>
                    <p className="text-zinc-500">
                      Paid: {paid.toFixed(2)} · Due: {remaining.toFixed(2)}
                    </p>
                  </div>
                </div>
                {remaining > 0 ? (
                  <FeePaymentForm
                    studentFeeId={fee.id}
                    maxAmount={remaining}
                  />
                ) : (
                  <p className="text-sm text-emerald-600">Fully paid</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
