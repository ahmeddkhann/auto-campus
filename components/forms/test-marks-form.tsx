"use client";

import { useActionState } from "react";

import { saveTestMarks } from "@/actions/tests";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

type StudentRow = {
  id: string;
  name: string;
  rollNumber: string;
  obtained: number | "";
  remarks: string;
};

export function TestMarksForm({
  testId,
  totalMarks,
  students,
}: {
  testId: string;
  totalMarks: number;
  students: StudentRow[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveTestMarks,
    null
  );

  if (students.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No active students in this section to enter marks for.
      </p>
    );
  }

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <FormAlert error={state?.error} success={state?.success} />
      <input type="hidden" name="test_id" value={testId} />
      <p className="text-sm text-zinc-500">
        Total marks: <span className="font-medium text-zinc-800 dark:text-zinc-100">{totalMarks}</span>
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="px-3 py-2 font-medium">Student</th>
              <th className="px-3 py-2 font-medium">Obtained</th>
              <th className="px-3 py-2 font-medium">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b border-zinc-100 dark:border-zinc-900"
              >
                <td className="px-3 py-3">
                  <input type="hidden" name="student_id" value={student.id} />
                  <p className="font-medium">{student.name}</p>
                  <p className="text-xs text-zinc-500">{student.rollNumber}</p>
                </td>
                <td className="px-3 py-3">
                  <input
                    name={`obtained_${student.id}`}
                    type="number"
                    min="0"
                    max={totalMarks}
                    step="0.5"
                    required
                    defaultValue={
                      student.obtained === "" ? undefined : student.obtained
                    }
                    className={fieldClassName}
                  />
                </td>
                <td className="px-3 py-3">
                  <input
                    name={`remarks_${student.id}`}
                    defaultValue={student.remarks}
                    className={fieldClassName}
                    placeholder="Optional"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending ? "Saving..." : "Save marks"}
      </button>
    </form>
  );
}
