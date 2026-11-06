"use client";

import { useActionState } from "react";

import { createTeacher, updateTeacher } from "@/actions/teachers";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

type Defaults = {
  id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  employee_id?: string;
  qualification?: string;
  salary?: number;
};

export function TeacherForm({
  mode,
  defaults,
}: {
  mode: "create" | "edit";
  defaults?: Defaults;
}) {
  const action = mode === "create" ? createTeacher : updateTeacher;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    null
  );

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <FormAlert error={state?.error} success={state?.success} />
      {defaults?.id ? <input type="hidden" name="id" value={defaults.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="full_name" className={labelClassName}>
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            required
            defaultValue={defaults?.full_name ?? ""}
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
            required={mode === "create"}
            disabled={mode === "edit"}
            defaultValue={defaults?.email ?? ""}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="password" className={labelClassName}>
            {mode === "create" ? "Password" : "New password (optional)"}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required={mode === "create"}
            minLength={6}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClassName}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={defaults?.phone ?? ""}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="employee_id" className={labelClassName}>
            Employee ID
          </label>
          <input
            id="employee_id"
            name="employee_id"
            required
            defaultValue={defaults?.employee_id ?? ""}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="qualification" className={labelClassName}>
            Qualification
          </label>
          <input
            id="qualification"
            name="qualification"
            defaultValue={defaults?.qualification ?? ""}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="salary" className={labelClassName}>
            Salary
          </label>
          <input
            id="salary"
            name="salary"
            type="number"
            min={0}
            step="0.01"
            defaultValue={defaults?.salary ?? 0}
            className={fieldClassName}
          />
        </div>
      </div>

      <p className="text-sm text-zinc-500">
        Assign this teacher to sections and subjects from Classes → section
        management.
      </p>

      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending
          ? mode === "create"
            ? "Creating..."
            : "Saving..."
          : mode === "create"
            ? "Create teacher"
            : "Save teacher"}
      </button>
    </form>
  );
}
