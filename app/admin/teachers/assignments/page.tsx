import Link from "next/link";

import { cardClassName, fieldClassName } from "@/components/ui/field";
import { listTeachers } from "@/lib/dal/teachers";

export const instant = false;

export default async function TeacherAssignmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const teachers = await listTeachers({ search: params.q });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          Full assignment matrix for every teacher. Manage assignments from
          Classes → section Manage.
        </p>
        <Link
          href="/admin/teachers"
          className="text-sm font-medium text-blue-600"
        >
          ← Teachers list
        </Link>
      </div>

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Search teacher"
          className={`max-w-md ${fieldClassName}`}
        />
        <button
          type="submit"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700"
        >
          Search
        </button>
      </form>

      <div className={cardClassName}>
        {teachers.length === 0 ? (
          <p className="text-sm text-zinc-500">No teachers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Teacher</th>
                  <th className="px-3 py-2 font-medium">Employee ID</th>
                  <th className="px-3 py-2 font-medium">Sections</th>
                  <th className="px-3 py-2 font-medium">Subjects</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => {
                  const profile = Array.isArray(teacher.profiles)
                    ? teacher.profiles[0]
                    : teacher.profiles;

                  const sections = (teacher.teacher_sections ?? [])
                    .map((row) => {
                      const section = Array.isArray(row.sections)
                        ? row.sections[0]
                        : row.sections;
                      const classRow = section
                        ? Array.isArray(section.classes)
                          ? section.classes[0]
                          : section.classes
                        : null;
                      return classRow
                        ? `${classRow.name}-${section?.name}`
                        : section?.name;
                    })
                    .filter(Boolean);

                  const subjects = (teacher.teacher_subjects ?? [])
                    .map((row) => {
                      const subject = Array.isArray(row.subjects)
                        ? row.subjects[0]
                        : row.subjects;
                      return subject?.name;
                    })
                    .filter(Boolean);

                  const uniqueSubjects = [...new Set(subjects)];

                  return (
                    <tr
                      key={teacher.id}
                      className="border-b border-zinc-100 align-top dark:border-zinc-900"
                    >
                      <td className="px-3 py-3">
                        <p className="font-medium">{profile?.full_name}</p>
                        <p className="text-xs text-zinc-500">{profile?.email}</p>
                      </td>
                      <td className="px-3 py-3">{teacher.employee_id || "—"}</td>
                      <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300">
                        {sections.length ? sections.join(", ") : "—"}
                      </td>
                      <td className="px-3 py-3 text-zinc-600 dark:text-zinc-300">
                        {uniqueSubjects.length
                          ? uniqueSubjects.join(", ")
                          : "—"}
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
