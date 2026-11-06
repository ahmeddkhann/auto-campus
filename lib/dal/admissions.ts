import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function listAdmissions({
  status,
  classId,
}: {
  status?: string;
  classId?: string;
} = {}) {
  const admin = createSupabaseAdmin();
  let query = admin
    .from("admissions")
    .select("*, classes(id, name)")
    .order("submitted_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (classId) query = query.eq("class_id", classId);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getAdmission(id: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("admissions")
    .select("*, classes(id, name)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listClassesForAdmission() {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("classes")
    .select("id, name, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
