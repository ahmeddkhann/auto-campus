import Link from "next/link";

import { SupportStaffForm } from "../staff-form";

export const instant = false;

export default function NewSupportStaffPage() {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Link href="/admin/staff" className="text-sm font-medium text-blue-600">
        ← Back to staff
      </Link>
      <SupportStaffForm mode="create" />
    </div>
  );
}
