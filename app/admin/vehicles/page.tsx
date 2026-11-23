import Link from "next/link";

import { deleteVehicle } from "@/actions/vehicles";
import {
  buttonSecondaryClassName,
  cardClassName,
} from "@/components/ui/field";
import { listVehicles } from "@/lib/dal/vehicles";

import { VehicleForm } from "./vehicle-form";

export const instant = false;

export default async function AdminVehiclesPage() {
  const vehicles = await listVehicles();

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Transport vehicles own the monthly transport fee. Assign a student to a
        vehicle to bill that fee when generating monthly fees.
      </p>

      <VehicleForm mode="create" />

      <div className={cardClassName}>
        {vehicles.length === 0 ? (
          <p className="text-sm text-zinc-500">No vehicles yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Registration</th>
                  <th className="px-3 py-2 font-medium">Capacity</th>
                  <th className="px-3 py-2 font-medium">Monthly fee</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="border-b border-zinc-100 dark:border-zinc-900"
                  >
                    <td className="px-3 py-3 font-medium">{vehicle.name}</td>
                    <td className="px-3 py-3">
                      {vehicle.registration_number || "—"}
                    </td>
                    <td className="px-3 py-3">{vehicle.capacity ?? "—"}</td>
                    <td className="px-3 py-3">
                      {Number(vehicle.monthly_fee).toFixed(2)}
                    </td>
                    <td className="px-3 py-3">
                      {vehicle.is_active ? "Active" : "Inactive"}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/vehicles/${vehicle.id}`}
                          className={`${buttonSecondaryClassName} inline-flex`}
                        >
                          Edit
                        </Link>
                        <form action={deleteVehicle}>
                          <input type="hidden" name="id" value={vehicle.id} />
                          <button
                            type="submit"
                            className={`${buttonSecondaryClassName} text-red-600`}
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
