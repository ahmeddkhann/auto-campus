"use server";

import { revalidatePath } from "next/cache";

import {
  getTeacherIdForAuth,
  requireAdmin,
  requireTeacher,
} from "@/lib/dal/auth";
import { isActiveHeadOfSection } from "@/lib/dal/teacher-panel";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import {
  attendanceStatusSchema,
  bulkStudentAttendanceSchema,
  bulkTeacherAttendanceSchema,
} from "@/validations/attendance";

export async function saveTeacherAttendance(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();
  const date = String(formData.get("date") ?? "");
  const teacherIds = formData.getAll("teacher_id").map(String);

  const entries = teacherIds.map((teacher_id) => ({
    teacher_id,
    status: String(formData.get(`status_${teacher_id}`) ?? "present"),
    remarks: String(formData.get(`remarks_${teacher_id}`) ?? ""),
  }));

  const parsed = bulkTeacherAttendanceSchema.safeParse({ date, entries });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid attendance data.",
    };
  }

  // Validate statuses individually for clearer errors
  for (const entry of parsed.data.entries) {
    const status = attendanceStatusSchema.safeParse(entry.status);
    if (!status.success) {
      return { error: "Each teacher needs a valid attendance status." };
    }
  }

  const admin = createSupabaseAdmin();

  for (const entry of parsed.data.entries) {
    const { data: existing } = await admin
      .from("teacher_attendance")
      .select("id")
      .eq("teacher_id", entry.teacher_id)
      .eq("date", parsed.data.date)
      .maybeSingle();

    if (existing) {
      const { error } = await admin
        .from("teacher_attendance")
        .update({
          status: entry.status,
          remarks: entry.remarks || null,
          marked_by: session.sub,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      if (error) return { error: error.message };
    } else {
      const { error } = await admin.from("teacher_attendance").insert({
        teacher_id: entry.teacher_id,
        date: parsed.data.date,
        status: entry.status,
        remarks: entry.remarks || null,
        marked_by: session.sub,
      });
      if (error) return { error: error.message };
    }
  }

  revalidatePath("/admin/attendance/teachers");
  revalidatePath("/admin/attendance/teachers/history");
  revalidatePath("/admin/attendance/reports");
  return { success: "Attendance saved." };
}

export async function saveStudentAttendance(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireTeacher();
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) return { error: "Teacher profile not found." };

  const date = String(formData.get("date") ?? "");
  const sectionId = String(formData.get("section_id") ?? "");
  const studentIds = formData.getAll("student_id").map(String);

  const entries = studentIds.map((student_id) => ({
    student_id,
    status: String(formData.get(`status_${student_id}`) ?? "present"),
    remarks: String(formData.get(`remarks_${student_id}`) ?? ""),
  }));

  const parsed = bulkStudentAttendanceSchema.safeParse({
    date,
    section_id: sectionId,
    entries,
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid attendance data.",
    };
  }

  const isHead = await isActiveHeadOfSection(
    teacherId,
    parsed.data.section_id
  );
  if (!isHead) {
    return {
      error: "Only the active head teacher can mark attendance for this section.",
    };
  }

  for (const entry of parsed.data.entries) {
    const status = attendanceStatusSchema.safeParse(entry.status);
    if (!status.success) {
      return { error: "Each student needs a valid attendance status." };
    }
  }

  const admin = createSupabaseAdmin();

  // Ensure students belong to this section
  const { data: sectionStudents, error: studentsError } = await admin
    .from("students")
    .select("id")
    .eq("section_id", parsed.data.section_id)
    .in(
      "id",
      parsed.data.entries.map((e) => e.student_id)
    );

  if (studentsError) return { error: studentsError.message };
  const allowed = new Set((sectionStudents ?? []).map((s) => s.id));
  if (allowed.size !== parsed.data.entries.length) {
    return { error: "One or more students are not in this section." };
  }

  for (const entry of parsed.data.entries) {
    const { data: existing } = await admin
      .from("student_attendance")
      .select("id")
      .eq("student_id", entry.student_id)
      .eq("date", parsed.data.date)
      .maybeSingle();

    if (existing) {
      const { error } = await admin
        .from("student_attendance")
        .update({
          status: entry.status,
          remarks: entry.remarks || null,
          section_id: parsed.data.section_id,
          marked_by: teacherId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      if (error) return { error: error.message };
    } else {
      const { error } = await admin.from("student_attendance").insert({
        student_id: entry.student_id,
        section_id: parsed.data.section_id,
        date: parsed.data.date,
        status: entry.status,
        remarks: entry.remarks || null,
        marked_by: teacherId,
      });
      if (error) return { error: error.message };
    }
  }

  revalidatePath("/teacher/attendance");
  revalidatePath("/teacher/attendance/history");
  return { success: "Student attendance saved." };
}
