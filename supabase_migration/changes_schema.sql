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

-- Vehicles carry transport fees; students are assigned to a vehicle.
CREATE TABLE IF NOT EXISTS public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  registration_number text UNIQUE,
  capacity integer CHECK (capacity IS NULL OR capacity > 0),
  monthly_fee numeric NOT NULL DEFAULT 0 CHECK (monthly_fee >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vehicles_is_active ON public.vehicles (is_active);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_all_vehicles ON public.vehicles;
CREATE POLICY admin_all_vehicles
  ON public.vehicles
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

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_students_vehicle_id ON public.students (vehicle_id);

-- Transport fees may be vehicle-based (fee_structure_id null + vehicle_id set).
ALTER TABLE public.student_fees
  ALTER COLUMN fee_structure_id DROP NOT NULL;

ALTER TABLE public.student_fees
  ADD COLUMN IF NOT EXISTS vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_student_fees_vehicle_id ON public.student_fees (vehicle_id);

ALTER TABLE public.student_fees
  DROP CONSTRAINT IF EXISTS student_fees_student_id_fee_structure_id_month_year_key;

ALTER TABLE public.student_fees
  DROP CONSTRAINT IF EXISTS unique_student_fee_period;

ALTER TABLE public.student_fees
  DROP CONSTRAINT IF EXISTS student_fees_source_check;

ALTER TABLE public.student_fees
  ADD CONSTRAINT student_fees_source_check CHECK (
    (fee_structure_id IS NOT NULL AND vehicle_id IS NULL)
    OR (fee_structure_id IS NULL AND vehicle_id IS NOT NULL)
  );

CREATE UNIQUE INDEX IF NOT EXISTS idx_student_fees_structure_period
  ON public.student_fees (student_id, fee_structure_id, month, year)
  WHERE fee_structure_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_student_fees_vehicle_period
  ON public.student_fees (student_id, vehicle_id, month, year)
  WHERE vehicle_id IS NOT NULL;
