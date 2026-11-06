-- Manual schema changes for Auto Campus.
-- Run this in the Supabase SQL editor.

-- Student email for enrollment confirmation emails.
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS email text;

CREATE INDEX IF NOT EXISTS idx_students_email ON public.students (email);

-- Transport opt-in for fee generation.
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS uses_transport boolean NOT NULL DEFAULT false;

-- Subjects offered in a section.
CREATE TABLE IF NOT EXISTS public.section_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (section_id, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_section_subjects_section_id
  ON public.section_subjects (section_id);

CREATE INDEX IF NOT EXISTS idx_section_subjects_subject_id
  ON public.section_subjects (subject_id);

ALTER TABLE public.section_subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_all_section_subjects ON public.section_subjects;
CREATE POLICY admin_all_section_subjects
  ON public.section_subjects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

DROP POLICY IF EXISTS teacher_select_section_subjects ON public.section_subjects;
CREATE POLICY teacher_select_section_subjects
  ON public.section_subjects
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'teacher'
    )
  );

-- Optional rejection reason for admissions.
ALTER TABLE public.admissions
  ADD COLUMN IF NOT EXISTS rejection_reason text;

-- One salary payment per employee per month/year.
CREATE UNIQUE INDEX IF NOT EXISTS idx_salary_payments_employee_period
  ON public.salary_payments (employee_type, employee_id, month, year);
