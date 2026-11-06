-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  role USER-DEFINED NOT NULL,
  avatar_url text,
  phone text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.classes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  sort_order integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT classes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT sections_pkey PRIMARY KEY (id),
  CONSTRAINT sections_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id)
);
CREATE TABLE public.subjects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT subjects_pkey PRIMARY KEY (id)
);
CREATE TABLE public.students (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid,
  roll_number text NOT NULL,
  full_name text NOT NULL,
  email text,
  father_name text,
  mother_name text,
  date_of_birth date,
  gender text,
  address text,
  phone text,
  avatar_url text,
  section_id uuid NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'active'::student_status,
  admitted_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT students_pkey PRIMARY KEY (id),
  CONSTRAINT students_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
  CONSTRAINT students_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id)
);
CREATE TABLE public.teachers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE,
  employee_id text UNIQUE,
  qualification text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  salary numeric NOT NULL DEFAULT 0,
  CONSTRAINT teachers_pkey PRIMARY KEY (id),
  CONSTRAINT teachers_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.teacher_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  section_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT teacher_sections_pkey PRIMARY KEY (id),
  CONSTRAINT teacher_sections_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id),
  CONSTRAINT teacher_sections_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id)
);
CREATE TABLE public.teacher_subjects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  subject_id uuid NOT NULL,
  section_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT teacher_subjects_pkey PRIMARY KEY (id),
  CONSTRAINT teacher_subjects_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id),
  CONSTRAINT teacher_subjects_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id),
  CONSTRAINT teacher_subjects_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id)
);
CREATE TABLE public.student_subjects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  subject_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT student_subjects_pkey PRIMARY KEY (id),
  CONSTRAINT student_subjects_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT student_subjects_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id)
);
CREATE TABLE public.section_subjects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL,
  subject_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT section_subjects_pkey PRIMARY KEY (id),
  CONSTRAINT section_subjects_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id),
  CONSTRAINT section_subjects_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id)
);
CREATE TABLE public.tests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject_id uuid NOT NULL,
  section_id uuid NOT NULL,
  teacher_id uuid NOT NULL,
  total_marks numeric NOT NULL,
  test_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tests_pkey PRIMARY KEY (id),
  CONSTRAINT tests_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id),
  CONSTRAINT tests_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id),
  CONSTRAINT tests_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id)
);
CREATE TABLE public.test_marks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL,
  student_id uuid NOT NULL,
  obtained_marks numeric NOT NULL,
  remarks text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT test_marks_pkey PRIMARY KEY (id),
  CONSTRAINT test_marks_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id),
  CONSTRAINT test_marks_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id)
);
CREATE TABLE public.exams (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  section_id uuid NOT NULL,
  teacher_id uuid NOT NULL,
  academic_year text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT exams_pkey PRIMARY KEY (id),
  CONSTRAINT exams_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id),
  CONSTRAINT exams_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id)
);
CREATE TABLE public.exam_marks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL,
  student_id uuid NOT NULL,
  subject_id uuid NOT NULL,
  total_marks numeric NOT NULL,
  obtained_marks numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT exam_marks_pkey PRIMARY KEY (id),
  CONSTRAINT exam_marks_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id),
  CONSTRAINT exam_marks_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT exam_marks_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id)
);
CREATE TABLE public.admissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  father_name text,
  mother_name text,
  date_of_birth date,
  gender text,
  phone text,
  email text,
  address text,
  class_id uuid NOT NULL,
  previous_school text,
  status USER-DEFINED NOT NULL DEFAULT 'pending'::admission_status,
  documents jsonb DEFAULT '[]'::jsonb,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  CONSTRAINT admissions_pkey PRIMARY KEY (id),
  CONSTRAINT admissions_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id),
  CONSTRAINT admissions_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.otp_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  used boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT otp_codes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  school_name text NOT NULL DEFAULT 'Auto Campus'::text,
  tagline text,
  logo_url text,
  hero_image_url text,
  primary_color text NOT NULL DEFAULT '#1a56db'::text,
  secondary_color text NOT NULL DEFAULT '#7e3af2'::text,
  accent_color text NOT NULL DEFAULT '#0e9f6e'::text,
  about_text text,
  contact_email text,
  contact_phone text,
  address text,
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  custom_sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  meta_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ai_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  enabled boolean NOT NULL DEFAULT false,
  chatbot_enabled boolean NOT NULL DEFAULT false,
  recommendations_enabled boolean NOT NULL DEFAULT false,
  n8n_webhook_url text,
  chatbot_webhook text,
  recommendations_webhook text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ai_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.section_head_teachers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  section_id uuid NOT NULL,
  teacher_id uuid NOT NULL,
  type USER-DEFINED NOT NULL DEFAULT 'permanent'::head_teacher_type,
  expires_at timestamp with time zone,
  duration text CHECK (duration = ANY (ARRAY['1d'::text, '3d'::text, '7d'::text, '15d'::text, '30d'::text])),
  appointed_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT section_head_teachers_pkey PRIMARY KEY (id),
  CONSTRAINT section_head_teachers_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id),
  CONSTRAINT section_head_teachers_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id),
  CONSTRAINT section_head_teachers_appointed_by_fkey FOREIGN KEY (appointed_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.student_attendance (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL,
  section_id uuid NOT NULL,
  date date NOT NULL,
  status USER-DEFINED NOT NULL,
  marked_by uuid NOT NULL,
  remarks text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT student_attendance_pkey PRIMARY KEY (id),
  CONSTRAINT student_attendance_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT student_attendance_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id),
  CONSTRAINT student_attendance_marked_by_fkey FOREIGN KEY (marked_by) REFERENCES public.teachers(id)
);
CREATE TABLE public.teacher_attendance (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  teacher_id uuid NOT NULL,
  date date NOT NULL,
  status USER-DEFINED NOT NULL,
  marked_by uuid NOT NULL,
  remarks text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT teacher_attendance_pkey PRIMARY KEY (id),
  CONSTRAINT teacher_attendance_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id),
  CONSTRAINT teacher_attendance_marked_by_fkey FOREIGN KEY (marked_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.support_staff (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  phone text,
  designation text,
  salary numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT support_staff_pkey PRIMARY KEY (id)
);
CREATE TABLE public.principal (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  phone text,
  email text,
  qualification text,
  salary numeric NOT NULL DEFAULT 0,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT principal_pkey PRIMARY KEY (id)
);
CREATE TABLE public.fee_structures (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  class_id uuid NOT NULL,
  fee_type USER-DEFINED NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0::numeric),
  academic_year text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT fee_structures_pkey PRIMARY KEY (id),
  CONSTRAINT fee_structures_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id)
);
CREATE TABLE public.student_fees (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL,
  fee_structure_id uuid NOT NULL,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL,
  gross_amount numeric NOT NULL CHECK (gross_amount >= 0::numeric),
  scholarship_discount numeric NOT NULL DEFAULT 0 CHECK (scholarship_discount >= 0::numeric),
  fine_amount numeric NOT NULL DEFAULT 0 CHECK (fine_amount >= 0::numeric),
  net_amount numeric NOT NULL CHECK (net_amount >= 0::numeric),
  status USER-DEFINED NOT NULL DEFAULT 'pending'::fee_status,
  due_date date NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT student_fees_pkey PRIMARY KEY (id),
  CONSTRAINT student_fees_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT student_fees_fee_structure_id_fkey FOREIGN KEY (fee_structure_id) REFERENCES public.fee_structures(id)
);
CREATE TABLE public.fee_payments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_fee_id uuid NOT NULL,
  amount_paid numeric NOT NULL CHECK (amount_paid > 0::numeric),
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  received_by uuid NOT NULL,
  remarks text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT fee_payments_pkey PRIMARY KEY (id),
  CONSTRAINT fee_payments_student_fee_id_fkey FOREIGN KEY (student_fee_id) REFERENCES public.student_fees(id),
  CONSTRAINT fee_payments_received_by_fkey FOREIGN KEY (received_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.student_fines (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  reason text NOT NULL,
  imposed_by uuid NOT NULL,
  is_paid boolean DEFAULT false,
  paid_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT student_fines_pkey PRIMARY KEY (id),
  CONSTRAINT student_fines_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT student_fines_imposed_by_fkey FOREIGN KEY (imposed_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.student_scholarships (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL,
  scholarship_percent numeric NOT NULL CHECK (scholarship_percent > 0::numeric AND scholarship_percent <= 100::numeric),
  reason text,
  granted_by uuid NOT NULL,
  academic_year text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT student_scholarships_pkey PRIMARY KEY (id),
  CONSTRAINT student_scholarships_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT student_scholarships_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.salary_payments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  employee_type text NOT NULL CHECK (employee_type = ANY (ARRAY['teacher'::text, 'support_staff'::text, 'principal'::text])),
  employee_id uuid NOT NULL,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL,
  base_salary numeric NOT NULL CHECK (base_salary >= 0::numeric),
  bonus numeric NOT NULL DEFAULT 0 CHECK (bonus >= 0::numeric),
  total_amount numeric NOT NULL CHECK (total_amount >= 0::numeric),
  paid_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT salary_payments_pkey PRIMARY KEY (id)
);
CREATE TABLE public.maintenance_costs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL,
  category text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT maintenance_costs_pkey PRIMARY KEY (id)
);