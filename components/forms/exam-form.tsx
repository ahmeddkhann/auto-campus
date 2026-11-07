"use client";

import { useActionState } from "react";

import { createExam } from "@/actions/exams";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

type SectionOption = {
  sectionId: string;
  label: string;
};

export function ExamForm({ sections }: { sections: SectionOption[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createExam,
    null
  );

  if (sections.length === 0) {
    return (
      <div className={cardClassName}>
        <p className="text-sm text-zinc-500">
          You need at least one assigned section before creating an exam.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <FormAlert error={state?.error} success={state?.success} />

      <div>
        <label htmlFor="title" className={labelClassName}>
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          className={fieldClassName}
          placeholder="Midterm exam"
        />
      </div>

      <div>
        <label htmlFor="section_id" className={labelClassName}>
          Section
        </label>
        <select
          id="section_id"
          name="section_id"
          required
          className={fieldClassName}
          defaultValue={sections[0]?.sectionId}
        >
          {sections.map((section) => (
            <option key={section.sectionId} value={section.sectionId}>
              {section.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="academic_year" className={labelClassName}>
          Academic year
        </label>
        <input
          id="academic_year"
          name="academic_year"
          className={fieldClassName}
          placeholder="2026-27"
        />
      </div>

      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending ? "Creating..." : "Create exam"}
      </button>
    </form>
  );
}
