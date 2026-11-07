import { redirect } from "next/navigation";

import { cardClassName } from "@/components/ui/field";
import { getTeacherIdForAuth } from "@/lib/dal/auth";
import { listOwnSalaryPayments } from "@/lib/dal/salaries";
import { getTeacherContext } from "@/lib/dal/teacher-panel";

export const instant = false;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default async function TeacherSalaryPage() {
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) redirect("/login?next=/teacher");

  const [context, payments] = await Promise.all([
    getTeacherContext(teacherId),
    listOwnSalaryPayments(teacherId),
  ]);

  if (!context) redirect("/teacher");

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Your base salary and payment history. This page is read-only.
      </p>

      <div className={cardClassName}>
        <p className="text-sm text-zinc-500">Monthly base salary</p>
        <p className="mt-1 text-3xl font-semibold">
          {Number(context.salary ?? 0).toLocaleString()}
        </p>
        {context.employee_id ? (
          <p className="mt-2 text-sm text-zinc-500">
            Employee ID: {context.employee_id}
          </p>
        ) : null}
      </div>

      <div className={cardClassName}>
        <h3 className="mb-3 font-semibold">Payment history</h3>
        {payments.length === 0 ? (
          <p className="text-sm text-zinc-500">No salary payments recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Period</th>
                  <th className="px-3 py-2 font-medium">Base</th>
                  <th className="px-3 py-2 font-medium">Bonus</th>
                  <th className="px-3 py-2 font-medium">Total</th>
                  <th className="px-3 py-2 font-medium">Paid at</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-zinc-100 dark:border-zinc-900"
                  >
                    <td className="px-3 py-2">
                      {MONTH_NAMES[payment.month - 1] ?? payment.month}{" "}
                      {payment.year}
                    </td>
                    <td className="px-3 py-2">
                      {Number(payment.base_salary).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      {Number(payment.bonus).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 font-medium">
                      {Number(payment.total_amount).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-zinc-500">
                      {payment.paid_at
                        ? new Date(payment.paid_at).toLocaleDateString()
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
