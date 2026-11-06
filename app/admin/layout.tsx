import { redirect } from "next/navigation";

import { AdminShell } from "@/components/layout/admin-shell";
import { verifySession } from "@/lib/dal/auth";

// Auth-gated shell reads the session cookie at request time.
export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await verifySession();

  if (!user || user.role !== "admin" || !profile) {
    redirect("/login?next=/admin");
  }

  return (
    <AdminShell userName={profile.full_name || profile.email}>
      {children}
    </AdminShell>
  );
}
