import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm font-semibold text-blue-600">
        ← Back home
      </Link>
      <h1 className="mt-8 text-3xl font-bold">About Auto Campus</h1>
      <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-300">
        Auto Campus is a school management system for administrators and
        teachers. It brings admissions, classes, attendance, assessments, fees,
        and website management together in one place.
      </p>
    </main>
  );
}
