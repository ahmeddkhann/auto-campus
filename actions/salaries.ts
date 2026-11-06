"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import { processSalariesSchema } from "@/validations/salary";

export async function processMonthlySalaries(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const month = Number(formData.get("month"));
  const year = Number(formData.get("year"));
  const keys = formData.getAll("employee_key").map(String);

  const entries = keys.map((key) => {
    const [employee_type, employee_id] = key.split(":");
    return {
      employee_type,
      employee_id,
      base_salary: formData.get(`base_${key}`),
      bonus: formData.get(`bonus_${key}`) || 0,
    };
  });

  const parsed = processSalariesSchema.safeParse({ month, year, entries });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid salary data." };
  }

  const admin = createSupabaseAdmin();
  let created = 0;
  let skipped = 0;

  for (const entry of parsed.data.entries) {
    const total = entry.base_salary + entry.bonus;
    const { error } = await admin.from("salary_payments").insert({
      employee_type: entry.employee_type,
      employee_id: entry.employee_id,
      month: parsed.data.month,
      year: parsed.data.year,
      base_salary: entry.base_salary,
      bonus: entry.bonus,
      total_amount: total,
      paid_at: new Date().toISOString(),
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

  revalidatePath("/admin/salaries");
  revalidatePath("/admin/salaries/payments");
  return {
    success: `Recorded ${created} salary payment(s). Skipped ${skipped} duplicate(s).`,
  };
}
