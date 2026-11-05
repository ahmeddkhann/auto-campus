import Link from "next/link";

export default function AdmissionPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm font-semibold text-blue-600">
        ← Back home
      </Link>
      <h1 className="mt-8 text-3xl font-bold">Admissions</h1>
      <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-300">
        The online admission form will be available here. Until then, please
        contact the school office for enrolment information.
      </p>
    </main>
  );
}
