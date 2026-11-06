import Link from "next/link";

export function PageActions({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <div className="flex justify-end">
      <Link
        href={href}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        {label}
      </Link>
    </div>
  );
}
