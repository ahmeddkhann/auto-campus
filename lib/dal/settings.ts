import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function getSiteSettings() {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getSchoolName() {
  const settings = await getSiteSettings();
  return settings?.school_name ?? "Auto Campus";
}
