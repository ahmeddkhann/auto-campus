import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function listClassesWithSections() {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("classes")
    .select("id, name, sort_order, sections(id, name, created_at)")
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function listSections() {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("sections")
    .select("id, name, class_id, classes(id, name, sort_order)")
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}
