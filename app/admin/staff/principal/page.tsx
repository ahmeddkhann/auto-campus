import Link from "next/link";

import { getPrincipal } from "@/lib/dal/staff";

import { PrincipalForm } from "./principal-form";

export const instant = false;

export default async function PrincipalPage() {
  const principal = await getPrincipal();

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Link href="/admin/staff" className="text-sm font-medium text-blue-600">
        ← Back to staff
      </Link>
      <p className="text-sm text-zinc-500">
        Maintain the school principal profile and base salary (no login).
      </p>
      <PrincipalForm
        defaults={{
          full_name: principal?.full_name ?? "",
          phone: principal?.phone ?? "",
          email: principal?.email ?? "",
          qualification: principal?.qualification ?? "",
          salary: Number(principal?.salary ?? 0),
          avatar_url: principal?.avatar_url ?? "",
        }}
      />
    </div>
  );
}
