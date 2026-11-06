import { deleteFeeStructure } from "@/actions/fees";
import { FeeNav } from "@/components/admin/fee-nav";
import {
  buttonSecondaryClassName,
  cardClassName,
} from "@/components/ui/field";
import { listClassesWithSections } from "@/lib/dal/classes";
import { listFeeStructures } from "@/lib/dal/fees";

import { FeeStructureForm } from "./structure-form";

export const instant = false;

export default async function FeeStructuresPage() {
  const [structures, classes] = await Promise.all([
    listFeeStructures(),
    listClassesWithSections(),
  ]);

  return (
    <div className="space-y-6">
      <FeeNav current="/admin/fees/structures" />
      <p className="text-sm text-zinc-500">
        Define tuition and transport amounts per class and academic year.
      </p>

      <FeeStructureForm
        classes={classes.map((c) => ({ id: c.id, name: c.name }))}
      />

      <div className={cardClassName}>
        {structures.length === 0 ? (
          <p className="text-sm text-zinc-500">No fee structures yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Class</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Year</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {structures.map((row) => {
                  const classRow = Array.isArray(row.classes)
                    ? row.classes[0]
                    : row.classes;
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="px-3 py-3">{classRow?.name}</td>
                      <td className="px-3 py-3 capitalize">{row.fee_type}</td>
                      <td className="px-3 py-3">
                        {Number(row.amount).toFixed(2)}
                      </td>
                      <td className="px-3 py-3">{row.academic_year}</td>
                      <td className="px-3 py-3">
                        <form action={deleteFeeStructure}>
                          <input type="hidden" name="id" value={row.id} />
                          <button
                            type="submit"
                            className={`${buttonSecondaryClassName} text-red-600`}
                          >
                            Delete
                          </button>
                        </form>
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
