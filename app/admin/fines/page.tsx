import { markFinePaid } from "@/actions/fines";
import {
  buttonSecondaryClassName,
  cardClassName,
  fieldClassName,
} from "@/components/ui/field";
import { listFines } from "@/lib/dal/fines";
import { listStudentsForSelect } from "@/lib/dal/scholarships";

import { ImposeFineForm } from "./impose-form";

export const instant = false;

export default async function FinesPage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string; paid?: string }>;
}) {
  const params = await searchParams;
  const paid =
    params.paid === "paid" || params.paid === "unpaid"
      ? params.paid
      : undefined;
  const [fines, students] = await Promise.all([
    listFines({ studentId: params.studentId, paid }),
    listStudentsForSelect(),
  ]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Impose and track student fines independently of monthly fee records.
      </p>

      <ImposeFineForm
        students={students.map((s) => ({
          id: s.id,
          label: `${s.full_name} (${s.roll_number})`,
        }))}
      />

      <form className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-3">
        <select
          name="studentId"
          defaultValue={params.studentId ?? ""}
          className={fieldClassName}
        >
          <option value="">All students</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.full_name}
            </option>
          ))}
        </select>
        <select
          name="paid"
          defaultValue={params.paid ?? ""}
          className={fieldClassName}
        >
          <option value="">All</option>
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </select>
        <button
          type="submit"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700"
        >
          Filter
        </button>
      </form>

      <div className={cardClassName}>
        {fines.length === 0 ? (
          <p className="text-sm text-zinc-500">No fines found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Student</th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Reason</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((row) => {
                  const student = Array.isArray(row.students)
                    ? row.students[0]
                    : row.students;
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="px-3 py-3">{student?.full_name}</td>
                      <td className="px-3 py-3">
                        {Number(row.amount).toFixed(2)}
                      </td>
                      <td className="px-3 py-3">{row.reason}</td>
                      <td className="px-3 py-3">
                        {row.is_paid ? "Paid" : "Unpaid"}
                      </td>
                      <td className="px-3 py-3">
                        {!row.is_paid ? (
                          <form action={markFinePaid}>
                            <input type="hidden" name="id" value={row.id} />
                            <button
                              type="submit"
                              className={buttonSecondaryClassName}
                            >
                              Mark paid
                            </button>
                          </form>
                        ) : (
                          "—"
                        )}
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
