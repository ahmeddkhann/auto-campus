import Link from "next/link";
import { redirect } from "next/navigation";

import { cardClassName } from "@/components/ui/field";
import { PageActions } from "@/components/ui/page-actions";
import { getTeacherIdForAuth } from "@/lib/dal/auth";
import { countTestMarks, listTestsForTeacher } from "@/lib/dal/tests";

export const instant = false;

export default async function TeacherTestsPage() {
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) redirect("/login?next=/teacher");

  const tests = await listTestsForTeacher(teacherId);
  const markCounts = await Promise.all(
    tests.map(async (test) => [test.id, await countTestMarks(test.id)] as const)
  );
  const countByTest = new Map(markCounts);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          Create tests for your assigned sections and enter student marks.
        </p>
        <PageActions href="/teacher/tests/new" label="Create test" tone="teacher" />
      </div>

      <div className={cardClassName}>
        {tests.length === 0 ? (
          <p className="text-sm text-zinc-500">No tests created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Title</th>
                  <th className="px-3 py-2 font-medium">Section</th>
                  <th className="px-3 py-2 font-medium">Subject</th>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Marks entered</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => {
                  const subject = Array.isArray(test.subjects)
                    ? test.subjects[0]
                    : test.subjects;
                  const section = Array.isArray(test.sections)
                    ? test.sections[0]
                    : test.sections;
                  const classRow = section
                    ? Array.isArray(section.classes)
                      ? section.classes[0]
                      : section.classes
                    : null;
                  return (
                    <tr
                      key={test.id}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="px-3 py-2 font-medium">{test.title}</td>
                      <td className="px-3 py-2">
                        {classRow?.name ?? "—"} {section?.name ?? ""}
                      </td>
                      <td className="px-3 py-2">{subject?.name ?? "—"}</td>
                      <td className="px-3 py-2">{test.test_date ?? "—"}</td>
                      <td className="px-3 py-2">
                        {countByTest.get(test.id) ?? 0}
                      </td>
                      <td className="px-3 py-2">
                        <Link
                          href={`/teacher/tests/${test.id}`}
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
