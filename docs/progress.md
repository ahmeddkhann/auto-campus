# Auto Campus — Progress Tracker

> Last updated: Nov 7, 2026

---

## Current Status

| Phase | Name                     | Status         | Progress |
| ----- | ------------------------ | -------------- | -------- |
| 1     | Foundation & Database    | ✅ Complete    | 100%     |
| 2     | Authentication           | ✅ Complete    | 100%     |
| 3     | Admin Panel              | 🟡 In Progress | 85%      |
| 4     | Teacher Panel            | ✅ Complete    | 100%     |
| 5     | Admission System         | 🟡 In Progress | 60%      |
| 6     | Customizable Website     | 🔲 Not Started | 0%       |
| 7     | AI Integration           | 🔲 Not Started | 0%       |

**Overall Progress**: ~70% — Teacher panel complete (dashboard, classes, students, tests, exams, head attendance, own attendance, profile, salary). Website theming, AI, and avatar upload still pending.

---

## Changelog

### Nov 7, 2026
- ✅ Teacher panel shell (`/teacher` layout, sidebar, header; emerald theme)
- ✅ Teacher dashboard overview (assigned sections, students, upcoming tests, head badge)
- ✅ My classes + section detail; students list with filters
- ✅ Tests: create + enter/edit marks (scoped to assignments)
- ✅ Exams: create + per-subject marks (scoped to assigned subjects)
- ✅ Student attendance mark/history for active head teachers only (nav Option B)
- ✅ Own attendance history (`/teacher/my-attendance`)
- ✅ Teacher profile update + read-only My salary (`/teacher/salary`)
- ✅ Teacher assignment matrix (`/admin/teachers/assignments`)
- ✅ Global head-teacher overview (`/admin/head-teachers`)
- ✅ Student detail with subjects + marks history; `uses_transport` on student form
- ✅ Teacher attendance mark / history / reports
- ✅ Support staff CRUD + principal upsert
- ✅ Scholarships grant/list/deactivate; fines impose/list/mark paid
- ✅ Fees: structures → generate → collection → reports
- ✅ Salaries overview + monthly process + payment history
- ✅ Maintenance costs CRUD + monthly summary
- ✅ Admission review approve/reject + minimal public `/admission` form
- ✅ Sidebar/nav titles updated for new admin modules
- ✅ `changes_schema.sql`: `uses_transport`, `rejection_reason`, salary unique index
- ✅ Teachers created without section/subject assignment (assign later on section page)
- ✅ Students created without subject picker; auto-enrolled in section subjects
- ✅ Section management page: subjects, teachers, permanent/temporary head teachers
- ✅ Added `section_subjects` to `changes_schema.sql` (apply manually in Supabase)

### Nov 6, 2026
- ✅ Admin layout with left sidebar, header, logout
- ✅ Site settings page (`site_settings`)
- ✅ Admin profile page (own details + optional password)
- ✅ Classes/sections and subjects minimal CRUD
- ✅ Admins: add + read-only list; welcome email with credentials
- ✅ Teachers: full CRUD, class/subject filters, welcome email
- ✅ Students: full CRUD, class/subject filters, enrollment confirmation email (no credentials)
- ✅ Login: OTP required for admins only; teachers skip OTP
- ✅ Removed public signup CTA from landing/navbar
- ✅ Added `supabase_migration/changes_schema.sql` — `students.email` + index (apply manually in Supabase)

### Oct 30, 2026
- ✅ Updated `attendance_status` enum: changed from `(present, absent, late, excused)` to `(present, absent, leave)`
- ✅ Designed financial system: fees, fines, scholarships, salaries, support staff, principal, maintenance
- ✅ Created `migrations/financial_system.sql` — 9 logical migrations:
  - `create_financial_enums` — `fee_type`, `fee_status`
  - `alter_teachers_add_salary` — adds `salary` column to existing `teachers` table
  - `create_staff_tables` — `support_staff`, `principal`
  - `create_fee_tables` — `fee_structures`, `student_fees`, `fee_payments` with 8 indexes
  - `create_fines_and_scholarships` — `student_fines`, `student_scholarships` with 6 indexes
  - `create_salary_payments` — unified salary + bonus table with 3 indexes
  - `create_maintenance_costs` — monthly expenses with 2 indexes
  - `setup_financial_rls` — 10 RLS policies across 9 tables
  - `create_financial_triggers` — `updated_at` triggers for 7 tables
