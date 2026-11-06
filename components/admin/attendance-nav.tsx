import Link from "next/link";

const links = [
  { href: "/admin/attendance/teachers", label: "Mark" },
  { href: "/admin/attendance/teachers/history", label: "History" },
  { href: "/admin/attendance/reports", label: "Reports" },
];

export function AttendanceNav({ current }: { current: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            current === link.href
              ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
              : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
