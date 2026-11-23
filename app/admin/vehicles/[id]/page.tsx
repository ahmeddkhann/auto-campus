import Link from "next/link";
import { notFound } from "next/navigation";

import { getVehicle } from "@/lib/dal/vehicles";

import { VehicleForm } from "../vehicle-form";

export const instant = false;

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await getVehicle(id);
  if (!vehicle) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href="/admin/vehicles" className="text-sm font-medium text-blue-600">
        ← Back to vehicles
      </Link>
      <VehicleForm
        mode="edit"
        defaults={{
          id: vehicle.id,
          name: vehicle.name,
          registration_number: vehicle.registration_number,
          capacity: vehicle.capacity,
          monthly_fee: Number(vehicle.monthly_fee),
          is_active: vehicle.is_active,
        }}
      />
    </div>
  );
}
