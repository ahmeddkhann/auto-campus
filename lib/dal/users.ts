import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function listAdmins(search?: string) {
  const admin = createSupabaseAdmin();
  let query = admin
    .from("profiles")
    .select("id, full_name, email, phone, avatar_url, created_at")
    .eq("role", "admin")
    .order("created_at", { ascending: false });

  if (search?.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`full_name.ilike.${term},email.ilike.${term}`);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
}
