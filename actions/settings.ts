"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import { siteSettingsSchema } from "@/validations/settings";

export async function updateSiteSettings(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = siteSettingsSchema.safeParse({
    school_name: formData.get("school_name"),
    tagline: formData.get("tagline") || "",
    logo_url: formData.get("logo_url") || "",
    hero_image_url: formData.get("hero_image_url") || "",
    primary_color: formData.get("primary_color"),
    secondary_color: formData.get("secondary_color"),
    accent_color: formData.get("accent_color"),
    about_text: formData.get("about_text") || "",
    contact_email: formData.get("contact_email") || "",
    contact_phone: formData.get("contact_phone") || "",
    address: formData.get("address") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid settings." };
  }

  const admin = createSupabaseAdmin();
  const { data: existing, error: fetchError } = await admin
    .from("site_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    return { error: fetchError.message };
  }

  const payload = {
    ...parsed.data,
    tagline: parsed.data.tagline || null,
    logo_url: parsed.data.logo_url || null,
    hero_image_url: parsed.data.hero_image_url || null,
    about_text: parsed.data.about_text || null,
    contact_email: parsed.data.contact_email || null,
    contact_phone: parsed.data.contact_phone || null,
    address: parsed.data.address || null,
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { error } = await admin
      .from("site_settings")
      .update(payload)
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await admin.from("site_settings").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/settings");
  return { success: "Site settings saved." };
}
