import Link from "next/link";
import { redirect } from "next/navigation";

import { ExamForm } from "@/components/forms/exam-form";
import { getTeacherIdForAuth } from "@/lib/dal/auth";
import { listAssignedSections } from "@/lib/dal/teacher-panel";

export const instant = false;

export default async function NewTeacherExamPage() {
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) redirect("/login?next=/teacher");

  const sections = await listAssignedSections(teacherId);

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Link href="/teacher/exams" className="text-sm font-medium text-emerald-600">
        ← Exams
      </Link>
      <p className="text-sm text-zinc-500">
        Create an exam for one of your assigned sections, then enter marks per
        subject.
      </p>
      <ExamForm
        sections={sections.map((s) => ({
          sectionId: s.sectionId,
          label: `${s.className} – ${s.sectionName}`,
        }))}
      />
    </div>
  );
}
