import Link from "next/link";

export function PageActions({
  href,
  label,
  tone = "admin",
}: {
  href: string;
  label: string;
  tone?: "admin" | "teacher";
}) {
  const className =
    tone === "teacher"
      ? "rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
      : "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700";

  return (
    <div className="flex justify-end">
      <Link href={href} className={className}>
        {label}
      </Link>
    </div>
  );
}
