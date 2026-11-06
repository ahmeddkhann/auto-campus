"use client";

import { useActionState } from "react";

import { createStudent, updateStudent } from "@/actions/students";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

type Defaults = {
  id?: string;
  full_name?: string;
  email?: string;
  roll_number?: string;
  father_name?: string;
  mother_name?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  phone?: string;
  section_id?: string;
  status?: string;
  uses_transport?: boolean;
};

export function StudentForm({
  mode,
  defaults,
  sections,
}: {
  mode: "create" | "edit";
  defaults?: Defaults;
  sections: Array<{ id: string; label: string }>;
}) {
  const action = mode === "create" ? createStudent : updateStudent;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    null
  );

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <FormAlert error={state?.error} success={state?.success} />
      {defaults?.id ? <input type="hidden" name="id" value={defaults.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="full_name" className={labelClassName}>
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            required
            defaultValue={defaults?.full_name ?? ""}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClassName}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={defaults?.email ?? ""}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="roll_number" className={labelClassName}>
            Roll number
          </label>
          <input
            id="roll_number"
            name="roll_number"
            required
            defaultValue={defaults?.roll_number ?? ""}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClassName}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={defaults?.phone ?? ""}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="father_name" className={labelClassName}>
            Father name
          </label>
          <input
            id="father_name"
            name="father_name"
            defaultValue={defaults?.father_name ?? ""}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="mother_name" className={labelClassName}>
            Mother name
          </label>
          <input
            id="mother_name"
            name="mother_name"
            defaultValue={defaults?.mother_name ?? ""}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="date_of_birth" className={labelClassName}>
            Date of birth
          </label>
          <input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            defaultValue={defaults?.date_of_birth ?? ""}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="gender" className={labelClassName}>
            Gender
          </label>
          <input
            id="gender"
            name="gender"
            defaultValue={defaults?.gender ?? ""}
            className={fieldClassName}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="address" className={labelClassName}>
            Address
          </label>
          <input
            id="address"
            name="address"
            defaultValue={defaults?.address ?? ""}
            className={fieldClassName}
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
            defaultValue={defaults?.section_id ?? ""}
            className={fieldClassName}
          >
            <option value="" disabled>
              Select section
            </option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className={labelClassName}>
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={defaults?.status ?? "active"}
            className={fieldClassName}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="uses_transport"
              defaultChecked={defaults?.uses_transport ?? false}
            />
            Uses school transport (include transport fees when generated)
          </label>
        </div>
      </div>

      <p className="text-sm text-zinc-500">
        Subjects are applied automatically from the selected section&apos;s
        subject list. Manage those under Classes → section.
      </p>

      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending
          ? mode === "create"
            ? "Creating..."
            : "Saving..."
          : mode === "create"
            ? "Create student"
            : "Save student"}
      </button>
    </form>
  );
}
