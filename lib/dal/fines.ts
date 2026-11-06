import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function listFines({
  studentId,
  paid,
}: {
  studentId?: string;
  paid?: "paid" | "unpaid";
} = {}) {
  const admin = createSupabaseAdmin();
  let query = admin
    .from("student_fines")
    .select(
      `
      id,
      amount,
      reason,
      is_paid,
      paid_at,
      created_at,
      students(id, full_name, roll_number)
    `
    )
    .order("created_at", { ascending: false });

  if (studentId) query = query.eq("student_id", studentId);
  if (paid === "paid") query = query.eq("is_paid", true);
  if (paid === "unpaid") query = query.eq("is_paid", false);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
