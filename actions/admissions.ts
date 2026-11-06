"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/dal/auth";
import { syncStudentSubjectsFromSection } from "@/lib/dal/sections";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import {
  approveAdmissionSchema,
  rejectAdmissionSchema,
  submitAdmissionSchema,
} from "@/validations/admission";

export async function submitAdmission(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = submitAdmissionSchema.safeParse({
    student_name: formData.get("student_name"),
    father_name: formData.get("father_name") || undefined,
    mother_name: formData.get("mother_name") || undefined,
    date_of_birth: formData.get("date_of_birth") || undefined,
    gender: formData.get("gender") || undefined,
    phone: formData.get("phone") || undefined,
    email: formData.get("email"),
    address: formData.get("address") || undefined,
    class_id: formData.get("class_id"),
    previous_school: formData.get("previous_school") || undefined,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid application data.",
    };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin.from("admissions").insert({
    student_name: parsed.data.student_name,
    father_name: parsed.data.father_name || null,
    mother_name: parsed.data.mother_name || null,
    date_of_birth: parsed.data.date_of_birth || null,
    gender: parsed.data.gender || null,
    phone: parsed.data.phone || null,
    email: parsed.data.email.toLowerCase(),
    address: parsed.data.address || null,
    class_id: parsed.data.class_id,
    previous_school: parsed.data.previous_school || null,
    status: "pending",
  });

  if (error) return { error: error.message };

  return {
    success:
      "Application submitted. The school office will review it shortly.",
  };
}

export async function approveAdmission(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = approveAdmissionSchema.safeParse({
    id: formData.get("id"),
    section_id: formData.get("section_id"),
    roll_number: formData.get("roll_number"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid approval data." };
  }

  const admin = createSupabaseAdmin();
  const { data: admission, error: loadError } = await admin
    .from("admissions")
    .select("*")
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (loadError || !admission) {
    return { error: loadError?.message ?? "Admission not found." };
  }

  if (admission.status !== "pending") {
    return { error: "Only pending applications can be approved." };
  }

  const { data: section, error: sectionError } = await admin
    .from("sections")
    .select("id, class_id")
    .eq("id", parsed.data.section_id)
    .maybeSingle();

  if (sectionError || !section) {
    return { error: "Section not found." };
  }

  if (section.class_id !== admission.class_id) {
    return { error: "Selected section must belong to the applied class." };
  }

  const { data: student, error: studentError } = await admin
    .from("students")
    .insert({
      full_name: admission.student_name,
      email: admission.email?.toLowerCase() || null,
      roll_number: parsed.data.roll_number,
      father_name: admission.father_name,
      mother_name: admission.mother_name,
      date_of_birth: admission.date_of_birth,
      gender: admission.gender,
      address: admission.address,
      phone: admission.phone,
      section_id: parsed.data.section_id,
      status: "active",
    })
    .select("id")
    .single();

  if (studentError || !student) {
    return { error: studentError?.message ?? "Could not create student." };
  }

  try {
    await syncStudentSubjectsFromSection(student.id, parsed.data.section_id);
  } catch (syncError) {
    console.error(syncError);
  }

  const { error: updateError } = await admin
    .from("admissions")
    .update({
      status: "approved",
      reviewed_by: session.sub,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id);

  if (updateError) {
    return {
      error: `Student created but admission status update failed: ${updateError.message}`,
    };
  }

  revalidatePath("/admin/admissions");
  revalidatePath(`/admin/admissions/${parsed.data.id}`);
  revalidatePath("/admin/students");
  redirect(`/admin/students/${student.id}`);
}

export async function rejectAdmission(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = rejectAdmissionSchema.safeParse({
    id: formData.get("id"),
    rejection_reason: formData.get("rejection_reason"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid rejection data." };
  }

  const admin = createSupabaseAdmin();
  const { data: admission, error: loadError } = await admin
    .from("admissions")
    .select("id, status")
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (loadError || !admission) {
    return { error: loadError?.message ?? "Admission not found." };
  }

  if (admission.status !== "pending") {
    return { error: "Only pending applications can be rejected." };
  }

  const { error } = await admin
    .from("admissions")
    .update({
      status: "rejected",
      rejection_reason: parsed.data.rejection_reason,
      reviewed_by: session.sub,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id);

  if (error) return { error: error.message };

  revalidatePath("/admin/admissions");
  revalidatePath(`/admin/admissions/${parsed.data.id}`);
  return { success: "Application rejected." };
}
