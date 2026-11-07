import { redirect } from "next/navigation";

import {
  cardClassName,
  fieldClassName,
} from "@/components/ui/field";
import { getTeacherIdForAuth } from "@/lib/dal/auth";
import {
  listAssignedSections,
  listStudentsInAssignedSections,
} from "@/lib/dal/teacher-panel";

export const instant = false;

export default async function TeacherStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sectionId?: string }>;
}) {
  const params = await searchParams;
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) redirect("/login?next=/teacher");

  const [sections, students] = await Promise.all([
    listAssignedSections(teacherId),
    listStudentsInAssignedSections(teacherId, {
      search: params.q,
      sectionId: params.sectionId,
    }),
  ]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Active students in your assigned sections.
      </p>

      <form className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-3">
        <input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Search name, email, roll number"
          className={fieldClassName}
        />
        <select
          name="sectionId"
          defaultValue={params.sectionId ?? ""}
          className={fieldClassName}
        >
          <option value="">All assigned sections</option>
          {sections.map((section) => (
            <option key={section.sectionId} value={section.sectionId}>
              {section.className} – {section.sectionName}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700"
        >
          Filter
        </button>
      </form>

      <div className={cardClassName}>
        {students.length === 0 ? (
          <p className="text-sm text-zinc-500">No students found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Roll</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Class / Section</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const section = Array.isArray(student.sections)
                    ? student.sections[0]
                    : student.sections;
                  const classRow = section
                    ? Array.isArray(section.classes)
                      ? section.classes[0]
                      : section.classes
                    : null;
                  return (
                    <tr
                      key={student.id}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="px-3 py-2">{student.full_name}</td>
                      <td className="px-3 py-2">{student.roll_number}</td>
                      <td className="px-3 py-2 text-zinc-500">
                        {student.email ?? "—"}
                      </td>
                      <td className="px-3 py-2">
                        {classRow?.name ?? "—"} {section?.name ?? ""}
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
