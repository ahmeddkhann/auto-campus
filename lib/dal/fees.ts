import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function listFeeStructures(academicYear?: string) {
  const admin = createSupabaseAdmin();
  let query = admin
    .from("fee_structures")
    .select("*, classes(id, name, sort_order)")
    .order("academic_year", { ascending: false });

  if (academicYear) query = query.eq("academic_year", academicYear);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function listStudentFees({
  status,
  month,
  year,
  classId,
}: {
  status?: string;
  month?: number;
  year?: number;
  classId?: string;
} = {}) {
  const admin = createSupabaseAdmin();
  let query = admin
    .from("student_fees")
    .select(
      `
      *,
      students(
        id,
        full_name,
        roll_number,
        section_id,
        sections(id, name, class_id, classes(id, name))
      ),
      fee_structures(id, fee_type, amount, academic_year),
      fee_payments(id, amount_paid)
    `
    )
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (month) query = query.eq("month", month);
  if (year) query = query.eq("year", year);

  const { data, error } = await query;
  if (error) throw error;

  let rows = data ?? [];
  if (classId) {
    rows = rows.filter((row) => {
      const student = Array.isArray(row.students) ? row.students[0] : row.students;
      const section = student
        ? Array.isArray(student.sections)
          ? student.sections[0]
          : student.sections
        : null;
      return section?.class_id === classId;
    });
  }
  return rows;
}

export async function getFeeReport({
  month,
  year,
}: {
  month?: number;
  year?: number;
} = {}) {
  const fees = await listStudentFees({ month, year });
  let gross = 0;
  let collected = 0;
  let outstanding = 0;

  for (const fee of fees) {
    const net = Number(fee.net_amount);
    const paid = (fee.fee_payments ?? []).reduce(
      (sum: number, p: { amount_paid: number }) => sum + Number(p.amount_paid),
      0
    );
    gross += net;
    collected += paid;
    outstanding += Math.max(net - paid, 0);
  }

  return { count: fees.length, gross, collected, outstanding, fees };
}
