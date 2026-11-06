"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/dal/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import {
  createMaintenanceSchema,
  updateMaintenanceSchema,
} from "@/validations/maintenance";

export async function createMaintenanceCost(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = createMaintenanceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    amount: formData.get("amount"),
    month: formData.get("month"),
    year: formData.get("year"),
    category: formData.get("category") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid expense data." };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin.from("maintenance_costs").insert({
    title: parsed.data.title,
    description: parsed.data.description || null,
    amount: parsed.data.amount,
    month: parsed.data.month,
    year: parsed.data.year,
    category: parsed.data.category || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/maintenance");
  return { success: "Expense recorded." };
}

export async function updateMaintenanceCost(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = updateMaintenanceSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    amount: formData.get("amount"),
    month: formData.get("month"),
    year: formData.get("year"),
    category: formData.get("category") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid expense data." };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("maintenance_costs")
    .update({
      title: parsed.data.title,
      description: parsed.data.description || null,
      amount: parsed.data.amount,
      month: parsed.data.month,
      year: parsed.data.year,
      category: parsed.data.category || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id);

  if (error) return { error: error.message };

  revalidatePath("/admin/maintenance");
  return { success: "Expense updated." };
}

export async function deleteMaintenanceCost(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const admin = createSupabaseAdmin();
  await admin.from("maintenance_costs").delete().eq("id", id);
  revalidatePath("/admin/maintenance");
  redirect("/admin/maintenance");
}