- ✅ Updated all docs: `technical_report.md` (new tables, enums, ER diagram, indexes, RLS, routes, components, features 7.7), `plan.md` (Phase 1 + Phase 3 financial sections), `progress.md`
- ⏳ Pending: Apply `migrations/attendance_system.sql` and `migrations/financial_system.sql`

### Oct 29, 2026
- ✅ Designed attendance system: head teacher assignments + student/teacher attendance
- ✅ Created `migrations/attendance_system.sql` — 6 logical migrations:
  - `create_attendance_enums` — `head_teacher_type`, `attendance_status`
  - `create_section_head_teachers` — table with partial unique indexes + CHECK constraint
  - `create_attendance_tables` — `student_attendance`, `teacher_attendance` with 11 indexes
  - `create_attendance_helper_function` — `is_active_head_teacher()`, `get_teacher_id_for_auth()`
  - `setup_attendance_rls` — 8 RLS policies across 3 new tables
  - `create_attendance_triggers` — `updated_at` auto-update triggers for 3 tables
- ✅ Updated `technical_report.md` — new tables, enums, helper functions, RLS policies, routes, components, indexes, feature section 7.6
- ✅ Updated `plan.md` — attendance tasks added to Phase 1, Phase 3 (admin), Phase 4 (teacher)
- ✅ Updated `progress.md` — attendance tasks added across phases, decision log updated
- ⏳ Pending: Apply `migrations/attendance_system.sql` to Supabase project

### Oct 28, 2026
- ✅ Created Next.js 16.4.3 project with Tailwind CSS 4 and TypeScript
- ✅ Connected Supabase MCP (project: `gtohzjvixvetzivcbzbq`)
- ✅ Confirmed empty database — no tables yet
- ✅ Authored `technical_report.md` — full system design and schema
- ✅ Authored `plan.md` — 7-phase implementation plan
- ✅ Authored `progress.md` — this file
- ✅ Applied 12 database migrations via Supabase MCP:
  - `create_enums` — user_role, admission_status, student_status
  - `create_core_tables` — profiles, classes, sections, subjects
  - `create_user_tables` — students, teachers
  - `create_pivot_tables` — teacher_sections, teacher_subjects, student_subjects
  - `create_assessment_tables` — tests, test_marks, exams, exam_marks
  - `create_application_tables` — admissions, otp_codes
  - `create_settings_tables` — site_settings, ai_settings
  - `create_updated_at_triggers_and_indexes` — auto-update triggers + 28 indexes
  - `setup_rls_policies` — 39 role-based policies across 17 tables
  - `seed_default_data` — 14 classes, default site_settings, default ai_settings
  - `security_hardening` — fixed search_path, scoped policies to authenticated
  - `revoke_public_execute_on_helpers` — locked down SECURITY DEFINER functions
- ✅ Verified: 17 tables, all RLS enabled, seed data confirmed, security advisor clean
- ✅ Created 3 Supabase Storage buckets with RLS policies:
  - `avatars` (private, 5 MB, images) — authenticated users upload to own folder
  - `school-assets` (public, 10 MB, images + SVG/ICO) — admin-only uploads
  - `documents` (private, 10 MB, images + PDF) — public insert under `admissions/`, admin-only read
  - 10 storage RLS policies total across all buckets
- ✅ Added 9 performance indexes (37 custom indexes total):
  - `idx_students_roll_number` — student lookup by roll number
  - `idx_students_section_status` — active students per section (composite)
  - `idx_tests_test_date`, `idx_tests_section_date` — test date queries
  - `idx_exams_academic_year` — exam year filtering
  - `idx_admissions_submitted_at`, `idx_admissions_status_submitted` — admission sorting
  - `idx_classes_sort_order` — ordered class listing
  - `idx_otp_codes_active` — partial index for unused OTP verification
- ✅ Updated `technical_report.md` — storage section (buckets, RLS, upload patterns), full index catalog

---

