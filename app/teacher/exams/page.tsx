import Link from "next/link";
import { redirect } from "next/navigation";

import { cardClassName } from "@/components/ui/field";
import { PageActions } from "@/components/ui/page-actions";
import { getTeacherIdForAuth } from "@/lib/dal/auth";
import { countExamMarks, listExamsForTeacher } from "@/lib/dal/exams";

export const instant = false;

export default async function TeacherExamsPage() {
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) redirect("/login?next=/teacher");

  const exams = await listExamsForTeacher(teacherId);
  const markCounts = await Promise.all(
    exams.map(async (exam) => [exam.id, await countExamMarks(exam.id)] as const)
  );
  const countByExam = new Map(markCounts);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          Create exams for assigned sections and enter per-subject marks.
        </p>
        <PageActions href="/teacher/exams/new" label="Create exam" tone="teacher" />
      </div>

      <div className={cardClassName}>
        {exams.length === 0 ? (
          <p className="text-sm text-zinc-500">No exams created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Title</th>
                  <th className="px-3 py-2 font-medium">Section</th>
                  <th className="px-3 py-2 font-medium">Year</th>
                  <th className="px-3 py-2 font-medium">Marks rows</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => {
                  const section = Array.isArray(exam.sections)
                    ? exam.sections[0]
                    : exam.sections;
                  const classRow = section
                    ? Array.isArray(section.classes)
                      ? section.classes[0]
                      : section.classes
                    : null;
                  return (
                    <tr
                      key={exam.id}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="px-3 py-2 font-medium">{exam.title}</td>
                      <td className="px-3 py-2">
                        {classRow?.name ?? "—"} {section?.name ?? ""}
                      </td>
                      <td className="px-3 py-2">
                        {exam.academic_year ?? "—"}
                      </td>
                      <td className="px-3 py-2">
                        {countByExam.get(exam.id) ?? 0}
                      </td>
                      <td className="px-3 py-2">
                        <Link
                          href={`/teacher/exams/${exam.id}`}
                          className="font-medium text-emerald-600"
                        >
                          Enter marks
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
