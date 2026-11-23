"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import { vehicleSchema, vehicleUpdateSchema } from "@/validations/vehicle";

function parseVehicleForm(formData: FormData) {
  const capacityRaw = String(formData.get("capacity") ?? "").trim();
  return {
    name: formData.get("name"),
    registration_number: formData.get("registration_number") || "",
    capacity: capacityRaw === "" ? "" : capacityRaw,
    monthly_fee: formData.get("monthly_fee"),
    is_active: formData.get("is_active") === "on",
  };
}

function toVehicleRow(data: {
  name: string;
  registration_number?: string;
  capacity?: number;
  monthly_fee: number;
  is_active: boolean;
}) {
  return {
    name: data.name,
    registration_number: data.registration_number || null,
    capacity: data.capacity ?? null,
    monthly_fee: data.monthly_fee,
    is_active: data.is_active,
  };
}

export async function createVehicle(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = vehicleSchema.safeParse(parseVehicleForm(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid vehicle." };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("vehicles")
    .insert(toVehicleRow(parsed.data));

  if (error) {
    if (error.message.toLowerCase().includes("duplicate")) {
      return { error: "A vehicle with that registration already exists." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/vehicles");
  revalidatePath("/admin");
  return { success: "Vehicle created." };
}

export async function updateVehicle(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const parsed = vehicleUpdateSchema.safeParse({
    id: formData.get("id"),
    ...parseVehicleForm(formData),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid vehicle." };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("vehicles")
    .update({
      ...toVehicleRow(parsed.data),
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id);

  if (error) {
    if (error.message.toLowerCase().includes("duplicate")) {
      return { error: "A vehicle with that registration already exists." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/vehicles");
  revalidatePath(`/admin/vehicles/${parsed.data.id}`);
  revalidatePath("/admin");
  return { success: "Vehicle updated." };
}

export async function deleteVehicle(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const admin = createSupabaseAdmin();
  await admin.from("vehicles").delete().eq("id", id);
  revalidatePath("/admin/vehicles");
  revalidatePath("/admin");
}
