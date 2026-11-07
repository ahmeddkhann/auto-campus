import Link from "next/link";
import { redirect } from "next/navigation";

import { cardClassName } from "@/components/ui/field";
import { getTeacherIdForAuth } from "@/lib/dal/auth";
import {
  listAssignedSections,
  listAssignedSubjects,
} from "@/lib/dal/teacher-panel";

export const instant = false;

export default async function TeacherClassesPage() {
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) redirect("/login?next=/teacher");

  const [sections, subjects] = await Promise.all([
    listAssignedSections(teacherId),
    listAssignedSubjects(teacherId),
  ]);

  const subjectsBySection = new Map<string, typeof subjects>();
  for (const subject of subjects) {
    const list = subjectsBySection.get(subject.sectionId) ?? [];
    list.push(subject);
    subjectsBySection.set(subject.sectionId, list);
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Sections assigned to you by the admin. Assignments are read-only here.
      </p>

      {sections.length === 0 ? (
        <div className={cardClassName}>
          <p className="text-sm text-zinc-500">
            You are not assigned to any sections yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => {
            const sectionSubjects = subjectsBySection.get(section.sectionId) ?? [];
            return (
              <div key={section.sectionId} className={cardClassName}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      {section.className} – {section.sectionName}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      {sectionSubjects.length} subject
                      {sectionSubjects.length === 1 ? "" : "s"} assigned
                    </p>
                  </div>
                  <Link
                    href={`/teacher/classes/${section.sectionId}`}
                    className="text-sm font-medium text-emerald-600"
                  >
                    View
                  </Link>
                </div>
                {sectionSubjects.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {sectionSubjects.map((subject) => (
                      <li
                        key={`${subject.sectionId}-${subject.subjectId}`}
                        className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                      >
                        {subject.subjectName}
                        {subject.subjectCode ? ` (${subject.subjectCode})` : ""}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-zinc-500">
                    No subjects assigned in this section yet.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
