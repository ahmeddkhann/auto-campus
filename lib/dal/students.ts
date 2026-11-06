import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function listStudents({
  search,
  classId,
  subjectId,
}: {
  search?: string;
  classId?: string;
  subjectId?: string;
} = {}) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("students")
    .select(
      `
      id,
      full_name,
      email,
      roll_number,
      phone,
      status,
      section_id,
      created_at,
      sections(id, name, class_id, classes(id, name)),
      student_subjects(subject_id, subjects(id, name, code))
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  let students = data ?? [];

  if (search?.trim()) {
    const term = search.trim().toLowerCase();
    students = students.filter(
      (student) =>
        student.full_name?.toLowerCase().includes(term) ||
        student.email?.toLowerCase().includes(term) ||
        student.roll_number?.toLowerCase().includes(term)
    );
  }

  if (classId) {
    students = students.filter((student) => {
      const section = Array.isArray(student.sections)
        ? student.sections[0]
        : student.sections;
      return section?.class_id === classId;
    });
  }

  if (subjectId) {
    students = students.filter((student) =>
      (student.student_subjects ?? []).some(
        (row) => row.subject_id === subjectId
      )
    );
  }

  return students;
}

export async function getStudentById(id: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("students")
    .select(
      `
      *,
      student_subjects(subject_id)
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
