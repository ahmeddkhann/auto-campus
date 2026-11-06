import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function listTeachers({
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
    .from("teachers")
    .select(
      `
      id,
      employee_id,
      qualification,
      salary,
      created_at,
      profiles!inner(id, full_name, email, phone),
      teacher_sections(section_id, sections(id, name, class_id, classes(id, name))),
      teacher_subjects(subject_id, section_id, subjects(id, name, code))
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  let teachers = data ?? [];

  if (search?.trim()) {
    const term = search.trim().toLowerCase();
    teachers = teachers.filter((teacher) => {
      const profile = Array.isArray(teacher.profiles)
        ? teacher.profiles[0]
        : teacher.profiles;
      return (
        profile?.full_name?.toLowerCase().includes(term) ||
        profile?.email?.toLowerCase().includes(term) ||
        teacher.employee_id?.toLowerCase().includes(term)
      );
    });
  }

  if (classId) {
    teachers = teachers.filter((teacher) =>
      (teacher.teacher_sections ?? []).some((assignment) => {
        const section = Array.isArray(assignment.sections)
          ? assignment.sections[0]
          : assignment.sections;
        return section?.class_id === classId;
      })
    );
  }

  if (subjectId) {
    teachers = teachers.filter((teacher) =>
      (teacher.teacher_subjects ?? []).some(
        (assignment) => assignment.subject_id === subjectId
      )
    );
  }

  return teachers;
}

export async function getTeacherById(id: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("teachers")
    .select(
      `
      id,
      employee_id,
      qualification,
      salary,
      profile_id,
      profiles!inner(id, full_name, email, phone),
      teacher_sections(section_id),
      teacher_subjects(subject_id, section_id)
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
