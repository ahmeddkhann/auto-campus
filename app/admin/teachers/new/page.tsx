import Link from "next/link";

import { TeacherForm } from "@/components/forms/teacher-form";

export const instant = false;

export default function NewTeacherPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href="/admin/teachers" className="text-sm font-medium text-blue-600">
        ← Back to teachers
      </Link>
      <p className="text-sm text-zinc-500">
        Create a teacher account and email their credentials. Assign sections
        later from Classes → Manage section.
      </p>
      <TeacherForm mode="create" />
    </div>
  );
}
