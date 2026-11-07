import Link from "next/link";
import { redirect } from "next/navigation";

import { TestMarksForm } from "@/components/forms/test-marks-form";
import { getTeacherIdForAuth } from "@/lib/dal/auth";
import { listStudentsInAssignedSections } from "@/lib/dal/teacher-panel";
import { getTestForTeacher, listTestMarks } from "@/lib/dal/tests";

export const instant = false;

export default async function TeacherTestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) redirect("/login?next=/teacher");

  const test = await getTestForTeacher(id, teacherId);
  if (!test) redirect("/teacher/tests");

  const [students, marks] = await Promise.all([
    listStudentsInAssignedSections(teacherId, { sectionId: test.section_id }),
    listTestMarks(test.id),
  ]);

  const marksByStudent = new Map(
    marks.map((row) => [row.student_id, row] as const)
  );

  const subject = Array.isArray(test.subjects) ? test.subjects[0] : test.subjects;
  const section = Array.isArray(test.sections) ? test.sections[0] : test.sections;
  const classRow = section
    ? Array.isArray(section.classes)
      ? section.classes[0]
      : section.classes
    : null;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/teacher/tests" className="text-sm font-medium text-emerald-600">
          ← Tests
        </Link>
        <h2 className="mt-2 text-xl font-semibold">{test.title}</h2>
        <p className="mt-1 text-sm text-zinc-500">
          {subject?.name ?? "Subject"} · {classRow?.name ?? ""} {section?.name ?? ""}
          {test.test_date ? ` · ${test.test_date}` : ""}
        </p>
      </div>

      <TestMarksForm
        testId={test.id}
        totalMarks={Number(test.total_marks)}
        students={students.map((student) => {
          const existing = marksByStudent.get(student.id);
          return {
            id: student.id,
            name: student.full_name,
            rollNumber: student.roll_number,
            obtained: existing ? Number(existing.obtained_marks) : "",
            remarks: existing?.remarks ?? "",
          };
        })}
      />
    </div>
  );
}
