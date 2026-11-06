import Link from "next/link";

import { listClassesForAdmission } from "@/lib/dal/admissions";

import { PublicAdmissionForm } from "./admission-form";

export const instant = false;

export default async function AdmissionPage() {
  const classes = await listClassesForAdmission();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm font-semibold text-blue-600">
        ← Back home
      </Link>
      <h1 className="mt-8 text-3xl font-bold">Admissions</h1>
      <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-300">
        Submit an enrolment application. An administrator will review it and
        place the student in a class section if approved.
      </p>

      <div className="mt-8">
        <PublicAdmissionForm
          classes={classes.map((c) => ({ id: c.id, label: c.name }))}
        />
      </div>
    </main>
  );
}
