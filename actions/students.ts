"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { sendStudentEnrollmentEmail } from "@/lib/auth/mail";
import { requireAdmin } from "@/lib/dal/auth";
import { syncStudentSubjectsFromSection } from "@/lib/dal/sections";
import { getSchoolName } from "@/lib/dal/settings";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import {
  createStudentSchema,
  updateStudentSchema,
} from "@/validations/student";

export async function createStudent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = createStudentSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    roll_number: formData.get("roll_number"),
    father_name: formData.get("father_name") || "",
    mother_name: formData.get("mother_name") || "",
    date_of_birth: formData.get("date_of_birth") || "",
    gender: formData.get("gender") || "",
    address: formData.get("address") || "",
    phone: formData.get("phone") || "",
    section_id: formData.get("section_id"),
    status: formData.get("status") || "active",
    uses_transport: formData.get("uses_transport") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid student data." };
  }

  const admin = createSupabaseAdmin();
  const { data: student, error } = await admin
    .from("students")
    .insert({
      full_name: parsed.data.full_name,
      email: parsed.data.email.toLowerCase(),
      roll_number: parsed.data.roll_number,
      father_name: parsed.data.father_name || null,
      mother_name: parsed.data.mother_name || null,
      date_of_birth: parsed.data.date_of_birth || null,
      gender: parsed.data.gender || null,
      address: parsed.data.address || null,
      phone: parsed.data.phone || null,
      section_id: parsed.data.section_id,
      status: parsed.data.status,
      uses_transport: parsed.data.uses_transport,
    })
    .select("id, full_name, email")
    .single();

  if (error || !student) {
    return { error: error?.message ?? "Could not create student." };
  }

  try {
    await syncStudentSubjectsFromSection(student.id, parsed.data.section_id);
  } catch (syncError) {
    console.error(syncError);
    return {
      error:
        "Student was created but class subjects could not be applied. Edit the student or update section subjects.",
    };
  }

  if (student.email) {
    try {
      await sendStudentEnrollmentEmail({
        to: student.email,
        fullName: student.full_name,
        schoolName: await getSchoolName(),
      });
    } catch (mailError) {
      console.error("Could not send student enrollment email:", mailError);
    }
  }

  revalidatePath("/admin/students");
  redirect("/admin/students");
}

export async function updateStudent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = updateStudentSchema.safeParse({
    id: formData.get("id"),
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    roll_number: formData.get("roll_number"),
    father_name: formData.get("father_name") || "",
    mother_name: formData.get("mother_name") || "",
    date_of_birth: formData.get("date_of_birth") || "",
    gender: formData.get("gender") || "",
    address: formData.get("address") || "",
    phone: formData.get("phone") || "",
    section_id: formData.get("section_id"),
    status: formData.get("status") || "active",
    uses_transport: formData.get("uses_transport") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid student data." };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("students")
    .update({
      full_name: parsed.data.full_name,
      email: parsed.data.email.toLowerCase(),
      roll_number: parsed.data.roll_number,
      father_name: parsed.data.father_name || null,
      mother_name: parsed.data.mother_name || null,
      date_of_birth: parsed.data.date_of_birth || null,
      gender: parsed.data.gender || null,
      address: parsed.data.address || null,
      phone: parsed.data.phone || null,
      section_id: parsed.data.section_id,
      status: parsed.data.status,
      uses_transport: parsed.data.uses_transport,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id);

  if (error) {
    return { error: error.message };
  }

  try {
    await syncStudentSubjectsFromSection(parsed.data.id, parsed.data.section_id);
  } catch (syncError) {
    console.error(syncError);
    return { error: "Could not sync student subjects from the section." };
  }

  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${parsed.data.id}`);
  return { success: "Student updated." };
}

export async function deleteStudent(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const admin = createSupabaseAdmin();
  await admin.from("student_subjects").delete().eq("student_id", id);
  await admin.from("students").delete().eq("id", id);
  revalidatePath("/admin/students");
}
