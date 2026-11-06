"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import { sectionSchema, sectionUpdateSchema } from "@/validations/class";

export async function createSection(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = sectionSchema.safeParse({
    class_id: formData.get("class_id"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid section." };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin.from("sections").insert(parsed.data);

  if (error) {
    if (error.message.toLowerCase().includes("duplicate")) {
      return { error: "That section already exists for this class." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/classes");
  return { success: "Section created." };
}

export async function updateSection(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = sectionUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid section." };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("sections")
    .update({ name: parsed.data.name })
    .eq("id", parsed.data.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/classes");
  return { success: "Section updated." };
}

export async function deleteSection(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const admin = createSupabaseAdmin();
  await admin.from("sections").delete().eq("id", id);
  revalidatePath("/admin/classes");
}
