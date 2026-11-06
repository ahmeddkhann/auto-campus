"use client";

import { useActionState } from "react";

import { saveTeacherAttendance } from "@/actions/attendance";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

type TeacherRow = {
  id: string;
  name: string;
  employeeId: string;
  status: "present" | "absent" | "leave";
  remarks: string;
};

export function BulkAttendanceForm({
  date,
  teachers,
}: {
  date: string;
  teachers: TeacherRow[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveTeacherAttendance,
    null
  );

  if (teachers.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Add teachers first before marking attendance.
      </p>
    );
  }

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <FormAlert error={state?.error} success={state?.success} />
      <input type="hidden" name="date" value={date} />

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="px-3 py-2 font-medium">Teacher</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr
                key={teacher.id}
                className="border-b border-zinc-100 dark:border-zinc-900"
              >
                <td className="px-3 py-3">
                  <input type="hidden" name="teacher_id" value={teacher.id} />
                  <p className="font-medium">{teacher.name}</p>
                  <p className="text-xs text-zinc-500">{teacher.employeeId}</p>
                </td>
                <td className="px-3 py-3">
                  <select
                    name={`status_${teacher.id}`}
                    defaultValue={teacher.status}
                    className={fieldClassName}
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="leave">Leave</option>
                  </select>
                </td>
                <td className="px-3 py-3">
                  <input
                    name={`remarks_${teacher.id}`}
                    defaultValue={teacher.remarks}
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