## Phase 1: Foundation & Database Setup
**Status**: ✅ Complete

- [x] Install core dependencies (Supabase, Zod, etc.)
- [ ] Initialize shadcn/ui (deferred — using Tailwind forms for now)
- [x] Create folder structure (`lib/`, `components/`, route groups)
- [x] Set up Supabase clients (browser, server, admin)
- [x] Create `.env.local` with environment variables
- [x] Write and apply database migration (all tables + enums)
- [x] Set up Row-Level Security (RLS) policies
- [x] Seed default data (classes, site_settings, ai_settings)
- [x] Attendance + financial tables present in live schema dump
- [ ] Generate TypeScript types from Supabase schema
- [ ] Apply `supabase_migration/changes_schema.sql` (`students.email`) manually

---

## Phase 2: Authentication
**Status**: ✅ Complete

- [x] Implement session management (JWT encrypt/decrypt via Jose)
- [x] Implement OTP generation, hashing, storage
- [x] Implement Nodemailer SMTP transport
- [x] Build login page (email + password)
- [x] Build OTP verification page (admins only)
- [x] Teachers skip OTP after password login
- [x] Logout functionality
- [x] Set up `proxy.ts` for route protection
- [x] Create Data Access Layer (`verifySession`, `getUser`, `requireAdmin`)
- [x] Public signup CTA removed from landing (bootstrap `/signup` route retained)

---

## Phase 3: Admin Panel
**Status**: 🟡 In Progress

- [x] Build dashboard layout (sidebar + header)
- [x] Admin dashboard page with stats cards
- [x] Class & section management (sections CRUD; classes seeded)
- [x] Subject management (CRUD)
- [x] Admin user management (add + read-only list; own profile update)
- [x] Teacher management (add/edit/delete; assign via section page; class/subject filters)
- [x] Student management (add/edit/delete; auto subjects from section; class/subject filters; status)
- [x] Site settings page
- [x] Profile page (personal details + optional password; avatar URL field)
- [x] Section management (subjects + teachers + head teachers)
- [x] Head teacher management (permanent + temporary 1d/3d/7d/15d/30d on section page)
- [ ] Student detail page (marks history)
- [ ] Teacher assignment matrix (dedicated view)
- [ ] Teacher attendance page:
  - [ ] Mark daily teacher attendance (bulk)
  - [ ] View teacher attendance history
  - [ ] Attendance reports/summaries
- [ ] Fee management:
  - [ ] Fee structures CRUD (per class, tuition/transport, per year)
  - [ ] Student fee record generation
  - [ ] Fee collection with partial payment support
  - [ ] Fee reports (collected vs outstanding)
- [ ] Student fines management (impose, view, mark paid)
- [ ] Scholarship management (grant, view, deactivate)
- [ ] Salary management:
  - [ ] View/edit base salaries for all staff types
  - [ ] Process monthly salary payments with optional bonuses
  - [ ] Salary payment history
- [ ] Support staff management (CRUD, non-login)
- [ ] Principal management (profile, salary)
- [ ] Maintenance costs tracking (record, view history, monthly summary)

---

## Phase 4: Teacher Panel
**Status**: ✅ Complete

- [x] Teacher dashboard with assigned classes overview
- [x] View assigned sections and students
- [x] Create test (select section, subject, enter details)
- [x] Enter/edit test marks for students
- [x] Create exam (select section, enter details)
- [x] Enter/edit exam marks (per subject per student)
- [x] View test/exam history and summaries
- [x] Student attendance (head teachers only):
  - [x] Mark daily attendance for section students (bulk)
  - [x] View section attendance history
  - [x] Access restricted to active head teachers
  - [x] Attendance nav shown only when teacher is an active head
- [x] View own attendance history (all teachers)
- [x] Teacher profile page
- [x] Read-only My salary page (intentional extra beyond original Phase 4 checklist)

---

## Phase 5: Admission System
**Status**: 🔲 Not Started

- [ ] Public admission form with validation
- [ ] Document upload to Supabase Storage
- [ ] Admin admission review list (filter by status)
- [ ] Admission detail view with documents
- [ ] Approve flow (auto-create student record)
- [ ] Reject flow (with optional reason)

