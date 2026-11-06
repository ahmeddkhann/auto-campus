"use client";

import { useActionState } from "react";

import { createMaintenanceCost } from "@/actions/maintenance";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export function MaintenanceForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createMaintenanceCost,
    null
  );
  const now = new Date();

  return (
    <form action={formAction} className={`${cardClassName} space-y-4`}>
      <h3 className="text-base font-semibold">Add expense</h3>
      <FormAlert error={state?.error} success={state?.success} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className={labelClassName}>
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            className={fieldClassName}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClassName}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="amount" className={labelClassName}>
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min={0.01}
            step="0.01"
            required
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="category" className={labelClassName}>
            Category
          </label>
          <input id="category" name="category" className={fieldClassName} />
        </div>
        <div>
          <label htmlFor="month" className={labelClassName}>
            Month
          </label>
          <input
            id="month"
            name="month"
            type="number"
            min={1}
            max={12}
            required
            defaultValue={now.getMonth() + 1}
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="year" className={labelClassName}>
            Year
          </label>
          <input
            id="year"
            name="year"
            type="number"
            required
            defaultValue={now.getFullYear()}
            className={fieldClassName}
          />
        </div>
      </div>
      <button type="submit" disabled={pending} className={buttonPrimaryClassName}>
        {pending ? "Saving..." : "Add expense"}
      </button>
    </form>
  );
}
