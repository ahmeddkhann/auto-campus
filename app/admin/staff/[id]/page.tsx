import Link from "next/link";
import { notFound } from "next/navigation";

import { getSupportStaffById } from "@/lib/dal/staff";

import { SupportStaffForm } from "../staff-form";

export const instant = false;

export default async function EditSupportStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const staff = await getSupportStaffById(id);
  if (!staff) notFound();

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Link href="/admin/staff" className="text-sm font-medium text-blue-600">
        ← Back to staff
      </Link>
      <SupportStaffForm
        mode="edit"
        defaults={{
          id: staff.id,
          full_name: staff.full_name,
          phone: staff.phone ?? "",
          designation: staff.designation ?? "",
          salary: Number(staff.salary ?? 0),
        }}
      />
    </div>
  );
}
