"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import {
  attendanceStatusSchema,
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
