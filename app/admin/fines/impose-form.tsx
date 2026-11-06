"use client";

import { useActionState } from "react";

import { imposeFine } from "@/actions/fines";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export function ImposeFineForm({
  students,
}: {
  students: Array<{ id: string; label: string }>;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    imposeFine,
    null
  );

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <h3 className="text-base font-semibold">Impose fine</h3>
      <FormAlert error={state?.error} success={state?.success} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="student_id" className={labelClassName}>
            Student
          </label>
          <select
            id="student_id"
            name="student_id"
            required
            defaultValue=""
            className={fieldClassName}
          >
            <option value="" disabled>
              Select student
            </option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="amount" className={labelClassName}>
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min={0.01}
            step="0.01"
            required
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="reason" className={labelClassName}>
            Reason
          </label>
          <input
            id="reason"
            name="reason"
            required
            className={fieldClassName}
          />
        </div>
      </div>
      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending ? "Saving..." : "Impose fine"}
      </button>
    </form>
  );
}
