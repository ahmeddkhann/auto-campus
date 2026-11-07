import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function listTestsForTeacher(teacherId: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("tests")
    .select(
      `
      id,
      title,
      total_marks,
      test_date,
      created_at,
      section_id,
      subject_id,
      subjects(id, name, code),
      sections(id, name, classes(id, name))
    `
    )
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getTestForTeacher(testId: string, teacherId: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("tests")
    .select(
      `
      id,
      title,
      total_marks,
      test_date,
      section_id,
      subject_id,
      teacher_id,
      subjects(id, name, code),
      sections(id, name, classes(id, name))
    `
    )
    .eq("id", testId)
    .eq("teacher_id", teacherId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listTestMarks(testId: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("test_marks")
    .select("id, student_id, obtained_marks, remarks")
    .eq("test_id", testId);

  if (error) throw error;
  return data ?? [];
}

export async function countTestMarks(testId: string) {
  const admin = createSupabaseAdmin();
  const { count, error } = await admin
    .from("test_marks")
    .select("*", { count: "exact", head: true })
    .eq("test_id", testId);

  if (error) throw error;
  return count ?? 0;
}
