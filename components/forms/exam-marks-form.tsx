"use client";

import { useActionState } from "react";

import { saveExamMarks } from "@/actions/exams";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

type MarkRow = {
  key: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  subjectId: string;
  subjectName: string;
  total: number | "";
  obtained: number | "";
};

export function ExamMarksForm({
  examId,
  rows,
}: {
  examId: string;
  rows: MarkRow[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveExamMarks,
    null
  );

  if (rows.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Assign subjects for this section first, or wait until students are enrolled.
      </p>
    );
  }

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <FormAlert error={state?.error} success={state?.success} />
      <input type="hidden" name="exam_id" value={examId} />

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="px-3 py-2 font-medium">Student</th>
              <th className="px-3 py-2 font-medium">Subject</th>
              <th className="px-3 py-2 font-medium">Total</th>
              <th className="px-3 py-2 font-medium">Obtained</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.key}
                className="border-b border-zinc-100 dark:border-zinc-900"
              >
                <td className="px-3 py-3">
                  <input type="hidden" name="entry_key" value={row.key} />
                  <p className="font-medium">{row.studentName}</p>
                  <p className="text-xs text-zinc-500">{row.rollNumber}</p>
                </td>
                <td className="px-3 py-3">{row.subjectName}</td>
                <td className="px-3 py-3">
                  <input
                    name={`total_${row.key}`}
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    defaultValue={row.total === "" ? 100 : row.total}
                    className={fieldClassName}
                  />
                </td>
                <td className="px-3 py-3">
                  <input
                    name={`obtained_${row.key}`}
                    type="number"
                    min="0"
                    step="0.5"
                    required
                    defaultValue={
                      row.obtained === "" ? undefined : row.obtained
                    }
                    className={fieldClassName}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending ? "Saving..." : "Save exam marks"}
      </button>
    </form>
  );
}
