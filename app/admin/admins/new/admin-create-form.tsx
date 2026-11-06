"use client";

import { useActionState } from "react";

import { createAdmin } from "@/actions/admins";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export function AdminCreateForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createAdmin,
    null
  );

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <FormAlert error={state?.error} success={state?.success} />

      <div>
        <label htmlFor="full_name" className={labelClassName}>
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
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
        <label htmlFor="password" className={labelClassName}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="phone" className={labelClassName}>
          Phone
        </label>
        <input id="phone" name="phone" className={fieldClassName} />
      </div>

      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending ? "Creating..." : "Create admin"}
      </button>
    </form>
  );
}
