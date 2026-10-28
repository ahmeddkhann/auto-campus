# Auto Campus — Implementation Plan

## Overview

This document outlines the step-by-step implementation plan for the Auto Campus school management system. The project is divided into **7 phases**, each building on the previous one, ensuring the application is functional at each stage.

**Estimated Total Duration**: 6–8 weeks (single developer)

---

## Phase 1: Project Foundation & Database Setup
**Duration**: 3–4 days

### 1.1 Install Dependencies

```
Core:
  - @supabase/supabase-js       → Supabase client
  - @supabase/ssr                → Supabase server-side helpers for Next.js
  - zod                          → Schema validation
  - react-hook-form              → Form management
  - @hookform/resolvers          → Zod resolver for react-hook-form
  - jose                         → JWT session encryption
  - bcryptjs                     → OTP hashing
  - nodemailer                   → Email delivery
  - server-only                  → Ensure server-only modules

UI:
  - shadcn/ui (init)             → Component library setup
  - lucide-react                 → Icons
  - sonner                       → Toast notifications
  - @tanstack/react-table        → Data tables
  - class-variance-authority     → Component variants
  - clsx + tailwind-merge        → Classname utilities
```

### 1.2 Project Structure Setup

Create the base folder structure:

```
app/
├── (public)/
├── (auth)/
├── (dashboard)/
│   ├── admin/
│   └── teacher/
├── api/
lib/
├── supabase/
├── auth/
├── dal/
├── actions/
├── validations/
├── hooks/
├── utils/
├── types/
components/
├── ui/           → shadcn/ui components
├── layout/
├── forms/
├── tables/
├── dashboard/
├── website/
├── ai/
```

### 1.3 Supabase Client Configuration

- Create browser client (`lib/supabase/client.ts`)
- Create server client (`lib/supabase/server.ts`)
- Create admin/service-role client (`lib/supabase/admin.ts`)
- Set up environment variables (`.env.local`)

### 1.4 Database Schema (Supabase Migration)

Execute migrations in order:

1. **Enums**: `user_role`, `admission_status`, `student_status`
2. **Core tables**: `profiles`, `classes`, `sections`, `subjects`
3. **User tables**: `students`, `teachers`
4. **Pivot tables**: `teacher_sections`, `teacher_subjects`, `student_subjects`
5. **Assessment tables**: `tests`, `test_marks`, `exams`, `exam_marks`
6. **Application tables**: `admissions`, `otp_codes`
7. **Settings tables**: `site_settings`, `ai_settings`
8. **Indexes**: On all foreign keys and commonly filtered columns
9. **RLS Policies**: Enable RLS on all tables with role-based policies
10. **Seed data**: Default classes (Nursery, Prep, 1-12), default site_settings, default ai_settings

### 1.5 Deliverables

- [x] All dependencies installed
- [x] Folder structure created
- [x] Supabase clients configured
- [x] All database tables created with RLS
- [x] Seed data inserted (14 default classes, default settings)
- [x] TypeScript types generated from Supabase schema

---

## Phase 2: Authentication System
**Duration**: 3–4 days

### 2.1 Session Management

- Implement `lib/auth/session.ts` — JWT encrypt/decrypt using Jose
- Cookie management (HttpOnly, Secure, SameSite, 7-day expiry)
- `verifySession()` function cached with React `cache()`

### 2.2 OTP System

- Implement `lib/auth/otp.ts`:
  - `generateOTP()` — crypto-secure 6-digit code
  - `hashOTP()` / `verifyOTP()` — bcrypt hash/compare
  - `storeOTP()` — save to `otp_codes` with 5-min expiry
  - `cleanupExpiredOTPs()` — delete expired records
- Implement `lib/auth/mail.ts`:
  - Nodemailer transport with Gmail SMTP
  - OTP email template (HTML)
  - `sendOTPEmail()` function

### 2.3 Auth Pages

