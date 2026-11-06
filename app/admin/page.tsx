import Link from "next/link";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const instant = false;

async function count(table: string) {
  const admin = createSupabaseAdmin();
  const { count } = await admin
    .from(table)
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const [teachers, students, admins, classes, subjects] = await Promise.all([
    count("teachers"),
    count("students"),
    createSupabaseAdmin()
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin")
      .then(({ count }) => count ?? 0),
    count("classes"),
    count("subjects"),
  ]);

  const cards = [
    { label: "Teachers", value: teachers, href: "/admin/teachers" },
    { label: "Students", value: students, href: "/admin/students" },
    { label: "Admins", value: admins, href: "/admin/admins" },
    { label: "Classes", value: classes, href: "/admin/classes" },
    { label: "Subjects", value: subjects, href: "/admin/subjects" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Manage people, classes, and school settings from the sidebar.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <p className="text-sm text-zinc-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
