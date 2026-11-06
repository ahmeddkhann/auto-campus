"use client";

import { useActionState } from "react";

import { createFeeStructure } from "@/actions/fees";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export function FeeStructureForm({
  classes,
}: {
  classes: Array<{ id: string; name: string }>;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createFeeStructure,
    null
  );

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <h3 className="text-base font-semibold">Add fee structure</h3>
      <FormAlert error={state?.error} success={state?.success} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="class_id" className={labelClassName}>
            Class
          </label>
          <select
            id="class_id"
            name="class_id"
            required
            defaultValue=""
            className={fieldClassName}
          >
            <option value="" disabled>
              Select class
            </option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="fee_type" className={labelClassName}>
            Type
          </label>
          <select
            id="fee_type"
            name="fee_type"
            required
            defaultValue="tuition"
            className={fieldClassName}
          >
            <option value="tuition">Tuition</option>
            <option value="transport">Transport</option>
          </select>
        </div>
        <div>
          <label htmlFor="amount" className={labelClassName}>
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min={0}
            step="0.01"
            required
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="academic_year" className={labelClassName}>
            Academic year
          </label>
          <input
            id="academic_year"
            name="academic_year"
            required
            placeholder="2026-27"
            className={fieldClassName}
          />
        </div>
      </div>
      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending ? "Saving..." : "Add structure"}
      </button>
    </form>
  );
}
