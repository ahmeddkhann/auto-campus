import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function listSupportStaff(search?: string) {
  const admin = createSupabaseAdmin();
  let query = admin
    .from("support_staff")
    .select("*")
    .order("created_at", { ascending: false });

  if (search?.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(
      `full_name.ilike.${term},designation.ilike.${term},phone.ilike.${term}`
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getSupportStaffById(id: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("support_staff")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getPrincipal() {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("principal")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}
