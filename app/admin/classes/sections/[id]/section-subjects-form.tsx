"use client";

import { useActionState } from "react";

import { updateSectionSubjects } from "@/actions/sections";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export function SectionSubjectsForm({
  sectionId,
  subjects,
  selectedIds,
}: {
  sectionId: string;
  subjects: Array<{ id: string; name: string; code: string | null }>;
  selectedIds: string[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateSectionSubjects,
    null
  );

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <div>
        <h3 className="text-base font-semibold">Subjects for this section</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Students in this section automatically get every selected subject.
        </p>
      </div>
      <FormAlert error={state?.error} success={state?.success} />
      <input type="hidden" name="section_id" value={sectionId} />

      {subjects.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Create subjects under Subjects first.
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {subjects.map((subject) => (
            <label
              key={subject.id}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800"
            >
              <input
                type="checkbox"
                name="subject_ids"
                value={subject.id}
                defaultChecked={selectedIds.includes(subject.id)}
              />
              {subject.name}
              {subject.code ? ` (${subject.code})` : ""}
            </label>
          ))}
        </div>
      )}

      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending ? "Saving..." : "Save subjects"}
      </button>
    </form>
  );
}
