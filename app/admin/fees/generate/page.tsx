"use client";

import { useActionState } from "react";

import { generateStudentFees } from "@/actions/fees";
import { FeeNav } from "@/components/admin/fee-nav";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export default function GenerateFeesPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    generateStudentFees,
    null
  );

  const now = new Date();

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <FeeNav current="/admin/fees/generate" />
      <p className="text-sm text-zinc-500">
        Create monthly fee records for active students. Tuition applies to all;
        transport applies when the student has uses_transport enabled.
        Active scholarships discount tuition only.
      </p>
      <form action={formAction} className={`${cardClassName} space-y-4`}>
        <FormAlert error={state?.error} success={state?.success} />
        <div>
          <label htmlFor="academic_year" className={labelClassName}>
            Academic year
          </label>
          <input
            id="academic_year"
            name="academic_year"
            required
            placeholder="2026-27"
            className={fieldClassName}
          />
        </div>
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
        <div>
          <label htmlFor="due_date" className={labelClassName}>
            Due date
          </label>
          <input
            id="due_date"
            name="due_date"
            type="date"
            required
            className={fieldClassName}
          />
        </div>
        <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
          {pending ? "Generating..." : "Generate fees"}
        </button>
      </form>
    </div>
  );
}
