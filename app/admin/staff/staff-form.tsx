"use client";

import { useActionState } from "react";

import { createSupportStaff, updateSupportStaff } from "@/actions/staff";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export function SupportStaffForm({
  mode,
  defaults,
}: {
  mode: "create" | "edit";
  defaults?: {
    id?: string;
    full_name?: string;
    phone?: string;
    designation?: string;
    salary?: number;
  };
}) {
  const action = mode === "create" ? createSupportStaff : updateSupportStaff;
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
          <label htmlFor="designation" className={labelClassName}>
            Designation
          </label>
          <input
            id="designation"
            name="designation"
            defaultValue={defaults?.designation ?? ""}
            className={fieldClassName}
            placeholder="Peon, Guard, Cleaner…"
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
      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending ? "Saving..." : mode === "create" ? "Add staff" : "Save"}
      </button>
    </form>
  );
}
