"use client";

import { useActionState } from "react";

import { updateAdminProfile } from "@/actions/profile";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export function ProfileForm({
  defaults,
}: {
  defaults: {
    full_name: string;
    email: string;
    phone: string;
    avatar_url: string;
  };
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateAdminProfile,
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
          defaultValue={defaults.full_name}
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClassName}>
          Email
        </label>
        <input
          id="email"
          value={defaults.email}
          disabled
          className={`${fieldClassName} opacity-70`}
        />
      </div>

      <div>
        <label htmlFor="phone" className={labelClassName}>
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          defaultValue={defaults.phone}
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
          defaultValue={defaults.avatar_url}
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClassName}>
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          className={fieldClassName}
        />
      </div>

      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
