"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth/session";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import { profileUpdateSchema } from "@/validations/profile";

async function updateOwnProfile(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "teacher")) {
    return { error: "You must be signed in to update your profile." };
  }

  const parsed = profileUpdateSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone") || "",
    avatar_url: formData.get("avatar_url") || "",
    password: formData.get("password") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid profile data." };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone || null,
      avatar_url: parsed.data.avatar_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.sub);

  if (error) {
    return { error: error.message };
  }

  if (parsed.data.password) {
    const { error: passwordError } = await admin.auth.admin.updateUserById(
      session.sub,
      { password: parsed.data.password }
    );
    if (passwordError) {
      return { error: passwordError.message };
    }
  }

  if (session.role === "admin") {
    revalidatePath("/admin/profile");
    revalidatePath("/admin", "layout");
  } else {
    revalidatePath("/teacher/profile");
    revalidatePath("/teacher", "layout");
  }

  return { success: "Profile updated." };
}

/** @deprecated Prefer updateOwnProfile — kept for admin form imports. */
export async function updateAdminProfile(
  prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  return updateOwnProfile(prev, formData);
}

export { updateOwnProfile };
