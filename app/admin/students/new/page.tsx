import Link from "next/link";

import { StudentForm } from "@/components/forms/student-form";
import { listSections } from "@/lib/dal/classes";
import { listVehicles } from "@/lib/dal/vehicles";

export const instant = false;

export default async function NewStudentPage() {
  const [sections, vehicles] = await Promise.all([
    listSections(),
    listVehicles({ activeOnly: true }),
  ]);

  const sectionOptions = sections.map((section) => {
    const classRow = Array.isArray(section.classes)
      ? section.classes[0]
      : section.classes;
    return {
      id: section.id,
      label: classRow
        ? `${classRow.name} — Section ${section.name}`
        : section.name,
    };
  });

  const vehicleOptions = vehicles.map((vehicle) => ({
    id: vehicle.id,
    label: `${vehicle.name}${
      vehicle.registration_number ? ` (${vehicle.registration_number})` : ""
    } — ${Number(vehicle.monthly_fee).toFixed(2)}/mo`,
  }));

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href="/admin/students" className="text-sm font-medium text-blue-600">
        ← Back to students
      </Link>
      <p className="text-sm text-zinc-500">
        Add a student to a section. Subjects for that section are applied
        automatically.
      </p>
      <StudentForm
        mode="create"
        sections={sectionOptions}
        vehicles={vehicleOptions}
      />
    </div>
  );
}
