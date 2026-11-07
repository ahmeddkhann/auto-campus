"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";

import { createTest } from "@/actions/tests";
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

type SubjectOption = {
  subjectId: string;
  sectionId: string;
  label: string;
};

export function TestForm({
  sections,
  subjects,
}: {
  sections: SectionOption[];
  subjects: SubjectOption[];
}) {
  const [sectionId, setSectionId] = useState(sections[0]?.sectionId ?? "");
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createTest,
    null
  );

  const filteredSubjects = useMemo(
    () => subjects.filter((s) => s.sectionId === sectionId),
    [subjects, sectionId]
  );

  if (sections.length === 0) {
    return (
      <div className={cardClassName}>
        <p className="text-sm text-zinc-500">
          You need at least one assigned section before creating a test.
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
          placeholder="Chapter 3 quiz"
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
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
          className={fieldClassName}
        >
          {sections.map((section) => (
            <option key={section.sectionId} value={section.sectionId}>
              {section.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="subject_id" className={labelClassName}>
          Subject
        </label>
        <select
          id="subject_id"
          name="subject_id"
          required
          className={fieldClassName}
          disabled={filteredSubjects.length === 0}
          defaultValue={filteredSubjects[0]?.subjectId}
          key={sectionId}
        >
          {filteredSubjects.length === 0 ? (
            <option value="">No subjects for this section</option>
          ) : (
            filteredSubjects.map((subject) => (
              <option key={subject.subjectId} value={subject.subjectId}>
                {subject.label}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="total_marks" className={labelClassName}>
            Total marks
          </label>
          <input
            id="total_marks"
            name="total_marks"
            type="number"
            min="1"
            step="0.5"
            required
            defaultValue={20}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="test_date" className={labelClassName}>
            Test date
          </label>
          <input
            id="test_date"
            name="test_date"
            type="date"
            className={fieldClassName}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending || filteredSubjects.length === 0}
        className={buttonPrimaryClassName}
      >
        {pending ? "Creating..." : "Create test"}
      </button>
    </form>
  );
}
