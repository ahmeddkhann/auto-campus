import { deactivateScholarship } from "@/actions/scholarships";
import {
  buttonSecondaryClassName,
  cardClassName,
  fieldClassName,
} from "@/components/ui/field";
import {
  listScholarships,
  listStudentsForSelect,
} from "@/lib/dal/scholarships";

import { GrantScholarshipForm } from "./grant-form";

export const instant = false;

export default async function ScholarshipsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; active?: string }>;
}) {
  const params = await searchParams;
  const activeOnly = params.active === "1";
  const [scholarships, students] = await Promise.all([
    listScholarships({
      academicYear: params.year,
      activeOnly: activeOnly || undefined,
    }),
    listStudentsForSelect(),
  ]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Percentage scholarships apply to tuition fees when monthly fees are
        generated.
      </p>

      <GrantScholarshipForm
        students={students.map((s) => ({
          id: s.id,
          label: `${s.full_name} (${s.roll_number})`,
        }))}
      />

      <form className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-3">
        <input
          name="year"
          defaultValue={params.year ?? ""}
          placeholder="Academic year e.g. 2026-27"
          className={fieldClassName}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="active"
            value="1"
            defaultChecked={activeOnly}
          />
          Active only
        </label>
        <button
          type="submit"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700"
        >
          Filter
        </button>
      </form>

      <div className={cardClassName}>
        {scholarships.length === 0 ? (
          <p className="text-sm text-zinc-500">No scholarships found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Student</th>
                  <th className="px-3 py-2 font-medium">%</th>
                  <th className="px-3 py-2 font-medium">Year</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scholarships.map((row) => {
                  const student = Array.isArray(row.students)
                    ? row.students[0]
                    : row.students;
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="px-3 py-3">
                        {student?.full_name}
                        <span className="ml-2 text-xs text-zinc-500">
                          {student?.roll_number}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {Number(row.scholarship_percent)}%
                      </td>
                      <td className="px-3 py-3">{row.academic_year}</td>
                      <td className="px-3 py-3">
                        {row.is_active ? "Active" : "Inactive"}
                      </td>
                      <td className="px-3 py-3">
                        {row.is_active ? (
                          <form action={deactivateScholarship}>
                            <input type="hidden" name="id" value={row.id} />
                            <button
                              type="submit"
                              className={buttonSecondaryClassName}
                            >
                              Deactivate
                            </button>
                          </form>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
