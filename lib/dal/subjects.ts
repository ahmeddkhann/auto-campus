import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function listSubjects() {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("subjects")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}
