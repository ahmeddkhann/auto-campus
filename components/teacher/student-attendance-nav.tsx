import Link from "next/link";

const links = [
  { href: "/teacher/attendance", label: "Mark" },
  { href: "/teacher/attendance/history", label: "History" },
];

export function StudentAttendanceNav({ current }: { current: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            current === link.href
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
