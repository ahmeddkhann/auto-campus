"use client";

import { useActionState } from "react";

import { grantScholarship } from "@/actions/scholarships";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export function GrantScholarshipForm({
  students,
}: {
  students: Array<{ id: string; label: string }>;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    grantScholarship,
    null
  );

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <h3 className="text-base font-semibold">Grant scholarship</h3>
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
          <label htmlFor="scholarship_percent" className={labelClassName}>
            Percent (1–100)
          </label>
          <input
            id="scholarship_percent"
            name="scholarship_percent"
            type="number"
            min={1}
            max={100}
            required
            className={fieldClassName}
          />
        </div>
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
        <div className="sm:col-span-2">
          <label htmlFor="reason" className={labelClassName}>
            Reason
          </label>
          <input id="reason" name="reason" className={fieldClassName} />
        </div>
      </div>
      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending ? "Granting..." : "Grant scholarship"}
      </button>
    </form>
  );
}
