import Link from "next/link";
import { redirect } from "next/navigation";

import { cardClassName } from "@/components/ui/field";
import { getTeacherIdForAuth } from "@/lib/dal/auth";
import {
  listAssignedSections,
  listAssignedSubjects,
  listStudentsInAssignedSections,
} from "@/lib/dal/teacher-panel";

export const instant = false;

export default async function TeacherClassSectionPage({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}) {
  const { sectionId } = await params;
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) redirect("/login?next=/teacher");

  const sections = await listAssignedSections(teacherId);
  const section = sections.find((s) => s.sectionId === sectionId);
  if (!section) redirect("/teacher/classes");

  const [subjects, students] = await Promise.all([
    listAssignedSubjects(teacherId, sectionId),
    listStudentsInAssignedSections(teacherId, { sectionId }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/teacher/classes" className="text-sm font-medium text-emerald-600">
          ← My classes
        </Link>
        <h2 className="mt-2 text-xl font-semibold">
          {section.className} – {section.sectionName}
        </h2>
      </div>

      <div className={cardClassName}>
        <h3 className="mb-3 font-semibold">Subjects you teach</h3>
        {subjects.length === 0 ? (
          <p className="text-sm text-zinc-500">No subjects assigned.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {subjects.map((subject) => (
              <li key={subject.subjectId}>
                {subject.subjectName}
                {subject.subjectCode ? ` (${subject.subjectCode})` : ""}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={cardClassName}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Students ({students.length})</h3>
          <Link
            href={`/teacher/students?sectionId=${sectionId}`}
            className="text-sm font-medium text-emerald-600"
          >
            Open students list
          </Link>
        </div>
        {students.length === 0 ? (
          <p className="text-sm text-zinc-500">No active students in this section.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Roll</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-zinc-100 dark:border-zinc-900"
                  >
                    <td className="px-3 py-2">{student.full_name}</td>
                    <td className="px-3 py-2">{student.roll_number}</td>
                    <td className="px-3 py-2 text-zinc-500">
                      {student.email ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
