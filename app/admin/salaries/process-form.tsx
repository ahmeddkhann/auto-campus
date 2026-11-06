"use client";

import { useActionState } from "react";

import { processMonthlySalaries } from "@/actions/salaries";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export function ProcessSalariesForm({
  employees,
}: {
  employees: Array<{ key: string; label: string; base: number }>;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    processMonthlySalaries,
    null
  );
  const now = new Date();

  if (employees.length === 0) return null;

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <h3 className="text-base font-semibold">Process monthly payments</h3>
      <FormAlert error={state?.error} success={state?.success} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="month" className={labelClassName}>
            Month
          </label>
          <input
            id="month"
            name="month"
            type="number"
            min={1}
            max={12}
            required
            defaultValue={now.getMonth() + 1}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="year" className={labelClassName}>
            Year
          </label>
          <input
            id="year"
            name="year"
            type="number"
            required
            defaultValue={now.getFullYear()}
            className={fieldClassName}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="px-3 py-2 font-medium">Employee</th>
              <th className="px-3 py-2 font-medium">Base</th>
              <th className="px-3 py-2 font-medium">Bonus</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.key}
                className="border-b border-zinc-100 dark:border-zinc-900"
              >
                <td className="px-3 py-3">
                  <input
                    type="hidden"
                    name="employee_key"
                    value={employee.key}
                  />
                  <input
                    type="hidden"
                    name={`base_${employee.key}`}
                    value={employee.base}
                  />
                  {employee.label}
                </td>
                <td className="px-3 py-3">{employee.base.toFixed(2)}</td>
                <td className="px-3 py-3">
                  <input
                    name={`bonus_${employee.key}`}
                    type="number"
                    min={0}
                    step="0.01"
                    defaultValue={0}
                    className={fieldClassName}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending ? "Processing..." : "Record payments"}
      </button>
    </form>
  );
}
