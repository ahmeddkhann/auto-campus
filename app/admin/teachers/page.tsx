import Link from "next/link";

import { deleteTeacher } from "@/actions/teachers";
import {
  buttonSecondaryClassName,
  cardClassName,
  fieldClassName,
} from "@/components/ui/field";
import { PageActions } from "@/components/ui/page-actions";
import { listClassesWithSections } from "@/lib/dal/classes";
import { listSubjects } from "@/lib/dal/subjects";
import { listTeachers } from "@/lib/dal/teachers";

export const instant = false;

export default async function AdminTeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; classId?: string; subjectId?: string }>;
}) {
  const params = await searchParams;
  const [teachers, classes, subjects] = await Promise.all([
    listTeachers({
      search: params.q,
      classId: params.classId,
      subjectId: params.subjectId,
    }),
    listClassesWithSections(),
    listSubjects(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          Manage teacher accounts, section assignments, and subjects.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/teachers/assignments"
            className={buttonSecondaryClassName}
          >
            Assignment matrix
          </Link>
          <PageActions href="/admin/teachers/new" label="Add teacher" />
        </div>
      </div>

      <form className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-4">
        <input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Search name, email, employee ID"
          className={fieldClassName}
        />
        <select
          name="classId"
          defaultValue={params.classId ?? ""}
          className={fieldClassName}
        >
          <option value="">All classes</option>
          {classes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          name="subjectId"
          defaultValue={params.subjectId ?? ""}
          className={fieldClassName}
        >
          <option value="">All subjects</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
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
        {teachers.length === 0 ? (
          <p className="text-sm text-zinc-500">No teachers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Employee ID</th>
                  <th className="px-3 py-2 font-medium">Assignments</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
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
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <tr
                      key={teacher.id}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="px-3 py-3 font-medium">
                        {profile?.full_name}
                      </td>
                      <td className="px-3 py-3">{profile?.email}</td>
                      <td className="px-3 py-3">{teacher.employee_id}</td>
                      <td className="px-3 py-3 text-zinc-500">
                        {sections || "—"}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/teachers/${teacher.id}`}
                            className={buttonSecondaryClassName}
                          >
                            Edit
                          </Link>
                          <form action={deleteTeacher}>
                            <input type="hidden" name="id" value={teacher.id} />
                            <button
                              type="submit"
                              className={`${buttonSecondaryClassName} text-red-600`}
                            >
                              Delete
                            </button>
                          </form>
                        </div>
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
