import Link from "next/link";

import { deleteSection } from "@/actions/classes";
import {
  buttonSecondaryClassName,
  cardClassName,
} from "@/components/ui/field";
import { listClassesWithSections } from "@/lib/dal/classes";

import { CreateSectionForm } from "./create-section-form";

export const instant = false;

export default async function AdminClassesPage() {
  const classes = await listClassesWithSections();

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Add sections under each class, then open a section to assign subjects,
        teachers, and head teachers.
      </p>

      <CreateSectionForm
        classes={classes.map((item) => ({ id: item.id, name: item.name }))}
      />

      <div className="space-y-4">
        {classes.map((item) => {
          const sections = Array.isArray(item.sections) ? item.sections : [];

          return (
            <section key={item.id} className={cardClassName}>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-zinc-500">
                  {sections.length} section{sections.length === 1 ? "" : "s"}
                </p>
              </div>

              {sections.length === 0 ? (
                <p className="text-sm text-zinc-500">No sections yet.</p>
              ) : (
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li
                      key={section.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800"
                    >
                      <span className="text-sm font-medium">
                        Section {section.name}
                      </span>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/classes/sections/${section.id}`}
                          className={buttonSecondaryClassName}
                        >
                          Manage
                        </Link>
                        <form action={deleteSection}>
                          <input type="hidden" name="id" value={section.id} />
                          <button
                            type="submit"
                            className={`${buttonSecondaryClassName} text-red-600`}
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
