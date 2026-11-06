"use client";

import { useActionState } from "react";

import { submitAdmission } from "@/actions/admissions";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export function PublicAdmissionForm({
  classes,
}: {
  classes: Array<{ id: string; label: string }>;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    submitAdmission,
    null
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <FormAlert error={state?.error} success={state?.success} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="student_name" className={labelClassName}>
            Student name
          </label>
          <input
            id="student_name"
            name="student_name"
            required
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClassName}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClassName}>
            Phone
          </label>
          <input id="phone" name="phone" className={fieldClassName} />
        </div>
        <div>
          <label htmlFor="father_name" className={labelClassName}>
            Father name
          </label>
          <input id="father_name" name="father_name" className={fieldClassName} />
        </div>
        <div>
          <label htmlFor="mother_name" className={labelClassName}>
            Mother name
          </label>
          <input id="mother_name" name="mother_name" className={fieldClassName} />
        </div>
        <div>
          <label htmlFor="date_of_birth" className={labelClassName}>
            Date of birth
          </label>
          <input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="gender" className={labelClassName}>
            Gender
          </label>
          <select id="gender" name="gender" className={fieldClassName}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="class_id" className={labelClassName}>
            Applying for class
          </label>
          <select
            id="class_id"
            name="class_id"
            required
            className={fieldClassName}
          >
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="previous_school" className={labelClassName}>
            Previous school
          </label>
          <input
            id="previous_school"
            name="previous_school"
            className={fieldClassName}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="address" className={labelClassName}>
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            className={fieldClassName}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending || classes.length === 0}
        className={buttonPrimaryClassName}
      >
        {pending ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
