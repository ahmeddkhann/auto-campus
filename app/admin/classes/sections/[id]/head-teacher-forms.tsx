"use client";

import { useActionState } from "react";

import {
  appointPermanentHeadTeacher,
  appointTemporaryHeadTeacher,
} from "@/actions/sections";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export function HeadTeacherForms({
  sectionId,
  teachers,
}: {
  sectionId: string;
  teachers: Array<{ id: string; label: string }>;
}) {
  const [permanentState, permanentAction, permanentPending] = useActionState<
    ActionState,
    FormData
  >(appointPermanentHeadTeacher, null);

  const [temporaryState, temporaryAction, temporaryPending] = useActionState<
    ActionState,
    FormData
  >(appointTemporaryHeadTeacher, null);

  if (teachers.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Assign teachers to this section before appointing a head teacher.
      </p>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form
        action={permanentAction}
        className="space-y-3 rounded-lg border border-dashed border-zinc-300 p-3 dark:border-zinc-700"
      >
        <p className="text-sm font-medium">Appoint permanent head</p>
        <FormAlert
          error={permanentState?.error}
          success={permanentState?.success}
        />
        <input type="hidden" name="section_id" value={sectionId} />
        <div>
          <label htmlFor="permanent_teacher_id" className={labelClassName}>
            Teacher
          </label>
          <select
            id="permanent_teacher_id"
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
        <button
          type="submit"
          disabled={permanentPending}
          className={buttonPrimaryClassName}
        >
          {permanentPending ? "Saving..." : "Appoint permanent"}
        </button>
      </form>

      <form
        action={temporaryAction}
        className="space-y-3 rounded-lg border border-dashed border-zinc-300 p-3 dark:border-zinc-700"
      >
        <p className="text-sm font-medium">Appoint temporary head</p>
        <FormAlert
          error={temporaryState?.error}
          success={temporaryState?.success}
        />
        <input type="hidden" name="section_id" value={sectionId} />
        <div>
          <label htmlFor="temporary_teacher_id" className={labelClassName}>
            Teacher
          </label>
          <select
            id="temporary_teacher_id"
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
        <div>
          <label htmlFor="duration" className={labelClassName}>
            Duration
          </label>
          <select
            id="duration"
            name="duration"
            required
            defaultValue="7d"
            className={fieldClassName}
          >
            <option value="1d">1 day</option>
            <option value="3d">3 days</option>
            <option value="7d">7 days</option>
            <option value="15d">15 days</option>
            <option value="30d">30 days</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={temporaryPending}
          className={buttonPrimaryClassName}
        >
          {temporaryPending ? "Saving..." : "Appoint temporary"}
        </button>
      </form>
    </div>
  );
}
