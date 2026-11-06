"use client";

import { useActionState } from "react";

import { createSubject } from "@/actions/subjects";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export function SubjectForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createSubject,
    null
  );

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <h2 className="text-base font-semibold">Add subject</h2>
      <FormAlert error={state?.error} success={state?.success} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClassName}>
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="Mathematics"
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="code" className={labelClassName}>
            Code
          </label>
          <input
            id="code"
            name="code"
            required
            placeholder="MATH"
            className={fieldClassName}
          />
        </div>
      </div>
      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending ? "Adding..." : "Add subject"}
      </button>
    </form>
  );
}