---

## Phase 6: Customizable Website
**Status**: 🔲 Not Started

- [ ] Website customization panel (branding, colors, content)
- [ ] Color theme picker with live preview
- [ ] Logo and hero image upload
- [ ] Custom sections builder (add/remove/reorder blocks)
- [ ] Dynamic public homepage rendering from `site_settings`
- [ ] CSS custom properties injection for theming
- [ ] Responsive public pages (home, about, admission)

---

## Phase 7: AI Integration
**Status**: 🔲 Not Started

- [ ] AI settings panel (global toggle + individual toggles)
- [ ] Webhook URL configuration
- [ ] n8n webhook send/receive Route Handlers
- [ ] Chatbot floating widget
- [ ] AI content recommendations on website editor
- [ ] Test webhook connectivity button

---

## Known Issues / Blockers

| #  | Issue | Status | Notes |
| -- | ----- | ------ | ----- |
|    | —     | —      | No issues yet |

---

## Decisions Log

| Date         | Decision                                              | Reason                                                      |
| ------------ | ----------------------------------------------------- | ----------------------------------------------------------- |
| Oct 28, 2026 | Use `proxy.ts` instead of `middleware.ts`              | Next.js 16 convention for route protection                  |
| Oct 28, 2026 | Custom OTP via Nodemailer instead of Supabase Auth OTP | Requirement specifies Gmail SMTP delivery                   |
| Oct 28, 2026 | Students cannot log in (Phase 1)                       | Explicitly deferred per requirements                        |
| Oct 28, 2026 | Use shadcn/ui for component library                    | Customizable, accessible, pairs well with Tailwind CSS 4    |
| Oct 28, 2026 | Site theming via CSS custom properties                 | No rebuild needed — instant theme changes from database      |
| Oct 28, 2026 | `otp_codes` has RLS enabled with no policies           | Intentional — managed exclusively via service-role key       |
| Oct 28, 2026 | SECURITY DEFINER helpers callable by `authenticated`   | Required for RLS policy evaluation; anon access revoked      |
| Oct 28, 2026 | Admin/teacher RLS policies scoped `TO authenticated`   | Prevents anon from triggering SECURITY DEFINER function calls |
| Oct 29, 2026 | Separate `section_head_teachers` table (not a flag on `teacher_sections`) | Head teacher role has distinct semantics: appointment, expiry, permanent/temporary types; a head teacher may not teach in that section |
| Oct 29, 2026 | Temporary head teacher precedence over permanent        | When a temporary head is active (not expired), they are the "active" head; permanent resumes automatically after expiry |
| Oct 29, 2026 | Expired temporary records kept (not auto-deleted)       | Provides audit history; filtered out at query time via `expires_at > now()` |
| Oct 29, 2026 | `is_active_head_teacher()` as SECURITY DEFINER          | Required for RLS policy evaluation; determines which head teacher can mark attendance |
| Oct 29, 2026 | Student attendance marked by head teacher, not any teacher | Ensures accountability — one designated teacher per section owns attendance |
| Oct 29, 2026 | Teacher attendance marked by admin only                 | Admin has full visibility and control over teacher attendance records |
| Oct 30, 2026 | Student attendance statuses: present, absent, leave only | Simplified from 4 statuses; `leave` covers both excused and pre-approved absence |
| Oct 30, 2026 | Two fee types: tuition (required) + transport (optional) | Transport is opt-in per student; tuition applies to all students in a class |
| Oct 30, 2026 | Scholarships as percentage on tuition fees only          | Percentage-based discount (1-100%) applied when generating monthly fee records |
| Oct 30, 2026 | Unified `salary_payments` table for all staff types      | Single table with `employee_type` discriminator avoids three separate payment tables |
| Oct 30, 2026 | Support staff and principal cannot login                  | Data-only records managed by admin; no auth.users or profiles rows needed |
| Oct 30, 2026 | `salary` column added directly to `teachers` table       | Base salary stored on entity; `salary_payments` records actual monthly disbursements with optional bonus |
| Oct 30, 2026 | Maintenance costs tracked per month with categories      | Provides financial overview; categories allow filtering (Electricity, Water, Repairs, etc.) |