- **Login page** (`app/(auth)/login/page.tsx`):
  - Email + password form
  - Server Action validates credentials via Supabase Auth
  - On success → generate & send OTP → redirect to OTP page
- **OTP Verification page** (`app/(auth)/verify-otp/page.tsx`):
  - 6-digit OTP input (auto-focus, auto-advance)
  - Server Action verifies OTP → creates session → redirects to dashboard
  - Resend OTP button with cooldown timer
- **Logout**: Server Action that deletes session cookie + Supabase signout

### 2.4 Route Protection

- Implement `proxy.ts` (Next.js 16 route proxy):
  - Decrypt session from cookie
  - Redirect unauthenticated users to `/login`
  - Redirect authenticated users away from auth pages
  - Role-based route protection (`/admin/*` → admin only, `/teacher/*` → teacher only)

### 2.5 Data Access Layer (DAL)

- `lib/dal/auth.ts`:
  - `verifySession()` — cached session verification
  - `getUser()` — fetch current user profile
  - `requireAdmin()` — throw if not admin
  - `requireTeacher()` — throw if not teacher

### 2.6 Deliverables

- [x] Login page with email/password
- [x] OTP generation, sending, and verification working
- [x] Session management (create, verify, refresh, delete)
- [x] Route protection via proxy.ts
- [x] Role-based redirects
- [x] Logout functionality

---

## Phase 3: Admin Panel — Core Management
**Duration**: 5–7 days

### 3.1 Dashboard Layout

- Sidebar navigation (collapsible)
- Top header with user info, notifications, logout
- Breadcrumbs
- Mobile-responsive (hamburger menu)

### 3.2 Admin Dashboard

- Overview stats cards: total students, teachers, classes, pending admissions
- Recent activity feed
- Quick action buttons

### 3.3 Class & Section Management

- **Classes list**: View all 14 default classes
- **Section CRUD**: Add/edit/delete sections within a class
- **Validation**: Prevent duplicate section names within a class

### 3.4 Subject Management

- **Subjects CRUD**: Add/edit/delete subjects
- **Subject code**: Unique short codes (MATH, ENG, SCI, etc.)
- **Bulk actions**: Assign subjects to multiple students

### 3.5 User Management (Admins & Teachers)

- **Add Admin**:
  - Form: name, email, password, profile picture
  - Creates Supabase Auth user + profile record
- **Add Teacher**:
  - Form: name, email, password, employee ID, qualification, profile picture
  - Creates Auth user + profile + teacher record
  - Assign to sections and subjects
- **Edit/Deactivate users**
- **Users table**: Sortable, filterable, searchable

### 3.6 Student Management

- **Add Student**:
  - Form: name, roll number, parent info, DOB, gender, address, phone, avatar
  - Assign to a section
  - Assign subjects
- **Edit Student**: Update all fields
- **Transfer Student**: Move to different section (with confirmation)
- **Students table**: Filter by class, section; search by name/roll number
- **Student Detail Page**: Full profile, subjects, test/exam history

### 3.7 Teacher Assignment Management

- **Assign/reassign** teachers to sections
- **Assign/reassign** teachers to subjects within sections
- **View** teacher's full assignment matrix (which classes, sections, subjects)

### 3.8 Admin Profile

- View/edit own profile
- Upload/change profile picture
- Change password

### 3.9 Deliverables

- [x] Dashboard layout with sidebar + header
- [x] Admin dashboard with stats
- [x] Class/section management
- [x] Subject management
- [x] Admin/teacher user management
- [x] Student management with transfer capability
- [x] Teacher assignment management
- [x] Profile management with avatar upload

---

## Phase 4: Teacher Panel
**Duration**: 3–4 days

### 4.1 Teacher Dashboard

- Overview: assigned classes, sections, upcoming tests
- Quick links to enter marks

### 4.2 My Classes

- View assigned sections (read-only — assignments managed by admin)
- View students in each assigned section
- Filter by class/section

### 4.3 Test Management

