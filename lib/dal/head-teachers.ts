import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { isActiveTemporaryHead } from "@/lib/dal/sections";

export async function listSectionsWithHeadTeachers() {
  const admin = createSupabaseAdmin();
  const { data: sections, error } = await admin
    .from("sections")
    .select(
      `
      id,
      name,
      class_id,
      classes(id, name, sort_order),
      section_head_teachers(
        id,
        teacher_id,
        type,
        expires_at,
        duration,
        teachers(id, employee_id, profiles(full_name, email))
      )
    `
    )
    .order("name", { ascending: true });

  if (error) throw error;

  return (sections ?? [])
    .map((section) => {
      const classRow = Array.isArray(section.classes)
        ? section.classes[0]
        : section.classes;
      const heads = Array.isArray(section.section_head_teachers)
        ? section.section_head_teachers
        : [];

      const permanent = heads.find((h) => h.type === "permanent") ?? null;
      const temporary =
        heads.find(
          (h) =>
            h.type === "temporary" && isActiveTemporaryHead(h.expires_at)
        ) ?? null;

      return {
        id: section.id,
        name: section.name,
        className: classRow?.name ?? "Class",
        sortOrder: classRow?.sort_order ?? 0,
        permanent,
        temporary,
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export function headTeacherName(head: {
  teachers?:
    | { profiles?: { full_name?: string } | Array<{ full_name?: string }> }
    | Array<{
        profiles?: { full_name?: string } | Array<{ full_name?: string }>;
      }>;
} | null) {
  if (!head) return null;
  const teacher = Array.isArray(head.teachers) ? head.teachers[0] : head.teachers;
  if (!teacher) return null;
  const profile = Array.isArray(teacher.profiles)
    ? teacher.profiles[0]
    : teacher.profiles;
  return profile?.full_name ?? null;
}
