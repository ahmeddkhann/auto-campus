import Link from "next/link";

import { AdminCreateForm } from "./admin-create-form";

export const instant = false;

export default function NewAdminPage() {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Link href="/admin/admins" className="text-sm font-medium text-blue-600">
        ← Back to admins
      </Link>
      <p className="text-sm text-zinc-500">
        Create an admin account and email them their login credentials. They
        will need OTP verification when signing in.
      </p>
      <AdminCreateForm />
    </div>
  );
}
