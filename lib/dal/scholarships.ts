import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function listScholarships({
  academicYear,
  activeOnly,
}: {
  academicYear?: string;
  activeOnly?: boolean;
} = {}) {
  const admin = createSupabaseAdmin();
  let query = admin
    .from("student_scholarships")
    .select(
      `
      id,
      scholarship_percent,
      reason,
      academic_year,
      is_active,
      created_at,
      students(id, full_name, roll_number)
    `
    )
    .order("created_at", { ascending: false });

  if (academicYear) query = query.eq("academic_year", academicYear);
  if (activeOnly) query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function listStudentsForSelect() {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("students")
    .select("id, full_name, roll_number")
    .eq("status", "active")
    .order("full_name");
  if (error) throw error;
  return data ?? [];
}
