"use client";

import { useActionState } from "react";

import { assignTeacherToSection } from "@/actions/sections";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export function AssignTeacherForm({
  sectionId,
  teachers,
  subjects,
}: {
  sectionId: string;
  teachers: Array<{ id: string; label: string }>;
  subjects: Array<{ id: string; name: string; code: string | null }>;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    assignTeacherToSection,
    null
  );

  if (teachers.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        All teachers are already assigned, or create teachers first.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-dashed border-zinc-300 p-3 dark:border-zinc-700">
      <p className="text-sm font-medium">Assign a teacher</p>
      <FormAlert error={state?.error} success={state?.success} />
      <input type="hidden" name="section_id" value={sectionId} />

      <div>
        <label htmlFor="teacher_id" className={labelClassName}>
          Teacher
        </label>
        <select
          id="teacher_id"
          name="teacher_id"
          required
          defaultValue=""
          className={fieldClassName}
        >
          <option value="" disabled>
            Select teacher
          </option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">
          Subjects this teacher teaches here
        </legend>
        {subjects.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Save section subjects above first.
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
                />
                {subject.name}
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending ? "Assigning..." : "Assign teacher"}
      </button>
    </form>
  );
}
