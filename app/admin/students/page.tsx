import Link from "next/link";

import { deleteStudent } from "@/actions/students";
import {
  buttonSecondaryClassName,
  cardClassName,
  fieldClassName,
} from "@/components/ui/field";
import { PageActions } from "@/components/ui/page-actions";
import { listClassesWithSections } from "@/lib/dal/classes";
import { listStudents } from "@/lib/dal/students";
import { listSubjects } from "@/lib/dal/subjects";

export const instant = false;

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; classId?: string; subjectId?: string }>;
}) {
  const params = await searchParams;
  const [students, classes, subjects] = await Promise.all([
    listStudents({
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
          Manage student records. Enrollment emails confirm school placement
          without login credentials.
        </p>
        <PageActions href="/admin/students/new" label="Add student" />
      </div>

      <form className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-4">
        <input
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Search name, email, roll number"
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
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
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
                      <td className="px-3 py-3 font-medium">
                        {student.full_name}
                      </td>
                      <td className="px-3 py-3">{student.roll_number}</td>
                      <td className="px-3 py-3">{student.email || "—"}</td>
                      <td className="px-3 py-3">
                        {classRow
                          ? `${classRow.name}-${section?.name}`
                          : section?.name || "—"}
                      </td>
                      <td className="px-3 py-3 capitalize">{student.status}</td>
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/students/${student.id}`}
                            className={buttonSecondaryClassName}
                          >
                            View / Edit
                          </Link>
                          <form action={deleteStudent}>
                            <input type="hidden" name="id" value={student.id} />
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
