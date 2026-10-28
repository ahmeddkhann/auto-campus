# Auto Campus — Progress Tracker

> Last updated: Oct 28, 2026

---

## Current Status

| Phase | Name                     | Status         | Progress |
| ----- | ------------------------ | -------------- | -------- |
| 1     | Foundation & Database    | 🟡 In Progress | 50%      |
| 2     | Authentication           | 🔲 Not Started | 0%       |
| 3     | Admin Panel              | 🔲 Not Started | 0%       |
| 4     | Teacher Panel            | 🔲 Not Started | 0%       |
| 5     | Admission System         | 🔲 Not Started | 0%       |
| 6     | Customizable Website     | 🔲 Not Started | 0%       |
| 7     | AI Integration           | 🔲 Not Started | 0%       |

**Overall Progress**: ~7% — Database schema, RLS, storage buckets, and seed data complete. Remaining Phase 1 work: dependencies, folder structure, Supabase clients, TypeScript types.

---

## Changelog

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
**Status**: 🟡 In Progress

- [ ] Install core dependencies (Supabase, Zod, shadcn/ui, etc.)
- [ ] Initialize shadcn/ui
- [ ] Create folder structure (`lib/`, `components/`, route groups)
- [ ] Set up Supabase clients (browser, server, admin)
- [ ] Create `.env.local` with environment variables
- [x] Write and apply database migration (all tables + enums)
- [x] Set up Row-Level Security (RLS) policies
- [x] Seed default data (classes, site_settings, ai_settings)
- [ ] Generate TypeScript types from Supabase schema

---

## Phase 2: Authentication
**Status**: 🔲 Not Started

- [ ] Implement session management (JWT encrypt/decrypt via Jose)
- [ ] Implement OTP generation, hashing, storage
- [ ] Implement Nodemailer Gmail transport
- [ ] Build login page (email + password)
- [ ] Build OTP verification page
- [ ] Implement logout functionality
- [ ] Set up `proxy.ts` for route protection
- [ ] Create Data Access Layer (`verifySession`, `getUser`)
- [ ] Test full login → OTP → dashboard flow

---

## Phase 3: Admin Panel
**Status**: 🔲 Not Started

- [ ] Build dashboard layout (sidebar + header)
- [ ] Admin dashboard page with stats cards
- [ ] Class & section management (CRUD)
- [ ] Subject management (CRUD)
- [ ] Admin user management (add/edit/deactivate)
- [ ] Teacher management (add/edit/assign sections & subjects)
- [ ] Student management (add/edit/transfer sections)
- [ ] Student detail page (profile, subjects, marks history)
- [ ] Teacher assignment matrix
- [ ] Profile page with avatar upload

---

## Phase 4: Teacher Panel
**Status**: 🔲 Not Started

- [ ] Teacher dashboard with assigned classes overview
- [ ] View assigned sections and students
- [ ] Create test (select section, subject, enter details)
- [ ] Enter/edit test marks for students
- [ ] Create exam (select section, enter details)
- [ ] Enter/edit exam marks (per subject per student)
- [ ] View test/exam history and summaries
- [ ] Teacher profile page

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
