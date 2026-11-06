"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import { grantScholarshipSchema } from "@/validations/scholarship";

export async function grantScholarship(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();
  const parsed = grantScholarshipSchema.safeParse({
    student_id: formData.get("student_id"),
    scholarship_percent: formData.get("scholarship_percent"),
    reason: formData.get("reason") || "",
    academic_year: formData.get("academic_year"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid scholarship." };
  }

  const admin = createSupabaseAdmin();
  const { data: existing } = await admin
    .from("student_scholarships")
    .select("id")
    .eq("student_id", parsed.data.student_id)
    .eq("academic_year", parsed.data.academic_year)
    .eq("is_active", true)
    .maybeSingle();

  if (existing) {
    return {
      error:
        "This student already has an active scholarship for that academic year. Deactivate it first.",
    };
  }

  const { error } = await admin.from("student_scholarships").insert({
    student_id: parsed.data.student_id,
    scholarship_percent: parsed.data.scholarship_percent,
    reason: parsed.data.reason || null,
    academic_year: parsed.data.academic_year,
    granted_by: session.sub,
    is_active: true,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/scholarships");
  return { success: "Scholarship granted." };
}

export async function deactivateScholarship(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const admin = createSupabaseAdmin();
  await admin
    .from("student_scholarships")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/scholarships");
}
