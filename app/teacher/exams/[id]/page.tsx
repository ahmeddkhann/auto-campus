import Link from "next/link";
import { redirect } from "next/navigation";

import { ExamMarksForm } from "@/components/forms/exam-marks-form";
import { getTeacherIdForAuth } from "@/lib/dal/auth";
import { getExamForTeacher, listExamMarks } from "@/lib/dal/exams";
import {
  listAssignedSubjects,
  listStudentsInAssignedSections,
} from "@/lib/dal/teacher-panel";

export const instant = false;

export default async function TeacherExamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) redirect("/login?next=/teacher");

  const exam = await getExamForTeacher(id, teacherId);
  if (!exam) redirect("/teacher/exams");

  const [students, subjects, marks] = await Promise.all([
    listStudentsInAssignedSections(teacherId, { sectionId: exam.section_id }),
    listAssignedSubjects(teacherId, exam.section_id),
    listExamMarks(exam.id),
  ]);

  const marksMap = new Map<string, (typeof marks)[number]>(
    marks.map((row) => [`${row.student_id}::${row.subject_id}`, row])
  );

  const rows = students.flatMap((student) =>
    subjects.map((subject) => {
      const key = `${student.id}::${subject.subjectId}`;
      const existing = marksMap.get(key);
      return {
        key,
        studentId: student.id,
        studentName: student.full_name,
        rollNumber: student.roll_number,
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        total: existing ? Number(existing.total_marks) : ("" as const),
        obtained: existing ? Number(existing.obtained_marks) : ("" as const),
      };
    })
  );

  const section = Array.isArray(exam.sections) ? exam.sections[0] : exam.sections;
  const classRow = section
    ? Array.isArray(section.classes)
      ? section.classes[0]
      : section.classes
    : null;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/teacher/exams" className="text-sm font-medium text-emerald-600">
          ← Exams
        </Link>
        <h2 className="mt-2 text-xl font-semibold">{exam.title}</h2>
        <p className="mt-1 text-sm text-zinc-500">
          {classRow?.name ?? ""} {section?.name ?? ""}
          {exam.academic_year ? ` · ${exam.academic_year}` : ""}
        </p>
      </div>

      <ExamMarksForm examId={exam.id} rows={rows} />
    </div>
  );
}