- **Create Test**:
  - Select section (from assigned sections only)
  - Select subject (from assigned subjects for that section)
  - Enter title, total marks, date
- **Enter Marks**:
  - Auto-populate student list for the section
  - Enter obtained marks for each student
  - Validate: obtained ≤ total
  - Save all at once (batch insert/update)
- **View/Edit Tests**: List of created tests with marks summary

### 4.4 Exam Management

- **Create Exam**:
  - Select section
  - Enter title, academic year
- **Enter Exam Marks**:
  - For each student in the section, enter per-subject marks
  - Fields: subject, total marks, obtained marks
  - Validate: obtained ≤ total
- **View/Edit Exams**: List with summary stats

### 4.5 Teacher Profile

- View/edit own profile
- Upload/change profile picture

### 4.6 Deliverables

- [x] Teacher dashboard
- [x] View assigned classes/sections/students
- [x] Create tests and enter marks
- [x] Create exams and enter exam marks
- [x] Profile management

---

## Phase 5: Admission System
**Duration**: 2–3 days

### 5.1 Public Admission Form

- Accessible without login at `/admission`
- Form fields: student name, parent names, DOB, gender, contact info, address, applying for class, previous school
- Document upload support (birth certificate, previous report card, etc.)
- Form validation with Zod
- Success confirmation page

### 5.2 Admin Admission Review

- **Admissions list**: Filter by status (pending/approved/rejected), class
- **Review page**: View full application details with uploaded documents
- **Approve**: Creates student record, assigns to section (admin selects section)
- **Reject**: Update status with optional reason

### 5.3 Deliverables

- [x] Public admission form with validation
- [x] Document upload to Supabase Storage
- [x] Admin admission review panel
- [x] Approve flow (auto-create student)
- [x] Reject flow

---

## Phase 6: Customizable Public Website
**Duration**: 3–4 days

### 6.1 Website Customization Panel (Admin)

- **Branding**: School name, tagline, logo upload
- **Theme**: Color picker for primary, secondary, accent colors
- **Hero Section**: Image upload, title text, subtitle text
- **About Section**: Rich text editor for about content
- **Contact Info**: Email, phone, address, map embed
- **Social Links**: Facebook, Twitter, Instagram, YouTube, etc.
- **Custom Sections**: Add/remove/reorder content blocks
  - Each block: title, content (text/image), layout type
- **Live Preview**: Side-by-side preview panel showing changes in real-time

### 6.2 Public Website Rendering

- **Dynamic theming**: CSS custom properties loaded from `site_settings`
- **Home page**: Renders based on `site_settings` content
  - Hero banner
  - About section
  - Programs/classes showcase
  - Custom sections
  - Contact information
  - Footer with social links
- **Admission page**: Styled with school theme
- **About page**: Extended content from site_settings

### 6.3 Implementation Approach

```
site_settings (DB)
    ↓ (fetched at render time)
Root Layout → Injects CSS custom properties
    ↓
(public)/ layout → Reads school name, logo, nav items
    ↓
page.tsx → Renders sections from site_settings
```

Theme injection via CSS variables:

```css
:root {
  --color-primary: var(--school-primary, #1a56db);
  --color-secondary: var(--school-secondary, #7e3af2);
  --color-accent: var(--school-accent, #0e9f6e);
}
```

### 6.4 Deliverables

- [x] Admin website customization panel
- [x] Live preview of changes
- [x] Dynamic public website rendering from database
- [x] Theme system with CSS custom properties
- [x] Responsive public pages

---

## Phase 7: AI Integration (n8n Webhooks)
**Duration**: 2–3 days

### 7.1 AI Settings Panel (Admin)

- **Global toggle**: Enable/disable all AI features
- **Individual toggles**: Chatbot, content recommendations
- **Webhook URLs**: Configure n8n webhook endpoints for each feature
- **Test connection**: Button to verify webhook connectivity

### 7.2 n8n Webhook Integration

