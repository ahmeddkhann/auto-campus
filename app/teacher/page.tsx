import Link from "next/link";
import { redirect } from "next/navigation";

import { cardClassName } from "@/components/ui/field";
import { getTeacherIdForAuth } from "@/lib/dal/auth";
import {
  listActiveHeadSections,
  listAssignedSections,
  listStudentsInAssignedSections,
  listUpcomingTestsForTeacher,
} from "@/lib/dal/teacher-panel";

export const instant = false;

export default async function TeacherDashboardPage() {
  const teacherId = await getTeacherIdForAuth();
  if (!teacherId) redirect("/login?next=/teacher");

  const [sections, students, upcomingTests, headSections] = await Promise.all([
    listAssignedSections(teacherId),
    listStudentsInAssignedSections(teacherId),
    listUpcomingTestsForTeacher(teacherId, 5),
    listActiveHeadSections(teacherId),
  ]);

  const cards = [
    {
      label: "Assigned sections",
      value: sections.length,
      href: "/teacher/classes",
    },
    {
      label: "Active students",
      value: students.length,
      href: "/teacher/students",
    },
    {
      label: "Upcoming tests",
      value: upcomingTests.length,
      href: "/teacher/tests",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Your assigned classes, assessments, and attendance tools.
        </p>
      </div>

      {headSections.length > 0 ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
          You are the active head teacher for{" "}
          {headSections
            .map((s) => `${s.className} – ${s.sectionName}`)
            .join(", ")}
          .{" "}
          <Link href="/teacher/attendance" className="font-semibold underline">
            Mark student attendance
          </Link>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <p className="text-sm text-zinc-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className={cardClassName}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Upcoming tests</h3>
            <Link
              href="/teacher/tests/new"
              className="text-sm font-medium text-emerald-600"
            >
              Create test
            </Link>
          </div>
          {upcomingTests.length === 0 ? (
            <p className="text-sm text-zinc-500">No upcoming tests scheduled.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {upcomingTests.map((test) => {
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
                  <li key={test.id}>
                    <Link
                      href={`/teacher/tests/${test.id}`}
                      className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      <span>
                        <span className="font-medium">{test.title}</span>
                        <span className="ml-2 text-zinc-500">
                          {subject?.name}
                          {classRow?.name
                            ? ` · ${classRow.name} ${section?.name}`
                            : ""}
                        </span>
                      </span>
                      <span className="shrink-0 text-zinc-500">
                        {test.test_date ?? "No date"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className={cardClassName}>
          <h3 className="mb-3 font-semibold">Quick links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/teacher/tests/new"
                className="font-medium text-emerald-600"
              >
                Enter a new test
              </Link>
            </li>
            <li>
              <Link
                href="/teacher/exams/new"
                className="font-medium text-emerald-600"
              >
                Create an exam
              </Link>
            </li>
            <li>
              <Link
                href="/teacher/students"
                className="font-medium text-emerald-600"
              >
                Browse students
              </Link>
            </li>
            <li>
              <Link
                href="/teacher/my-attendance"
                className="font-medium text-emerald-600"
              >
                View my attendance
              </Link>
            </li>
            <li>
              <Link
                href="/teacher/salary"
                className="font-medium text-emerald-600"
              >
                View my salary
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
