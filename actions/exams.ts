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
import { getExamForTeacher } from "@/lib/dal/exams";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import { bulkExamMarksSchema, createExamSchema } from "@/validations/exam";

export async function createExam(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireTeacher();
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) return { error: "Teacher profile not found." };

  const parsed = createExamSchema.safeParse({
    title: formData.get("title"),
    section_id: formData.get("section_id"),
    academic_year: formData.get("academic_year") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid exam data." };
  }

  try {
    await assertTeacherAssignedToSection(teacherId, parsed.data.section_id);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Not assigned to this section.",
    };
  }

  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("exams")
    .insert({
      title: parsed.data.title,
      section_id: parsed.data.section_id,
      teacher_id: teacherId,
      academic_year: parsed.data.academic_year,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/teacher/exams");
  revalidatePath("/teacher");
  redirect(`/teacher/exams/${data.id}`);
}

export async function saveExamMarks(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireTeacher();
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) return { error: "Teacher profile not found." };

  const examId = String(formData.get("exam_id") ?? "");
  const exam = await getExamForTeacher(examId, teacherId);
  if (!exam) return { error: "Exam not found." };

  const keys = formData.getAll("entry_key").map(String);
  const entries = keys.map((key) => {
    const [student_id, subject_id] = key.split("::");
    return {
      student_id,
      subject_id,
      total_marks: formData.get(`total_${key}`),
      obtained_marks: formData.get(`obtained_${key}`),
    };
  });

  const parsed = bulkExamMarksSchema.safeParse({ exam_id: examId, entries });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid marks data." };
  }

  for (const entry of parsed.data.entries) {
    if (entry.obtained_marks > entry.total_marks) {
      return { error: "Obtained marks cannot exceed total marks for any row." };
    }
    try {
      await assertTeacherTeachesSubject(
        teacherId,
        exam.section_id,
        entry.subject_id
      );
    } catch (err) {
      return {
        error:
          err instanceof Error
            ? err.message
            : "You cannot enter marks for that subject.",
      };
    }
  }

  const admin = createSupabaseAdmin();
  for (const entry of parsed.data.entries) {
    const { data: existing } = await admin
      .from("exam_marks")
      .select("id")
      .eq("exam_id", examId)
      .eq("student_id", entry.student_id)
      .eq("subject_id", entry.subject_id)
      .maybeSingle();

    if (existing) {
      const { error } = await admin
        .from("exam_marks")
        .update({
          total_marks: entry.total_marks,
          obtained_marks: entry.obtained_marks,
        })
        .eq("id", existing.id);
      if (error) return { error: error.message };
    } else {
      const { error } = await admin.from("exam_marks").insert({
        exam_id: examId,
        student_id: entry.student_id,
        subject_id: entry.subject_id,
        total_marks: entry.total_marks,
        obtained_marks: entry.obtained_marks,
      });
      if (error) return { error: error.message };
    }
  }

  revalidatePath(`/teacher/exams/${examId}`);
  revalidatePath("/teacher/exams");
  return { success: "Exam marks saved." };
}
