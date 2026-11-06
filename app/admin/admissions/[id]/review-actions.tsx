"use client";

import { useActionState } from "react";

import { approveAdmission, rejectAdmission } from "@/actions/admissions";
import { FormAlert } from "@/components/ui/form-alert";
import {
  buttonPrimaryClassName,
  buttonSecondaryClassName,
  cardClassName,
  fieldClassName,
  labelClassName,
} from "@/components/ui/field";
import type { ActionState } from "@/lib/utils/action-state";

export function ReviewActions({
  admissionId,
  sections,
}: {
  admissionId: string;
  sections: Array<{ id: string; label: string }>;
}) {
  const [approveState, approveAction, approvePending] = useActionState<
    ActionState,
    FormData
  >(approveAdmission, null);
  const [rejectState, rejectAction, rejectPending] = useActionState<
    ActionState,
    FormData
  >(rejectAdmission, null);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form action={approveAction} className={`${cardClassName} space-y-4`}>
        <h3 className="text-base font-semibold">Approve</h3>
        <FormAlert error={approveState?.error} success={approveState?.success} />
        <input type="hidden" name="id" value={admissionId} />
        <div>
          <label htmlFor="section_id" className={labelClassName}>
            Place in section
          </label>
          <select
            id="section_id"
            name="section_id"
            required
            className={fieldClassName}
          >
            <option value="">Select section</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="roll_number" className={labelClassName}>
            Roll number
          </label>
          <input
            id="roll_number"
            name="roll_number"
            required
            className={fieldClassName}
          />
        </div>
        <button
          type="submit"
          disabled={approvePending || sections.length === 0}
          className={buttonPrimaryClassName}
        >
          {approvePending ? "Approving..." : "Approve & create student"}
        </button>
        {sections.length === 0 ? (
          <p className="text-xs text-amber-600">
            No sections exist for this class. Create one first.
          </p>
        ) : null}
      </form>

      <form action={rejectAction} className={`${cardClassName} space-y-4`}>
        <h3 className="text-base font-semibold">Reject</h3>
        <FormAlert error={rejectState?.error} success={rejectState?.success} />
        <input type="hidden" name="id" value={admissionId} />
        <div>
          <label htmlFor="rejection_reason" className={labelClassName}>
            Reason
          </label>
          <textarea
            id="rejection_reason"
            name="rejection_reason"
            required
            rows={3}
            className={fieldClassName}
          />
        </div>
        <button
          type="submit"
          disabled={rejectPending}
          className={buttonSecondaryClassName}
        >
          {rejectPending ? "Rejecting..." : "Reject application"}
        </button>
      </form>
    </div>
  );
}
