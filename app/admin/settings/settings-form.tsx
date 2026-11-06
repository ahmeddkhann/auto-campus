"use client";

import { useActionState } from "react";

import { updateSiteSettings } from "@/actions/settings";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

type Defaults = {
  school_name: string;
  tagline: string;
  logo_url: string;
  hero_image_url: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  about_text: string;
  contact_email: string;
  contact_phone: string;
  address: string;
};

export function SiteSettingsForm({ defaults }: { defaults: Defaults }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateSiteSettings,
    null
  );

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <FormAlert error={state?.error} success={state?.success} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="school_name" className={labelClassName}>
            School name
          </label>
          <input
            id="school_name"
            name="school_name"
            required
            defaultValue={defaults.school_name}
            className={fieldClassName}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="tagline" className={labelClassName}>
            Tagline
          </label>
          <input
            id="tagline"
            name="tagline"
            defaultValue={defaults.tagline}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="logo_url" className={labelClassName}>
            Logo URL
          </label>
          <input
            id="logo_url"
            name="logo_url"
            defaultValue={defaults.logo_url}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="hero_image_url" className={labelClassName}>
            Hero image URL
          </label>
          <input
            id="hero_image_url"
            name="hero_image_url"
            defaultValue={defaults.hero_image_url}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="primary_color" className={labelClassName}>
            Primary color
          </label>
          <input
            id="primary_color"
            name="primary_color"
            type="color"
            defaultValue={defaults.primary_color}
            className="h-10 w-full rounded-lg border border-zinc-300 dark:border-zinc-700"
          />
        </div>
        <div>
          <label htmlFor="secondary_color" className={labelClassName}>
            Secondary color
          </label>
          <input
            id="secondary_color"
            name="secondary_color"
            type="color"
            defaultValue={defaults.secondary_color}
            className="h-10 w-full rounded-lg border border-zinc-300 dark:border-zinc-700"
          />
        </div>
        <div>
          <label htmlFor="accent_color" className={labelClassName}>
            Accent color
          </label>
          <input
            id="accent_color"
            name="accent_color"
            type="color"
            defaultValue={defaults.accent_color}
            className="h-10 w-full rounded-lg border border-zinc-300 dark:border-zinc-700"
          />
        </div>
        <div>
          <label htmlFor="contact_email" className={labelClassName}>
            Contact email
          </label>
          <input
            id="contact_email"
            name="contact_email"
            type="email"
            defaultValue={defaults.contact_email}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="contact_phone" className={labelClassName}>
            Contact phone
          </label>
          <input
            id="contact_phone"
            name="contact_phone"
            defaultValue={defaults.contact_phone}
            className={fieldClassName}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="address" className={labelClassName}>
            Address
          </label>
          <input
            id="address"
            name="address"
            defaultValue={defaults.address}
            className={fieldClassName}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="about_text" className={labelClassName}>
            About
          </label>
          <textarea
            id="about_text"
            name="about_text"
            rows={5}
            defaultValue={defaults.about_text}
            className={fieldClassName}
          />
        </div>
      </div>

      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}
