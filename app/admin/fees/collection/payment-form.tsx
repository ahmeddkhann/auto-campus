"use client";

import { useActionState } from "react";

import { recordFeePayment } from "@/actions/fees";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export function FeePaymentForm({
  studentFeeId,
  maxAmount,
}: {
  studentFeeId: string;
  maxAmount: number;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    recordFeePayment,
    null
  );

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-4">
      <input type="hidden" name="student_fee_id" value={studentFeeId} />
      <FormAlert error={state?.error} success={state?.success} />
      <div>
        <label className={labelClassName}>Amount</label>
        <input
          name="amount_paid"
          type="number"
          min={0.01}
          max={maxAmount}
          step="0.01"
          required
          defaultValue={maxAmount}
          className={fieldClassName}
        />
      </div>
      <div>
        <label className={labelClassName}>Date</label>
        <input
          name="payment_date"
          type="date"
          required
          defaultValue={new Date().toISOString().slice(0, 10)}
          className={fieldClassName}
        />
      </div>
      <div>
        <label className={labelClassName}>Remarks</label>
        <input name="remarks" className={fieldClassName} />
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          disabled={pending}
          className={buttonPrimaryClassName}
        >
          {pending ? "Saving..." : "Record payment"}
        </button>
      </div>
    </form>
  );
}
