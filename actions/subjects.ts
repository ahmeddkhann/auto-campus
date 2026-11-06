"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import { subjectSchema, subjectUpdateSchema } from "@/validations/subject";

export async function createSubject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = subjectSchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid subject." };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin.from("subjects").insert({
    name: parsed.data.name,
    code: parsed.data.code.toUpperCase(),
  });

  if (error) {
    if (error.message.toLowerCase().includes("duplicate")) {
      return { error: "A subject with that code already exists." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/subjects");
  return { success: "Subject created." };
}

export async function updateSubject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = subjectUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    code: formData.get("code"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid subject." };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("subjects")
    .update({
      name: parsed.data.name,
      code: parsed.data.code.toUpperCase(),
    })
    .eq("id", parsed.data.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/subjects");
  return { success: "Subject updated." };
}

export async function deleteSubject(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const admin = createSupabaseAdmin();
  await admin.from("subjects").delete().eq("id", id);
  revalidatePath("/admin/subjects");
}
