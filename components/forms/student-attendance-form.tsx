"use client";

import { useActionState } from "react";

import { saveStudentAttendance } from "@/actions/attendance";
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
  status: "present" | "absent" | "leave";
  remarks: string;
};

export function StudentAttendanceForm({
  date,
  sectionId,
  students,
}: {
  date: string;
  sectionId: string;
  students: StudentRow[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveStudentAttendance,
    null
  );

  if (students.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No active students in this section.
      </p>
    );
  }

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <FormAlert error={state?.error} success={state?.success} />
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="section_id" value={sectionId} />

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="px-3 py-2 font-medium">Student</th>
              <th className="px-3 py-2 font-medium">Status</th>
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
                  <select
                    name={`status_${student.id}`}
                    defaultValue={student.status}
                    className={fieldClassName}
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="leave">Leave</option>
                  </select>
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
        {pending ? "Saving..." : "Save attendance"}
      </button>
    </form>
  );
}
