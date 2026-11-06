"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { sendAdminWelcomeEmail } from "@/lib/auth/mail";
import { requireAdmin } from "@/lib/dal/auth";
import { getSchoolName } from "@/lib/dal/settings";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import { createAdminSchema } from "@/validations/admin";

export async function createAdmin(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = createAdminSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid admin data." };
  }

  const email = parsed.data.email.toLowerCase();
  const admin = createSupabaseAdmin();

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.data.full_name },
  });

  if (authError || !authData.user) {
    if (authError?.message.toLowerCase().includes("already")) {
      return { error: "An account with this email already exists." };
    }
    return { error: authError?.message ?? "Could not create admin account." };
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: authData.user.id,
    full_name: parsed.data.full_name,
    email,
    role: "admin",
    phone: parsed.data.phone || null,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(authData.user.id);
    return { error: profileError.message };
  }

  try {
    await sendAdminWelcomeEmail({
      to: email,
      fullName: parsed.data.full_name,
      password: parsed.data.password,
      schoolName: await getSchoolName(),
    });
  } catch (error) {
    console.error("Could not send admin welcome email:", error);
  }

  revalidatePath("/admin/admins");
  redirect("/admin/admins");
}
