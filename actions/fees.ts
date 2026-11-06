"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import {
  feePaymentSchema,
  feeStructureSchema,
  feeStructureUpdateSchema,
  generateFeesSchema,
} from "@/validations/fee";

export async function createFeeStructure(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = feeStructureSchema.safeParse({
    class_id: formData.get("class_id"),
    fee_type: formData.get("fee_type"),
    amount: formData.get("amount"),
    academic_year: formData.get("academic_year"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid structure." };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin.from("fee_structures").insert(parsed.data);
  if (error) {
    if (error.message.toLowerCase().includes("duplicate")) {
      return { error: "A structure for that class/type/year already exists." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/fees/structures");
  return { success: "Fee structure created." };
}

export async function updateFeeStructure(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = feeStructureUpdateSchema.safeParse({
    id: formData.get("id"),
    class_id: formData.get("class_id"),
    fee_type: formData.get("fee_type"),
    amount: formData.get("amount"),
    academic_year: formData.get("academic_year"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid structure." };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("fee_structures")
    .update({
      class_id: parsed.data.class_id,
      fee_type: parsed.data.fee_type,
      amount: parsed.data.amount,
      academic_year: parsed.data.academic_year,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id);
  if (error) return { error: error.message };

  revalidatePath("/admin/fees/structures");
  return { success: "Fee structure updated." };
}

export async function deleteFeeStructure(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const admin = createSupabaseAdmin();
  await admin.from("fee_structures").delete().eq("id", id);
  revalidatePath("/admin/fees/structures");
}

export async function generateStudentFees(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = generateFeesSchema.safeParse({
    academic_year: formData.get("academic_year"),
    month: formData.get("month"),
    year: formData.get("year"),
    due_date: formData.get("due_date"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid generate input." };
  }

  const admin = createSupabaseAdmin();
  const { data: structures, error: structureError } = await admin
    .from("fee_structures")
    .select("*")
    .eq("academic_year", parsed.data.academic_year);
  if (structureError) return { error: structureError.message };
  if (!structures?.length) {
    return { error: "No fee structures found for that academic year." };
  }

  const { data: students, error: studentError } = await admin
    .from("students")
    .select(
      "id, uses_transport, section_id, sections(class_id)"
    )
    .eq("status", "active");
  if (studentError) return { error: studentError.message };

  const { data: scholarships } = await admin
    .from("student_scholarships")
    .select("student_id, scholarship_percent")
    .eq("academic_year", parsed.data.academic_year)
    .eq("is_active", true);

  const scholarshipByStudent = new Map(
    (scholarships ?? []).map((s) => [
      s.student_id,
      Number(s.scholarship_percent),
    ])
  );

  let created = 0;
  let skipped = 0;

  for (const student of students ?? []) {
    const section = Array.isArray(student.sections)
      ? student.sections[0]
      : student.sections;
    const classId = section?.class_id;
    if (!classId) continue;

    const classStructures = structures.filter((s) => s.class_id === classId);

    for (const structure of classStructures) {
      if (structure.fee_type === "transport" && !student.uses_transport) {
        continue;
      }

      const gross = Number(structure.amount);
      let discount = 0;
      if (structure.fee_type === "tuition") {
        const pct = scholarshipByStudent.get(student.id) ?? 0;
        discount = (gross * pct) / 100;
      }
      const fineAmount = 0;
      const net = Math.max(gross - discount + fineAmount, 0);

      const { error } = await admin.from("student_fees").insert({
        student_id: student.id,
        fee_structure_id: structure.id,
        month: parsed.data.month,
        year: parsed.data.year,
        gross_amount: gross,
        scholarship_discount: discount,
        fine_amount: fineAmount,
        net_amount: net,
        status: "pending",
        due_date: parsed.data.due_date,
      });

      if (error) {
        if (
          error.message.toLowerCase().includes("duplicate") ||
          error.code === "23505"
        ) {
          skipped += 1;
          continue;
        }
        return { error: error.message };
      }
      created += 1;
    }
  }

  revalidatePath("/admin/fees/collection");
  revalidatePath("/admin/fees/reports");
  return {
    success: `Generated ${created} fee record(s). Skipped ${skipped} duplicate(s).`,
  };
}

export async function recordFeePayment(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();
  const parsed = feePaymentSchema.safeParse({
    student_fee_id: formData.get("student_fee_id"),
    amount_paid: formData.get("amount_paid"),
    payment_date: formData.get("payment_date"),
    remarks: formData.get("remarks") || "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid payment." };
  }

  const admin = createSupabaseAdmin();
  const { data: fee, error: feeError } = await admin
    .from("student_fees")
    .select("id, net_amount, fee_payments(amount_paid)")
    .eq("id", parsed.data.student_fee_id)
    .maybeSingle();

  if (feeError || !fee) return { error: "Fee record not found." };

  const { error: payError } = await admin.from("fee_payments").insert({
    student_fee_id: parsed.data.student_fee_id,
    amount_paid: parsed.data.amount_paid,
    payment_date: parsed.data.payment_date,
    received_by: session.sub,
    remarks: parsed.data.remarks || null,
  });
  if (payError) return { error: payError.message };

  const previousPaid = (fee.fee_payments ?? []).reduce(
    (sum: number, p: { amount_paid: number }) => sum + Number(p.amount_paid),
    0
  );
  const totalPaid = previousPaid + parsed.data.amount_paid;
  const net = Number(fee.net_amount);
  let status: "pending" | "partial" | "paid" = "pending";
  if (totalPaid <= 0) status = "pending";
  else if (totalPaid + 0.0001 >= net) status = "paid";
  else status = "partial";

  await admin
    .from("student_fees")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", fee.id);

  revalidatePath("/admin/fees/collection");
  revalidatePath("/admin/fees/reports");
  return { success: "Payment recorded." };
}
