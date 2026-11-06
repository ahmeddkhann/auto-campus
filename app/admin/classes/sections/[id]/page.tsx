import Link from "next/link";
import { notFound } from "next/navigation";

import {
  removeHeadTeacher,
  removeTeacherFromSection,
} from "@/actions/sections";
import {
  buttonSecondaryClassName,
  cardClassName,
} from "@/components/ui/field";
import { listTeachers } from "@/lib/dal/teachers";
import { listSubjects } from "@/lib/dal/subjects";
import {
  getSectionById,
  isActiveTemporaryHead,
  listSectionHeadTeachers,
  listSectionSubjects,
  listSectionTeachers,
} from "@/lib/dal/sections";

import { AssignTeacherForm } from "./assign-teacher-form";
import { HeadTeacherForms } from "./head-teacher-forms";
import { SectionSubjectsForm } from "./section-subjects-form";

export const instant = false;

export default async function SectionManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [section, sectionSubjects, sectionTeachers, headTeachers, allSubjects, allTeachers] =
    await Promise.all([
      getSectionById(id),
      listSectionSubjects(id),
      listSectionTeachers(id),
      listSectionHeadTeachers(id),
      listSubjects(),
      listTeachers(),
    ]);

  if (!section) {
    notFound();
  }

  const classRow = Array.isArray(section.classes)
    ? section.classes[0]
    : section.classes;

  const selectedSubjectIds = sectionSubjects.map((row) => row.subject_id);
  const assignedTeacherIds = new Set(
    sectionTeachers.map((row) => row.teacher_id)
  );

  const availableTeachers = allTeachers
    .filter((teacher) => !assignedTeacherIds.has(teacher.id))
    .map((teacher) => {
      const profile = Array.isArray(teacher.profiles)
        ? teacher.profiles[0]
        : teacher.profiles;
      return {
        id: teacher.id,
        label: `${profile?.full_name ?? "Teacher"}${
          teacher.employee_id ? ` (${teacher.employee_id})` : ""
        }`,
      };
    });

  const assignedTeachers = sectionTeachers.map((row) => {
    const teacher = Array.isArray(row.teachers) ? row.teachers[0] : row.teachers;
    const profile = teacher
      ? Array.isArray(teacher.profiles)
        ? teacher.profiles[0]
        : teacher.profiles
      : null;
    const taught = (teacher?.teacher_subjects ?? [])
      .filter((ts: { section_id: string }) => ts.section_id === id)
      .map((ts: { subjects?: { name?: string } | Array<{ name?: string }> }) => {
        const subject = Array.isArray(ts.subjects) ? ts.subjects[0] : ts.subjects;
        return subject?.name;
      })
      .filter(Boolean);

    return {
      id: row.teacher_id,
      name: profile?.full_name ?? "Teacher",
      email: profile?.email ?? "",
      employeeId: teacher?.employee_id ?? "",
      subjects: taught as string[],
    };
  });

  const permanentHead = headTeachers.find((row) => row.type === "permanent");
  const temporaryHead = headTeachers.find(
    (row) => row.type === "temporary" && isActiveTemporaryHead(row.expires_at)
  );
  const expiredTemps = headTeachers.filter(
    (row) =>
      row.type === "temporary" && !isActiveTemporaryHead(row.expires_at)
  );

  const headCandidateTeachers = assignedTeachers.map((teacher) => ({
    id: teacher.id,
    label: teacher.name,
  }));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link href="/admin/classes" className="text-sm font-medium text-blue-600">
          ← Back to classes
        </Link>
        <h2 className="mt-3 text-xl font-semibold">
          {classRow?.name ?? "Class"} — Section {section.name}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Configure subjects for this section, assign teachers, and appoint head
          teachers. Students in this section automatically receive the section
          subjects.
        </p>
      </div>

      <SectionSubjectsForm
        sectionId={section.id}
        subjects={allSubjects.map((subject) => ({
          id: subject.id,
          name: subject.name,
          code: subject.code,
        }))}
        selectedIds={selectedSubjectIds}
      />

      <section className={`${cardClassName} space-y-4`}>
        <h3 className="text-base font-semibold">Teachers in this section</h3>

        <AssignTeacherForm
          sectionId={section.id}
          teachers={availableTeachers}
          subjects={allSubjects
            .filter((subject) => selectedSubjectIds.includes(subject.id))
            .map((subject) => ({
              id: subject.id,
              name: subject.name,
              code: subject.code,
            }))}
        />

        {assignedTeachers.length === 0 ? (
          <p className="text-sm text-zinc-500">No teachers assigned yet.</p>
        ) : (
          <ul className="space-y-2">
            {assignedTeachers.map((teacher) => (
              <li
                key={teacher.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-zinc-200 px-3 py-3 dark:border-zinc-800"
              >
                <div>
                  <p className="text-sm font-medium">{teacher.name}</p>
                  <p className="text-xs text-zinc-500">
                    {teacher.email}
                    {teacher.employeeId ? ` · ${teacher.employeeId}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Subjects:{" "}
                    {teacher.subjects.length
                      ? teacher.subjects.join(", ")
                      : "None selected"}
                  </p>
                </div>
                <form action={removeTeacherFromSection}>
                  <input type="hidden" name="section_id" value={section.id} />
                  <input type="hidden" name="teacher_id" value={teacher.id} />
                  <button
                    type="submit"
                    className={`${buttonSecondaryClassName} text-red-600`}
                  >
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={`${cardClassName} space-y-4`}>
        <h3 className="text-base font-semibold">Head teachers</h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Permanent
            </p>
            {permanentHead ? (
              <div className="mt-2 flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">
                    {(() => {
                      const teacher = Array.isArray(permanentHead.teachers)
                        ? permanentHead.teachers[0]
                        : permanentHead.teachers;
                      const profile = teacher
                        ? Array.isArray(teacher.profiles)
                          ? teacher.profiles[0]
                          : teacher.profiles
                        : null;
                      return profile?.full_name ?? "Teacher";
                    })()}
                  </p>
                </div>
                <form action={removeHeadTeacher}>
                  <input type="hidden" name="id" value={permanentHead.id} />
                  <button
                    type="submit"
                    className={`${buttonSecondaryClassName} text-red-600`}
                  >
                    Remove
                  </button>
                </form>
              </div>
            ) : (
              <p className="mt-2 text-sm text-zinc-500">None appointed</p>
            )}
          </div>

          <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Temporary (active)
            </p>
            {temporaryHead ? (
              <div className="mt-2 flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">
                    {(() => {
                      const teacher = Array.isArray(temporaryHead.teachers)
                        ? temporaryHead.teachers[0]
                        : temporaryHead.teachers;
                      const profile = teacher
                        ? Array.isArray(teacher.profiles)
                          ? teacher.profiles[0]
                          : teacher.profiles
                        : null;
                      return profile?.full_name ?? "Teacher";
                    })()}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {temporaryHead.duration} · expires{" "}
                    {temporaryHead.expires_at
                      ? new Date(temporaryHead.expires_at).toLocaleString()
                      : "—"}
                  </p>
                </div>
                <form action={removeHeadTeacher}>
                  <input type="hidden" name="id" value={temporaryHead.id} />
                  <button
                    type="submit"
                    className={`${buttonSecondaryClassName} text-red-600`}
                  >
                    Remove
                  </button>
                </form>
              </div>
            ) : (
              <p className="mt-2 text-sm text-zinc-500">None active</p>
            )}
          </div>
        </div>

        <HeadTeacherForms
          sectionId={section.id}
          teachers={headCandidateTeachers}
        />

        {expiredTemps.length > 0 ? (
          <div>
            <p className="mb-2 text-sm font-medium">Expired temporary appointments</p>
            <ul className="space-y-1 text-sm text-zinc-500">
              {expiredTemps.map((row) => {
                const teacher = Array.isArray(row.teachers)
                  ? row.teachers[0]
                  : row.teachers;
                const profile = teacher
                  ? Array.isArray(teacher.profiles)
                    ? teacher.profiles[0]
                    : teacher.profiles
                  : null;
                return (
                  <li key={row.id}>
                    {profile?.full_name ?? "Teacher"} · {row.duration} · ended{" "}
                    {row.expires_at
                      ? new Date(row.expires_at).toLocaleDateString()
                      : "—"}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </section>
    </div>
  );
}
