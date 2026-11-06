import Link from "next/link";
import { notFound } from "next/navigation";

import { StudentForm } from "@/components/forms/student-form";
import { cardClassName } from "@/components/ui/field";
import { listSections } from "@/lib/dal/classes";
import {
  getStudentDetail,
  getStudentExamMarks,
  getStudentTestMarks,
} from "@/lib/dal/student-detail";

export const instant = false;

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [student, sections, testMarks, examMarks] = await Promise.all([
    getStudentDetail(id),
    listSections(),
    getStudentTestMarks(id),
    getStudentExamMarks(id),
  ]);

  if (!student) {
    notFound();
  }

  const section = Array.isArray(student.sections)
    ? student.sections[0]
    : student.sections;
  const classRow = section
    ? Array.isArray(section.classes)
      ? section.classes[0]
      : section.classes
    : null;

  const subjects = (student.student_subjects ?? [])
    .map((row: { subjects?: { name?: string; code?: string | null } | Array<{ name?: string; code?: string | null }> }) => {
      const subject = Array.isArray(row.subjects) ? row.subjects[0] : row.subjects;
      return subject;
    })
    .filter(Boolean);

  const sectionOptions = sections.map((item) => {
    const classItem = Array.isArray(item.classes) ? item.classes[0] : item.classes;
    return {
      id: item.id,
      label: classItem
        ? `${classItem.name} — Section ${item.name}`
        : item.name,
    };
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/admin/students" className="text-sm font-medium text-blue-600">
        ← Back to students
      </Link>

      <section className={cardClassName}>
        <h2 className="text-xl font-semibold">{student.full_name}</h2>
        <div className="mt-3 grid gap-2 text-sm text-zinc-600 dark:text-zinc-300 sm:grid-cols-2">
          <p>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              Roll:
            </span>{" "}
            {student.roll_number}
          </p>
          <p>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              Email:
            </span>{" "}
            {student.email || "—"}
          </p>
          <p>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              Class / Section:
            </span>{" "}
            {classRow
              ? `${classRow.name} — ${section?.name}`
              : section?.name || "—"}
          </p>
          <p>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              Status:
            </span>{" "}
            <span className="capitalize">{student.status}</span>
          </p>
          <p className="sm:col-span-2">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              Subjects:
            </span>{" "}
            {subjects.length
              ? subjects
                  .map((s) =>
                    s?.code ? `${s.name} (${s.code})` : s?.name
                  )
                  .join(", ")
              : "None yet — set subjects on the section"}
          </p>
        </div>
      </section>

      <section className={cardClassName}>
        <h3 className="mb-3 text-base font-semibold">Test marks</h3>
        {testMarks.length === 0 ? (
          <p className="text-sm text-zinc-500">No test marks recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Test</th>
                  <th className="px-3 py-2 font-medium">Subject</th>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Marks</th>
                </tr>
              </thead>
              <tbody>
                {testMarks.map((row) => {
                  const test = Array.isArray(row.tests) ? row.tests[0] : row.tests;
                  const subject = test
                    ? Array.isArray(test.subjects)
                      ? test.subjects[0]
                      : test.subjects
                    : null;
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="px-3 py-3">{test?.title ?? "—"}</td>
                      <td className="px-3 py-3">{subject?.name ?? "—"}</td>
                      <td className="px-3 py-3">
                        {test?.test_date
                          ? new Date(test.test_date).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-3 py-3">
                        {row.obtained_marks}
                        {test?.total_marks != null
                          ? ` / ${test.total_marks}`
                          : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={cardClassName}>
        <h3 className="mb-3 text-base font-semibold">Exam marks</h3>
        {examMarks.length === 0 ? (
          <p className="text-sm text-zinc-500">No exam marks recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Exam</th>
                  <th className="px-3 py-2 font-medium">Subject</th>
                  <th className="px-3 py-2 font-medium">Year</th>
                  <th className="px-3 py-2 font-medium">Marks</th>
                </tr>
              </thead>
              <tbody>
                {examMarks.map((row) => {
                  const exam = Array.isArray(row.exams) ? row.exams[0] : row.exams;
                  const subject = Array.isArray(row.subjects)
                    ? row.subjects[0]
                    : row.subjects;
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="px-3 py-3">{exam?.title ?? "—"}</td>
                      <td className="px-3 py-3">{subject?.name ?? "—"}</td>
                      <td className="px-3 py-3">
                        {exam?.academic_year ?? "—"}
                      </td>
                      <td className="px-3 py-3">
                        {row.obtained_marks} / {row.total_marks}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">Edit student</h3>
        <p className="text-sm text-zinc-500">
          Changing the section re-applies that section&apos;s subjects
          automatically. Confirm the new section carefully before saving.
        </p>
        <StudentForm
          mode="edit"
          sections={sectionOptions}
          defaults={{
            id: student.id,
            full_name: student.full_name ?? "",
            email: student.email ?? "",
            roll_number: student.roll_number ?? "",
            father_name: student.father_name ?? "",
            mother_name: student.mother_name ?? "",
            date_of_birth: student.date_of_birth ?? "",
            gender: student.gender ?? "",
            address: student.address ?? "",
            phone: student.phone ?? "",
            section_id: student.section_id,
            status: student.status ?? "active",
            uses_transport: Boolean(student.uses_transport),
          }}
        />
      </section>
    </div>
  );
}
