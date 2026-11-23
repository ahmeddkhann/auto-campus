"use client";

import { useActionState } from "react";

import { createVehicle, updateVehicle } from "@/actions/vehicles";
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
  name?: string;
  registration_number?: string | null;
  capacity?: number | null;
  monthly_fee?: number;
  is_active?: boolean;
};

export function VehicleForm({
  mode,
  defaults,
}: {
  mode: "create" | "edit";
  defaults?: Defaults;
}) {
  const action = mode === "create" ? createVehicle : updateVehicle;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    null
  );

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <h3 className="text-base font-semibold">
        {mode === "create" ? "Add vehicle" : "Edit vehicle"}
      </h3>
      <FormAlert error={state?.error} success={state?.success} />
      {defaults?.id ? <input type="hidden" name="id" value={defaults.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`name-${mode}`} className={labelClassName}>
            Name
          </label>
          <input
            id={`name-${mode}`}
            name="name"
            required
            defaultValue={defaults?.name ?? ""}
            className={fieldClassName}
          />
        </div>
        <div>
          <label
            htmlFor={`registration_number-${mode}`}
            className={labelClassName}
          >
            Registration number
          </label>
          <input
            id={`registration_number-${mode}`}
            name="registration_number"
            defaultValue={defaults?.registration_number ?? ""}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor={`capacity-${mode}`} className={labelClassName}>
            Capacity
          </label>
          <input
            id={`capacity-${mode}`}
            name="capacity"
            type="number"
            min={1}
            defaultValue={defaults?.capacity ?? ""}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor={`monthly_fee-${mode}`} className={labelClassName}>
            Monthly transport fee
          </label>
          <input
            id={`monthly_fee-${mode}`}
            name="monthly_fee"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={defaults?.monthly_fee ?? 0}
            className={fieldClassName}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={defaults?.is_active ?? true}
            />
            Active (available for student assignment and fee generation)
          </label>
        </div>
      </div>

      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending
          ? mode === "create"
            ? "Creating..."
            : "Saving..."
          : mode === "create"
            ? "Add vehicle"
            : "Save vehicle"}
      </button>
    </form>
  );
}
