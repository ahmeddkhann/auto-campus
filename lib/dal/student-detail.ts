import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function getStudentDetail(id: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("students")
    .select(
      `
      *,
      sections(id, name, class_id, classes(id, name)),
      student_subjects(subject_id, subjects(id, name, code))
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getStudentTestMarks(studentId: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("test_marks")
    .select(
      `
      id,
      obtained_marks,
      remarks,
      created_at,
      tests(
        id,
        title,
        total_marks,
        test_date,
        subjects(id, name, code)
      )
    `
    )
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getStudentExamMarks(studentId: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("exam_marks")
    .select(
      `
      id,
      total_marks,
      obtained_marks,
      created_at,
      subjects(id, name, code),
      exams(id, title, academic_year)
    `
    )
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
