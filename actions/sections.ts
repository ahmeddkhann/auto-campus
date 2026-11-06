"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal/auth";
import { syncAllStudentsInSection } from "@/lib/dal/sections";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import { expiresAtForDuration } from "@/lib/utils/head-teacher";
import {
  appointPermanentHeadSchema,
  appointTemporaryHeadSchema,
  assignTeacherToSectionSchema,
  removeHeadSchema,
  removeTeacherFromSectionSchema,
  sectionSubjectsSchema,
} from "@/validations/section";

function revalidateSection(sectionId: string) {
  revalidatePath(`/admin/classes/sections/${sectionId}`);
  revalidatePath("/admin/classes");
  revalidatePath("/admin/teachers");
  revalidatePath("/admin/students");
}

export async function updateSectionSubjects(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = sectionSubjectsSchema.safeParse({
    section_id: formData.get("section_id"),
    subject_ids: formData.getAll("subject_ids").map(String).filter(Boolean),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid subjects." };
  }

  const admin = createSupabaseAdmin();
  await admin
    .from("section_subjects")
    .delete()
    .eq("section_id", parsed.data.section_id);

  if (parsed.data.subject_ids.length) {
    const { error } = await admin.from("section_subjects").insert(
      parsed.data.subject_ids.map((subject_id) => ({
        section_id: parsed.data.section_id,
        subject_id,
      }))
    );
    if (error) return { error: error.message };
  }

  // Drop teacher_subject rows for subjects no longer offered in this section.
  const { data: teacherSubjects } = await admin
    .from("teacher_subjects")
    .select("id, subject_id")
    .eq("section_id", parsed.data.section_id);

  const allowed = new Set(parsed.data.subject_ids);
  const staleIds = (teacherSubjects ?? [])
    .filter((row) => !allowed.has(row.subject_id))
    .map((row) => row.id);

  if (staleIds.length) {
    await admin.from("teacher_subjects").delete().in("id", staleIds);
  }

  try {
    await syncAllStudentsInSection(parsed.data.section_id);
  } catch (error) {
    console.error(error);
    return {
      error:
        "Subjects saved, but student enrollments could not be fully refreshed.",
    };
  }

  revalidateSection(parsed.data.section_id);
  return { success: "Section subjects updated. Students were re-enrolled." };
}

export async function assignTeacherToSection(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = assignTeacherToSectionSchema.safeParse({
    section_id: formData.get("section_id"),
    teacher_id: formData.get("teacher_id"),
    subject_ids: formData.getAll("subject_ids").map(String).filter(Boolean),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid assignment." };
  }

  const admin = createSupabaseAdmin();

  const { data: existing } = await admin
    .from("teacher_sections")
    .select("id")
    .eq("section_id", parsed.data.section_id)
    .eq("teacher_id", parsed.data.teacher_id)
    .maybeSingle();

  if (!existing) {
    const { error } = await admin.from("teacher_sections").insert({
      section_id: parsed.data.section_id,
      teacher_id: parsed.data.teacher_id,
    });
    if (error) return { error: error.message };
  }

  await admin
    .from("teacher_subjects")
    .delete()
    .eq("section_id", parsed.data.section_id)
    .eq("teacher_id", parsed.data.teacher_id);

  if (parsed.data.subject_ids.length) {
    const { error } = await admin.from("teacher_subjects").insert(
      parsed.data.subject_ids.map((subject_id) => ({
        teacher_id: parsed.data.teacher_id,
        section_id: parsed.data.section_id,
        subject_id,
      }))
    );
    if (error) return { error: error.message };
  }

  revalidateSection(parsed.data.section_id);
  return { success: "Teacher assigned to section." };
}

export async function removeTeacherFromSection(
  formData: FormData
): Promise<void> {
  await requireAdmin();

  const parsed = removeTeacherFromSectionSchema.safeParse({
    section_id: formData.get("section_id"),
    teacher_id: formData.get("teacher_id"),
  });

  if (!parsed.success) return;

  const admin = createSupabaseAdmin();

  // Also remove head-teacher roles for this section if this teacher holds them.
  await admin
    .from("section_head_teachers")
    .delete()
    .eq("section_id", parsed.data.section_id)
    .eq("teacher_id", parsed.data.teacher_id);

  await admin
    .from("teacher_subjects")
    .delete()
    .eq("section_id", parsed.data.section_id)
    .eq("teacher_id", parsed.data.teacher_id);

  await admin
    .from("teacher_sections")
    .delete()
    .eq("section_id", parsed.data.section_id)
    .eq("teacher_id", parsed.data.teacher_id);

  revalidateSection(parsed.data.section_id);
}

async function teacherIsActiveHeadElsewhere(
  teacherId: string,
  excludeSectionId?: string
) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("section_head_teachers")
    .select("id, section_id, type, expires_at")
    .eq("teacher_id", teacherId);

  if (error) throw error;

  const now = Date.now();
  return (data ?? []).some((row) => {
    if (excludeSectionId && row.section_id === excludeSectionId) return false;
    if (row.type === "permanent") return true;
    if (row.type === "temporary" && row.expires_at) {
      return new Date(row.expires_at).getTime() > now;
    }
    return false;
  });
}

export async function appointPermanentHeadTeacher(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = appointPermanentHeadSchema.safeParse({
    section_id: formData.get("section_id"),
    teacher_id: formData.get("teacher_id"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid appointment." };
  }

  const admin = createSupabaseAdmin();

  // Teacher must belong to this section.
  const { data: membership } = await admin
    .from("teacher_sections")
    .select("id")
    .eq("section_id", parsed.data.section_id)
    .eq("teacher_id", parsed.data.teacher_id)
    .maybeSingle();

  if (!membership) {
    return {
      error: "Assign the teacher to this section before making them head teacher.",
    };
  }

  if (await teacherIsActiveHeadElsewhere(parsed.data.teacher_id, parsed.data.section_id)) {
    return {
      error: "This teacher is already a head teacher of another section.",
    };
  }

  // Replace existing permanent head for this section.
  await admin
    .from("section_head_teachers")
    .delete()
    .eq("section_id", parsed.data.section_id)
    .eq("type", "permanent");

  const { error } = await admin.from("section_head_teachers").insert({
    section_id: parsed.data.section_id,
    teacher_id: parsed.data.teacher_id,
    type: "permanent",
    expires_at: null,
    duration: null,
    appointed_by: session.sub,
  });

  if (error) return { error: error.message };

  revalidateSection(parsed.data.section_id);
  return { success: "Permanent head teacher appointed." };
}

export async function appointTemporaryHeadTeacher(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = appointTemporaryHeadSchema.safeParse({
    section_id: formData.get("section_id"),
    teacher_id: formData.get("teacher_id"),
    duration: formData.get("duration"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid appointment." };
  }

  const admin = createSupabaseAdmin();

  const { data: membership } = await admin
    .from("teacher_sections")
    .select("id")
    .eq("section_id", parsed.data.section_id)
    .eq("teacher_id", parsed.data.teacher_id)
    .maybeSingle();

  if (!membership) {
    return {
      error: "Assign the teacher to this section before making them temporary head.",
    };
  }

  if (await teacherIsActiveHeadElsewhere(parsed.data.teacher_id)) {
    return {
      error:
        "Temporary head must not already be a head teacher of any section.",
    };
  }

  // Replace current temporary head for this section.
  await admin
    .from("section_head_teachers")
    .delete()
    .eq("section_id", parsed.data.section_id)
    .eq("type", "temporary");

  const { error } = await admin.from("section_head_teachers").insert({
    section_id: parsed.data.section_id,
    teacher_id: parsed.data.teacher_id,
    type: "temporary",
    duration: parsed.data.duration,
    expires_at: expiresAtForDuration(parsed.data.duration),
    appointed_by: session.sub,
  });

  if (error) return { error: error.message };

  revalidateSection(parsed.data.section_id);
  return { success: "Temporary head teacher appointed." };
}

export async function removeHeadTeacher(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = removeHeadSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) return;

  const admin = createSupabaseAdmin();
  const { data } = await admin
    .from("section_head_teachers")
    .select("section_id")
    .eq("id", parsed.data.id)
    .maybeSingle();

  await admin.from("section_head_teachers").delete().eq("id", parsed.data.id);

  if (data?.section_id) {
    revalidateSection(data.section_id);
  }
}
