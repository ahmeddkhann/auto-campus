import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function listExamsForTeacher(teacherId: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("exams")
    .select(
      `
      id,
      title,
      academic_year,
      created_at,
      section_id,
      sections(id, name, classes(id, name))
    `
    )
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getExamForTeacher(examId: string, teacherId: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("exams")
    .select(
      `
      id,
      title,
      academic_year,
      section_id,
      teacher_id,
      sections(id, name, classes(id, name))
    `
    )
    .eq("id", examId)
    .eq("teacher_id", teacherId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listExamMarks(examId: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("exam_marks")
    .select("id, student_id, subject_id, total_marks, obtained_marks")
    .eq("exam_id", examId);

  if (error) throw error;
  return data ?? [];
}

export async function countExamMarks(examId: string) {
  const admin = createSupabaseAdmin();
  const { count, error } = await admin
    .from("exam_marks")
    .select("*", { count: "exact", head: true })
    .eq("exam_id", examId);

  if (error) throw error;
  return count ?? 0;
}
