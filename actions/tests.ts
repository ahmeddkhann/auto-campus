"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getTeacherIdForAuth,
  requireTeacher,
} from "@/lib/dal/auth";
import {
  assertTeacherAssignedToSection,
  assertTeacherTeachesSubject,
} from "@/lib/dal/teacher-panel";
import { getTestForTeacher } from "@/lib/dal/tests";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import {
  bulkTestMarksSchema,
  createTestSchema,
  updateTestSchema,
} from "@/validations/test";

export async function createTest(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireTeacher();
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) return { error: "Teacher profile not found." };

  const parsed = createTestSchema.safeParse({
    title: formData.get("title"),
    section_id: formData.get("section_id"),
    subject_id: formData.get("subject_id"),
    total_marks: formData.get("total_marks"),
    test_date: formData.get("test_date") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid test data." };
  }

  try {
    await assertTeacherAssignedToSection(teacherId, parsed.data.section_id);
    await assertTeacherTeachesSubject(
      teacherId,
      parsed.data.section_id,
      parsed.data.subject_id
    );
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Not allowed for this assignment.",
    };
  }

  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("tests")
    .insert({
      title: parsed.data.title,
      section_id: parsed.data.section_id,
      subject_id: parsed.data.subject_id,
      teacher_id: teacherId,
      total_marks: parsed.data.total_marks,
      test_date: parsed.data.test_date,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/teacher/tests");
  revalidatePath("/teacher");
  redirect(`/teacher/tests/${data.id}`);
}

export async function updateTest(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireTeacher();
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) return { error: "Teacher profile not found." };

  const testId = String(formData.get("test_id") ?? "");
  const existing = await getTestForTeacher(testId, teacherId);
  if (!existing) return { error: "Test not found." };

  const parsed = updateTestSchema.safeParse({
    title: formData.get("title"),
    total_marks: formData.get("total_marks"),
    test_date: formData.get("test_date") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid test data." };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("tests")
    .update({
      title: parsed.data.title,
      total_marks: parsed.data.total_marks,
      test_date: parsed.data.test_date,
    })
    .eq("id", testId)
    .eq("teacher_id", teacherId);

  if (error) return { error: error.message };

  revalidatePath("/teacher/tests");
  revalidatePath(`/teacher/tests/${testId}`);
  return { success: "Test updated." };
}

export async function saveTestMarks(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireTeacher();
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) return { error: "Teacher profile not found." };

  const testId = String(formData.get("test_id") ?? "");
  const test = await getTestForTeacher(testId, teacherId);
  if (!test) return { error: "Test not found." };

  const studentIds = formData.getAll("student_id").map(String);
  const entries = studentIds.map((student_id) => ({
    student_id,
    obtained_marks: formData.get(`obtained_${student_id}`),
    remarks: String(formData.get(`remarks_${student_id}`) ?? ""),
  }));

  const parsed = bulkTestMarksSchema.safeParse({ test_id: testId, entries });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid marks data." };
  }

  const total = Number(test.total_marks);
  for (const entry of parsed.data.entries) {
    if (entry.obtained_marks > total) {
      return {
        error: `Obtained marks cannot exceed total marks (${total}).`,
      };
    }
  }

  const admin = createSupabaseAdmin();
  for (const entry of parsed.data.entries) {
    const { data: existing } = await admin
      .from("test_marks")
      .select("id")
      .eq("test_id", testId)
      .eq("student_id", entry.student_id)
      .maybeSingle();

    if (existing) {
      const { error } = await admin
        .from("test_marks")
        .update({
          obtained_marks: entry.obtained_marks,
          remarks: entry.remarks || null,
        })
        .eq("id", existing.id);
      if (error) return { error: error.message };
    } else {
      const { error } = await admin.from("test_marks").insert({
        test_id: testId,
        student_id: entry.student_id,
        obtained_marks: entry.obtained_marks,
        remarks: entry.remarks || null,
      });
      if (error) return { error: error.message };
    }
  }

  revalidatePath(`/teacher/tests/${testId}`);
  revalidatePath("/teacher/tests");
  return { success: "Marks saved." };
}
