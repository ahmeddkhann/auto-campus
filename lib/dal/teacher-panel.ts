import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isActiveTemporaryHead } from "@/lib/dal/sections";

export async function getTeacherContext(teacherId: string) {
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
      profiles(id, full_name, email, phone, avatar_url)
    `
    )
    .eq("id", teacherId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listAssignedSections(teacherId: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("teacher_sections")
    .select(
      `
      section_id,
      sections(
        id,
        name,
        class_id,
        classes(id, name, sort_order)
      )
    `
    )
    .eq("teacher_id", teacherId);

  if (error) throw error;

  return (data ?? [])
    .map((row) => {
      const section = Array.isArray(row.sections) ? row.sections[0] : row.sections;
      if (!section) return null;
      const classRow = Array.isArray(section.classes)
        ? section.classes[0]
        : section.classes;
      return {
        sectionId: section.id as string,
        sectionName: section.name as string,
        classId: section.class_id as string,
        className: (classRow?.name as string) ?? "Class",
        sortOrder: (classRow?.sort_order as number) ?? 0,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort(
      (a, b) =>
        a.sortOrder - b.sortOrder ||
        a.sectionName.localeCompare(b.sectionName)
    );
}

export async function listAssignedSubjects(
  teacherId: string,
  sectionId?: string
) {
  const admin = createSupabaseAdmin();
  let query = admin
    .from("teacher_subjects")
    .select(
      `
      subject_id,
      section_id,
      subjects(id, name, code),
      sections(id, name, class_id, classes(id, name))
    `
    )
    .eq("teacher_id", teacherId);

  if (sectionId) query = query.eq("section_id", sectionId);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row) => {
    const subject = Array.isArray(row.subjects) ? row.subjects[0] : row.subjects;
    const section = Array.isArray(row.sections) ? row.sections[0] : row.sections;
    const classRow = section
      ? Array.isArray(section.classes)
        ? section.classes[0]
        : section.classes
      : null;
    return {
      subjectId: row.subject_id as string,
      sectionId: row.section_id as string,
      subjectName: (subject?.name as string) ?? "Subject",
      subjectCode: (subject?.code as string) ?? "",
      sectionName: (section?.name as string) ?? "",
      className: (classRow?.name as string) ?? "",
    };
  });
}

export async function listActiveStudentsInSection(sectionId: string) {
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
      sections(id, name, class_id, classes(id, name))
    `
    )
    .eq("section_id", sectionId)
    .eq("status", "active")
    .order("full_name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function listStudentsInAssignedSections(
  teacherId: string,
  {
    sectionId,
    search,
  }: {
    sectionId?: string;
    search?: string;
  } = {}
) {
  const sections = await listAssignedSections(teacherId);
  const sectionIds = sections.map((s) => s.sectionId);
  if (sectionIds.length === 0) return [];

  const scopedIds = sectionId
    ? sectionIds.includes(sectionId)
      ? [sectionId]
      : []
    : sectionIds;
  if (scopedIds.length === 0) return [];

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
      sections(id, name, class_id, classes(id, name))
    `
    )
    .in("section_id", scopedIds)
    .eq("status", "active")
    .order("full_name", { ascending: true });

  if (error) throw error;

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

  return students;
}

/**
 * Sections where this teacher is the currently active head
 * (temporary takes precedence over permanent).
 */
export async function listActiveHeadSections(teacherId: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("section_head_teachers")
    .select(
      `
      id,
      section_id,
      teacher_id,
      type,
      expires_at,
      duration,
      sections(id, name, class_id, classes(id, name, sort_order))
    `
    )
    .eq("teacher_id", teacherId);

  if (error) throw error;

  const candidates = data ?? [];
  if (candidates.length === 0) return [];

  const sectionIds = [...new Set(candidates.map((row) => row.section_id))];

  const { data: allHeads, error: headsError } = await admin
    .from("section_head_teachers")
    .select("section_id, teacher_id, type, expires_at")
    .in("section_id", sectionIds);

  if (headsError) throw headsError;

  const active: Array<{
    sectionId: string;
    sectionName: string;
    className: string;
    type: "permanent" | "temporary";
    expiresAt: string | null;
    duration: string | null;
  }> = [];

  for (const row of candidates) {
    const sectionHeads = (allHeads ?? []).filter(
      (h) => h.section_id === row.section_id
    );
    const activeTemp = sectionHeads.find(
      (h) =>
        h.type === "temporary" && isActiveTemporaryHead(h.expires_at)
    );

    const isActive =
      row.type === "temporary"
        ? isActiveTemporaryHead(row.expires_at)
        : !activeTemp && row.type === "permanent";

    if (!isActive) continue;

    const section = Array.isArray(row.sections) ? row.sections[0] : row.sections;
    const classRow = section
      ? Array.isArray(section.classes)
        ? section.classes[0]
        : section.classes
      : null;

    active.push({
      sectionId: row.section_id as string,
      sectionName: (section?.name as string) ?? "Section",
      className: (classRow?.name as string) ?? "Class",
      type: row.type as "permanent" | "temporary",
      expiresAt: row.expires_at,
      duration: row.duration,
    });
  }

  return active;
}

export async function isActiveHeadOfSection(
  teacherId: string,
  sectionId: string
) {
  const heads = await listActiveHeadSections(teacherId);
  return heads.some((h) => h.sectionId === sectionId);
}

export async function assertTeacherAssignedToSection(
  teacherId: string,
  sectionId: string
) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("teacher_sections")
    .select("id")
    .eq("teacher_id", teacherId)
    .eq("section_id", sectionId)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    const err = new Error("You are not assigned to this section.");
    err.name = "ForbiddenError";
    throw err;
  }
}

export async function assertTeacherTeachesSubject(
  teacherId: string,
  sectionId: string,
  subjectId: string
) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("teacher_subjects")
    .select("id")
    .eq("teacher_id", teacherId)
    .eq("section_id", sectionId)
    .eq("subject_id", subjectId)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    const err = new Error("You do not teach this subject in that section.");
    err.name = "ForbiddenError";
    throw err;
  }
}

export async function listUpcomingTestsForTeacher(
  teacherId: string,
  limit = 5
) {
  const admin = createSupabaseAdmin();
  const today = new Date().toISOString().slice(0, 10);
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
      subjects(name, code),
      sections(name, classes(name))
    `
    )
    .eq("teacher_id", teacherId)
    .gte("test_date", today)
    .order("test_date", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
