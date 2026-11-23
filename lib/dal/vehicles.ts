import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function listVehicles({
  activeOnly = false,
}: {
  activeOnly?: boolean;
} = {}) {
  const admin = createSupabaseAdmin();
  let query = admin
    .from("vehicles")
    .select("*")
    .order("name", { ascending: true });

  if (activeOnly) query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getVehicle(id: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}
