import Link from "next/link";
import { notFound } from "next/navigation";

import { TeacherForm } from "@/components/forms/teacher-form";
import { getTeacherById } from "@/lib/dal/teachers";

export const instant = false;

export default async function EditTeacherPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const teacher = await getTeacherById(id);

  if (!teacher) {
    notFound();
  }

  const profile = Array.isArray(teacher.profiles)
    ? teacher.profiles[0]
    : teacher.profiles;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href="/admin/teachers" className="text-sm font-medium text-blue-600">
        ← Back to teachers
      </Link>
      <TeacherForm
        mode="edit"
        defaults={{
          id: teacher.id,
          full_name: profile?.full_name ?? "",
          email: profile?.email ?? "",
          phone: profile?.phone ?? "",
          employee_id: teacher.employee_id ?? "",
          qualification: teacher.qualification ?? "",
          salary: Number(teacher.salary ?? 0),
        }}
      />
    </div>
  );
}
