"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import {
  principalSchema,
  supportStaffSchema,
  supportStaffUpdateSchema,
} from "@/validations/staff";

export async function createSupportStaff(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = supportStaffSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone") || "",
    designation: formData.get("designation") || "",
    salary: formData.get("salary") || 0,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid staff data." };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin.from("support_staff").insert({
    full_name: parsed.data.full_name,
    phone: parsed.data.phone || null,
    designation: parsed.data.designation || null,
    salary: parsed.data.salary,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/staff");
  redirect("/admin/staff");
}

export async function updateSupportStaff(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = supportStaffUpdateSchema.safeParse({
    id: formData.get("id"),
    full_name: formData.get("full_name"),
    phone: formData.get("phone") || "",
    designation: formData.get("designation") || "",
    salary: formData.get("salary") || 0,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid staff data." };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("support_staff")
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone || null,
      designation: parsed.data.designation || null,
      salary: parsed.data.salary,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id);
  if (error) return { error: error.message };

  revalidatePath("/admin/staff");
  revalidatePath(`/admin/staff/${parsed.data.id}`);
  return { success: "Support staff updated." };
}

export async function deleteSupportStaff(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const admin = createSupabaseAdmin();
  await admin.from("support_staff").delete().eq("id", id);
  revalidatePath("/admin/staff");
}

export async function upsertPrincipal(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = principalSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone") || "",
    email: formData.get("email") || "",
    qualification: formData.get("qualification") || "",
    salary: formData.get("salary") || 0,
    avatar_url: formData.get("avatar_url") || "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid principal data." };
  }

  const admin = createSupabaseAdmin();
  const { data: existing } = await admin
    .from("principal")
    .select("id")
    .limit(1)
    .maybeSingle();

  const payload = {
    full_name: parsed.data.full_name,
    phone: parsed.data.phone || null,
    email: parsed.data.email || null,
    qualification: parsed.data.qualification || null,
    salary: parsed.data.salary,
    avatar_url: parsed.data.avatar_url || null,
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { error } = await admin
      .from("principal")
      .update(payload)
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await admin.from("principal").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/staff/principal");
  revalidatePath("/admin/salaries");
  return { success: "Principal saved." };
}
