import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function listTeachersForAttendance() {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("teachers")
    .select("id, employee_id, profiles(full_name, email)")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getTeacherAttendanceForDate(date: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("teacher_attendance")
    .select("id, teacher_id, status, remarks")
    .eq("date", date);

  if (error) throw error;
  return data ?? [];
}

export async function listTeacherAttendanceHistory({
  teacherId,
  from,
  to,
}: {
  teacherId?: string;
  from?: string;
  to?: string;
}) {
  const admin = createSupabaseAdmin();
  let query = admin
    .from("teacher_attendance")
    .select(
      `
      id,
      date,
      status,
      remarks,
      teachers(id, employee_id, profiles(full_name, email))
    `
    )
    .order("date", { ascending: false });

  if (teacherId) query = query.eq("teacher_id", teacherId);
  if (from) query = query.gte("date", from);
  if (to) query = query.lte("date", to);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getTeacherAttendanceReport({
  from,
  to,
}: {
  from?: string;
  to?: string;
} = {}) {
  const admin = createSupabaseAdmin();
  let query = admin
    .from("teacher_attendance")
    .select("teacher_id, status, teachers(id, employee_id, profiles(full_name))");

  if (from) query = query.gte("date", from);
  if (to) query = query.lte("date", to);

  const { data, error } = await query;
  if (error) throw error;

  const map = new Map<
    string,
    {
      teacherId: string;
      name: string;
      employeeId: string | null;
      present: number;
      absent: number;
      leave: number;
    }
  >();

  for (const row of data ?? []) {
    const teacher = Array.isArray(row.teachers) ? row.teachers[0] : row.teachers;
    const profile = teacher
      ? Array.isArray(teacher.profiles)
        ? teacher.profiles[0]
        : teacher.profiles
      : null;
    const key = row.teacher_id;
    if (!map.has(key)) {
      map.set(key, {
        teacherId: key,
        name: profile?.full_name ?? "Teacher",
        employeeId: teacher?.employee_id ?? null,
        present: 0,
        absent: 0,
        leave: 0,
      });
    }
    const entry = map.get(key)!;
    if (row.status === "present") entry.present += 1;
    if (row.status === "absent") entry.absent += 1;
    if (row.status === "leave") entry.leave += 1;
  }

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getStudentAttendanceForDate(
  sectionId: string,
  date: string
) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("student_attendance")
    .select("id, student_id, status, remarks")
    .eq("section_id", sectionId)
    .eq("date", date);

  if (error) throw error;
  return data ?? [];
}

export async function listStudentAttendanceHistory({
  sectionId,
  studentId,
  from,
  to,
}: {
  sectionId: string;
  studentId?: string;
  from?: string;
  to?: string;
}) {
  const admin = createSupabaseAdmin();
  let query = admin
    .from("student_attendance")
    .select(
      `
      id,
      date,
      status,
      remarks,
      student_id,
      students(id, full_name, roll_number)
    `
    )
    .eq("section_id", sectionId)
    .order("date", { ascending: false });

  if (studentId) query = query.eq("student_id", studentId);
  if (from) query = query.gte("date", from);
  if (to) query = query.lte("date", to);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
