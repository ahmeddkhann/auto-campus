import { redirect } from "next/navigation";

import { verifySession } from "@/lib/dal/auth";

import { TeacherProfileForm } from "./profile-form";

export const instant = false;

export default async function TeacherProfilePage() {
  const { user, profile } = await verifySession();

  if (!user || !profile || user.role !== "teacher") {
    redirect("/login?next=/teacher/profile");
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <p className="text-sm text-zinc-500">
        Update your personal details. Leave password blank to keep the current
        one.
      </p>
      <TeacherProfileForm
        defaults={{
          full_name: profile.full_name ?? "",
          email: profile.email ?? "",
          phone: profile.phone ?? "",
          avatar_url: profile.avatar_url ?? "",
        }}
      />
    </div>
  );
}
