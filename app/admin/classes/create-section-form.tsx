"use client";

import { useActionState } from "react";

import { createSection } from "@/actions/classes";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export function CreateSectionForm({
  classes,
}: {
  classes: Array<{ id: string; name: string }>;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createSection,
    null
  );

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <h2 className="text-base font-semibold">Add section</h2>
      <FormAlert error={state?.error} success={state?.success} />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label htmlFor="class_id" className={labelClassName}>
            Class
          </label>
          <select
            id="class_id"
            name="class_id"
            required
            className={fieldClassName}
            defaultValue=""
          >
            <option value="" disabled>
              Select class
            </option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="name" className={labelClassName}>
            Section name
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="A"
            className={fieldClassName}
          />
        </div>
      </div>
      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending ? "Adding..." : "Add section"}
      </button>
    </form>
  );
}
