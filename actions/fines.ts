"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import { imposeFineSchema } from "@/validations/fine";

export async function imposeFine(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();
  const parsed = imposeFineSchema.safeParse({
    student_id: formData.get("student_id"),
    amount: formData.get("amount"),
    reason: formData.get("reason"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid fine." };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin.from("student_fines").insert({
    student_id: parsed.data.student_id,
    amount: parsed.data.amount,
    reason: parsed.data.reason,
    imposed_by: session.sub,
    is_paid: false,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/fines");
  return { success: "Fine imposed." };
}

export async function markFinePaid(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const admin = createSupabaseAdmin();
  await admin
    .from("student_fines")
    .update({
      is_paid: true,
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  revalidatePath("/admin/fines");
}