- **Route Handler**: `app/api/webhooks/n8n/route.ts`
  - Receives POST requests from n8n automations
  - Validates webhook source
  - Processes response data
- **Outbound requests**: Server Actions/Route Handlers send data to n8n
  - POST request with relevant context
  - Await response (with timeout)
  - Handle errors gracefully

### 7.3 Chatbot Widget

- Floating chat widget (bottom-right corner)
- Appears only when AI is enabled
- Sends user messages to n8n chatbot webhook
- Displays AI responses in chat bubble format
- Conversation history stored in component state (session-based)
- Available on admin and teacher dashboards

### 7.4 AI Content Recommendations

- On the website customization panel, "Generate with AI" buttons
- Sends current context (school name, section type) to n8n
- Receives suggested text content
- Admin can accept, modify, or reject suggestions

### 7.5 Deliverables

- [x] AI settings panel with toggles
- [x] n8n webhook integration (send/receive)
- [x] Chatbot widget
- [x] AI content recommendations
- [x] Global on/off functionality

---

## Cross-Cutting Concerns (Throughout All Phases)

### Error Handling

- Global error boundary (`error.tsx` at route group level)
- Server Action error handling with typed responses
- Toast notifications for success/error feedback
- Form-level validation errors

### Loading States

- `loading.tsx` files for route-level loading skeletons
- Skeleton components for tables, cards, forms
- Optimistic updates where appropriate

### Responsive Design

- Mobile-first approach with Tailwind CSS
- Collapsible sidebar on mobile
- Responsive data tables (card view on mobile)
- Touch-friendly interactive elements

### Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management on modals and forms
- Color contrast compliance

### Testing Strategy

- Zod validations serve as unit test contracts
- Manual testing for each user flow
- Browser testing for responsive layouts

---

## Dependencies & Prerequisites

### Required Before Development

1. **Supabase Project**: ✅ Connected (`gtohzjvixvetzivcbzbq`)
2. **Gmail Account**: Needed for SMTP (with App Password enabled)
3. **n8n Instance**: Needed for Phase 7 (can be n8n Cloud or self-hosted)

### Required Environment Variables

| Variable                         | When Needed | Source          |
| -------------------------------- | ----------- | --------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | Phase 1     | Supabase        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Phase 1     | Supabase        |
| `SUPABASE_SERVICE_ROLE_KEY`      | Phase 1     | Supabase        |
| `SESSION_SECRET`                 | Phase 2     | Generated       |
| `GMAIL_USER`                     | Phase 2     | Gmail account   |
| `GMAIL_APP_PASSWORD`             | Phase 2     | Gmail settings  |
| `N8N_BASE_WEBHOOK_URL`          | Phase 7     | n8n instance    |
| `NEXT_PUBLIC_APP_URL`            | Phase 1     | Dev/Prod URL    |

---

## Phase Execution Summary

| Phase | Name                        | Duration  | Dependencies  |
| ----- | --------------------------- | --------- | ------------- |
| 1     | Foundation & Database       | 3–4 days  | None          |
| 2     | Authentication              | 3–4 days  | Phase 1       |
| 3     | Admin Panel                 | 5–7 days  | Phase 2       |
| 4     | Teacher Panel               | 3–4 days  | Phase 3       |
| 5     | Admission System            | 2–3 days  | Phase 3       |
| 6     | Customizable Website        | 3–4 days  | Phase 3       |
| 7     | AI Integration              | 2–3 days  | Phase 6       |
|       | **Total**                   | **21–29 days** |          |

> **Note**: Phases 4, 5, and 6 can be worked on in parallel after Phase 3 is complete, potentially reducing total time to ~18 days.

---

## Getting Started (Phase 1 Kickoff)

When ready to begin, the first actions will be:

1. Install all core dependencies
2. Initialize shadcn/ui
3. Create the folder structure
4. Set up Supabase clients
5. Write and apply the database migration
6. Seed default data
7. Generate TypeScript types

Simply say **"Let's start Phase 1"** to begin implementation.
