"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { sendTeacherWelcomeEmail } from "@/lib/auth/mail";
import { requireAdmin } from "@/lib/dal/auth";
import { getSchoolName } from "@/lib/dal/settings";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import {
  createTeacherSchema,
  updateTeacherSchema,
} from "@/validations/teacher";

export async function createTeacher(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = createTeacherSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone") || "",
    employee_id: formData.get("employee_id"),
    qualification: formData.get("qualification") || "",
    salary: formData.get("salary") || 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid teacher data." };
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
    return { error: authError?.message ?? "Could not create teacher account." };
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: authData.user.id,
    full_name: parsed.data.full_name,
    email,
    role: "teacher",
    phone: parsed.data.phone || null,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(authData.user.id);
    return { error: profileError.message };
  }

  const { error: teacherError } = await admin.from("teachers").insert({
    profile_id: authData.user.id,
    employee_id: parsed.data.employee_id,
    qualification: parsed.data.qualification || null,
    salary: parsed.data.salary,
  });

  if (teacherError) {
    await admin.auth.admin.deleteUser(authData.user.id);
    return { error: teacherError.message };
  }

  try {
    await sendTeacherWelcomeEmail({
      to: email,
      fullName: parsed.data.full_name,
      password: parsed.data.password,
      schoolName: await getSchoolName(),
    });
  } catch (error) {
    console.error("Could not send teacher welcome email:", error);
  }

  revalidatePath("/admin/teachers");
  redirect("/admin/teachers");
}

export async function updateTeacher(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = updateTeacherSchema.safeParse({
    id: formData.get("id"),
    full_name: formData.get("full_name"),
    phone: formData.get("phone") || "",
    employee_id: formData.get("employee_id"),
    qualification: formData.get("qualification") || "",
    salary: formData.get("salary") || 0,
    password: formData.get("password") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid teacher data." };
  }

  const admin = createSupabaseAdmin();
  const { data: teacher, error: fetchError } = await admin
    .from("teachers")
    .select("id, profile_id")
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (fetchError || !teacher) {
    return { error: "Teacher not found." };
  }

  const { error: teacherError } = await admin
    .from("teachers")
    .update({
      employee_id: parsed.data.employee_id,
      qualification: parsed.data.qualification || null,
      salary: parsed.data.salary,
      updated_at: new Date().toISOString(),
    })
    .eq("id", teacher.id);

  if (teacherError) {
    return { error: teacherError.message };
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", teacher.profile_id);

  if (profileError) {
    return { error: profileError.message };
  }

  if (parsed.data.password) {
    const { error: passwordError } = await admin.auth.admin.updateUserById(
      teacher.profile_id,
      { password: parsed.data.password }
    );
    if (passwordError) {
      return { error: passwordError.message };
    }
  }

  revalidatePath("/admin/teachers");
  revalidatePath(`/admin/teachers/${teacher.id}`);
  return { success: "Teacher updated." };
}

export async function deleteTeacher(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const admin = createSupabaseAdmin();
  const { data: teacher } = await admin
    .from("teachers")
    .select("id, profile_id")
    .eq("id", id)
    .maybeSingle();

  if (!teacher) return;

  await admin.from("section_head_teachers").delete().eq("teacher_id", teacher.id);
  await admin.from("teacher_subjects").delete().eq("teacher_id", teacher.id);
  await admin.from("teacher_sections").delete().eq("teacher_id", teacher.id);
  await admin.from("teachers").delete().eq("id", teacher.id);
  await admin.from("profiles").delete().eq("id", teacher.profile_id);
  await admin.auth.admin.deleteUser(teacher.profile_id);

  revalidatePath("/admin/teachers");
}
