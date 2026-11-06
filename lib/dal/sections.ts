import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function getSectionById(sectionId: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("sections")
    .select("id, name, class_id, classes(id, name, sort_order)")
    .eq("id", sectionId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listSectionSubjects(sectionId: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("section_subjects")
    .select("id, subject_id, subjects(id, name, code)")
    .eq("section_id", sectionId);

  if (error) throw error;
  return data ?? [];
}

export async function listSectionTeachers(sectionId: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("teacher_sections")
    .select(
      `
      teacher_id,
      teachers(
        id,
        employee_id,
        profiles(full_name, email),
        teacher_subjects(subject_id, section_id, subjects(id, name, code))
      )
    `
    )
    .eq("section_id", sectionId);

  if (error) throw error;
  return data ?? [];
}

export async function listSectionHeadTeachers(sectionId: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("section_head_teachers")
    .select(
      `
      id,
      teacher_id,
      type,
      expires_at,
      duration,
      created_at,
      teachers(id, employee_id, profiles(full_name, email))
    `
    )
    .eq("section_id", sectionId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getSectionSubjectIds(sectionId: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("section_subjects")
    .select("subject_id")
    .eq("section_id", sectionId);

  if (error) throw error;
  return (data ?? []).map((row) => row.subject_id as string);
}

/**
 * Replace a student's subject enrollments with the subjects offered by their section.
 */
export async function syncStudentSubjectsFromSection(
  studentId: string,
  sectionId: string
) {
  const admin = createSupabaseAdmin();
  const subjectIds = await getSectionSubjectIds(sectionId);

  await admin.from("student_subjects").delete().eq("student_id", studentId);

  if (subjectIds.length) {
    const { error } = await admin.from("student_subjects").insert(
      subjectIds.map((subject_id) => ({
        student_id: studentId,
        subject_id,
      }))
    );
    if (error) throw error;
  }
}

/**
 * Re-sync every student in a section after section subjects change.
 */
export async function syncAllStudentsInSection(sectionId: string) {
  const admin = createSupabaseAdmin();
  const { data: students, error } = await admin
    .from("students")
    .select("id")
    .eq("section_id", sectionId);

  if (error) throw error;

  for (const student of students ?? []) {
    await syncStudentSubjectsFromSection(student.id, sectionId);
  }
}

export function isActiveTemporaryHead(expiresAt: string | null) {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() > Date.now();
}
