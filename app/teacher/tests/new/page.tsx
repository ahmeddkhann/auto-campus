import Link from "next/link";
import { redirect } from "next/navigation";

import { TestForm } from "@/components/forms/test-form";
import { getTeacherIdForAuth } from "@/lib/dal/auth";
import {
  listAssignedSections,
  listAssignedSubjects,
} from "@/lib/dal/teacher-panel";

export const instant = false;

export default async function NewTeacherTestPage() {
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) redirect("/login?next=/teacher");

  const [sections, subjects] = await Promise.all([
    listAssignedSections(teacherId),
    listAssignedSubjects(teacherId),
  ]);

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Link href="/teacher/tests" className="text-sm font-medium text-emerald-600">
        ← Tests
      </Link>
      <p className="text-sm text-zinc-500">
        Choose an assigned section and subject, then set total marks.
      </p>
      <TestForm
        sections={sections.map((s) => ({
          sectionId: s.sectionId,
          label: `${s.className} – ${s.sectionName}`,
        }))}
        subjects={subjects.map((s) => ({
          subjectId: s.subjectId,
          sectionId: s.sectionId,
          label: s.subjectCode
            ? `${s.subjectName} (${s.subjectCode})`
            : s.subjectName,
        }))}
      />
    </div>
  );
}
