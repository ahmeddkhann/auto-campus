import Link from "next/link";
import { notFound } from "next/navigation";

import { cardClassName } from "@/components/ui/field";
import { getAdmission } from "@/lib/dal/admissions";
import { listClassesWithSections } from "@/lib/dal/classes";

import { ReviewActions } from "./review-actions";

export const instant = false;

export default async function AdmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [admission, classes] = await Promise.all([
    getAdmission(id),
    listClassesWithSections(),
  ]);

  if (!admission) notFound();

  const classRow = Array.isArray(admission.classes)
    ? admission.classes[0]
    : admission.classes;

  const sectionsForClass = (classes.find((c) => c.id === admission.class_id)
    ?.sections ?? []) as Array<{ id: string; name: string }>;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/admissions"
        className="text-sm font-medium text-blue-600"
      >
        ← Back to admissions
      </Link>

      <div className={cardClassName}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{admission.student_name}</h2>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium capitalize dark:bg-zinc-900">
            {admission.status}
          </span>
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-zinc-500">Email</dt>
            <dd>{admission.email || "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Phone</dt>
            <dd>{admission.phone || "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Father</dt>
            <dd>{admission.father_name || "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Mother</dt>
            <dd>{admission.mother_name || "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Date of birth</dt>
            <dd>{admission.date_of_birth || "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Gender</dt>
            <dd>{admission.gender || "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Applied class</dt>
            <dd>{classRow?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Previous school</dt>
            <dd>{admission.previous_school || "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">Address</dt>
            <dd>{admission.address || "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Submitted</dt>
            <dd>{new Date(admission.submitted_at).toLocaleString()}</dd>
          </div>
          {admission.rejection_reason ? (
            <div className="sm:col-span-2">
              <dt className="text-zinc-500">Rejection reason</dt>
              <dd>{admission.rejection_reason}</dd>
            </div>
          ) : null}
        </dl>
      </div>

      {admission.status === "pending" ? (
        <ReviewActions
          admissionId={admission.id}
          sections={sectionsForClass.map((s) => ({
            id: s.id,
            label: s.name,
          }))}
        />
      ) : null}
    </div>
  );
}
