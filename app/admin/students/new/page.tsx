import Link from "next/link";

import { StudentForm } from "@/components/forms/student-form";
import { listSections } from "@/lib/dal/classes";

export const instant = false;

export default async function NewStudentPage() {
  const sections = await listSections();

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

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href="/admin/students" className="text-sm font-medium text-blue-600">
        ← Back to students
      </Link>
      <p className="text-sm text-zinc-500">
        Add a student to a section. Subjects for that section are applied
        automatically.
      </p>
      <StudentForm mode="create" sections={sectionOptions} />
    </div>
  );
}
