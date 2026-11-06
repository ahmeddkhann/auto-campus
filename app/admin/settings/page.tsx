import { getSiteSettings } from "@/lib/dal/settings";

import { SiteSettingsForm } from "./settings-form";

export const instant = false;

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <p className="text-sm text-zinc-500">
        Update school branding and contact details shown across the platform.
      </p>
      <SiteSettingsForm
        defaults={{
          school_name: settings?.school_name ?? "Auto Campus",
          tagline: settings?.tagline ?? "",
          logo_url: settings?.logo_url ?? "",
          hero_image_url: settings?.hero_image_url ?? "",
          primary_color: settings?.primary_color ?? "#1a56db",
          secondary_color: settings?.secondary_color ?? "#7e3af2",
          accent_color: settings?.accent_color ?? "#0e9f6e",
          about_text: settings?.about_text ?? "",
          contact_email: settings?.contact_email ?? "",
          contact_phone: settings?.contact_phone ?? "",
          address: settings?.address ?? "",
        }}
      />
    </div>
  );
}
