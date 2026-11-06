import { deleteSubject } from "@/actions/subjects";
import {
  buttonSecondaryClassName,
  cardClassName,
} from "@/components/ui/field";
import { listSubjects } from "@/lib/dal/subjects";

import { SubjectForm } from "./subject-form";

export const instant = false;

export default async function AdminSubjectsPage() {
  const subjects = await listSubjects();

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Manage subjects used for teacher assignments and student enrollment.
      </p>

      <SubjectForm />

      <div className={cardClassName}>
        {subjects.length === 0 ? (
          <p className="text-sm text-zinc-500">No subjects yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Code</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr
                    key={subject.id}
                    className="border-b border-zinc-100 dark:border-zinc-900"
                  >
                    <td className="px-3 py-3 font-medium">{subject.name}</td>
                    <td className="px-3 py-3">{subject.code}</td>
                    <td className="px-3 py-3">
                      <form action={deleteSubject}>
                        <input type="hidden" name="id" value={subject.id} />
                        <button
                          type="submit"
                          className={`${buttonSecondaryClassName} text-red-600`}
                        >
                          Delete
                        </button>
                      </form>
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
