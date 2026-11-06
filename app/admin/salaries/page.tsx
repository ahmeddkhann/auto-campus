import Link from "next/link";

import {
  buttonSecondaryClassName,
  cardClassName,
} from "@/components/ui/field";
import { listSalaryBases } from "@/lib/dal/salaries";

import { ProcessSalariesForm } from "./process-form";

export const instant = false;

export default async function SalariesPage() {
  const { teachers, staff, principal } = await listSalaryBases();

  const employees = [
    ...teachers.map((t) => {
      const profile = Array.isArray(t.profiles) ? t.profiles[0] : t.profiles;
      return {
        key: `teacher:${t.id}`,
        label: `${profile?.full_name ?? "Teacher"} (Teacher)`,
        base: Number(t.salary ?? 0),
      };
    }),
    ...staff.map((s) => ({
      key: `support_staff:${s.id}`,
      label: `${s.full_name} (${s.designation || "Staff"})`,
      base: Number(s.salary ?? 0),
    })),
    ...principal.map((p) => ({
      key: `principal:${p.id}`,
      label: `${p.full_name} (Principal)`,
      base: Number(p.salary ?? 0),
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          View base salaries and process monthly payments with optional bonuses.
        </p>
        <Link
          href="/admin/salaries/payments"
          className={buttonSecondaryClassName}
        >
          Payment history
        </Link>
      </div>

      <div className={cardClassName}>
        <h3 className="mb-3 text-base font-semibold">Base salaries</h3>
        {employees.length === 0 ? (
          <p className="text-sm text-zinc-500">No employees found.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {employees.map((e) => (
              <li
                key={e.key}
                className="flex justify-between border-b border-zinc-100 py-2 dark:border-zinc-900"
              >
                <span>{e.label}</span>
                <span className="font-medium">{e.base.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ProcessSalariesForm employees={employees} />
    </div>
  );
}
