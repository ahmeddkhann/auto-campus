"use client";

import { useActionState } from "react";

import { upsertPrincipal } from "@/actions/staff";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export function PrincipalForm({
  defaults,
}: {
  defaults?: {
    full_name?: string;
    phone?: string;
    email?: string;
    qualification?: string;
    salary?: number;
    avatar_url?: string;
  };
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    upsertPrincipal,
    null
  );

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <FormAlert error={state?.error} success={state?.success} />
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
            defaultValue={defaults?.email ?? ""}
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
        <div>
          <label htmlFor="avatar_url" className={labelClassName}>
            Avatar URL
          </label>
          <input
            id="avatar_url"
            name="avatar_url"
            defaultValue={defaults?.avatar_url ?? ""}
            className={fieldClassName}
          />
        </div>
      </div>
      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending ? "Saving..." : "Save principal"}
      </button>
    </form>
  );
}
