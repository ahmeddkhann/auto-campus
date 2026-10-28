# Auto Campus — Technical Report

## 1. Executive Summary

**Auto Campus** is a comprehensive school management system built with **Next.js 16** and **Supabase**. It manages three user roles (Admin, Teacher, Student), handles class/section organization from Nursery through 12th grade, supports admissions, assessments, and provides a fully customizable public-facing website. The system integrates AI-powered features via n8n webhook automations, including chatbots and content recommendations.

---

## 2. System Overview

### 2.1 Application Type

- **Platform**: Web Application (responsive, mobile-friendly)
- **Architecture**: Full-stack monolithic Next.js application with Supabase BaaS
- **Rendering Strategy**: Hybrid (Server Components by default, Client Components for interactivity)

### 2.2 User Roles

| Role       | Login Access | Capabilities                                                                                    |
| ---------- | ------------ | ----------------------------------------------------------------------------------------------- |
| **Admin**  | Yes (Email + OTP) | Full system control — manage users, classes, sections, subjects, admissions, website content, AI settings |
| **Teacher**| Yes (Email + OTP) | Manage assigned classes/sections, create tests/exams, enter marks, view student data              |
| **Student**| No (Phase 1)      | Data is managed by admins and teachers; no login required in current scope                       |

### 2.3 Academic Structure

```
School
├── Class (Nursery, Prep, 1, 2, 3, ... 12)
│   ├── Section A
│   │   ├── Student 1 → [Subject 1, Subject 2, ...]
│   │   ├── Student 2 → [Subject 1, Subject 3, ...]
│   │   └── ...
│   ├── Section B
│   │   └── ...
│   └── Section C
│       └── ...
└── ...
```

- Each class can have **multiple sections** (A, B, C, etc.)
- Each section contains **multiple students**
- Each student is enrolled in **multiple subjects**
- Students and teachers can be **transferred** between sections
- Subjects can be **reassigned** across students

---

## 3. Technology Stack

### 3.1 Frontend

| Technology         | Version  | Purpose                                 |
| ------------------ | -------- | --------------------------------------- |
| Next.js            | 16.4.3   | React framework (App Router)            |
| React              | 19.3.0   | UI library                              |
| TypeScript         | ^5       | Type safety                             |
| Tailwind CSS       | ^4       | Utility-first styling                   |
| shadcn/ui          | Latest   | Component library (to be installed)     |
| Zod                | Latest   | Schema validation                       |
| React Hook Form    | Latest   | Form management                         |
| Lucide React       | Latest   | Icon library                            |

### 3.2 Backend / Infrastructure

| Technology          | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| Supabase            | Database (PostgreSQL), Auth, Storage, RLS         |
| Supabase Storage    | Profile pictures, school assets                   |
| Nodemailer          | OTP email delivery via Gmail SMTP                 |
| n8n                 | AI automation workflows (webhooks)                |
| Next.js Route Handlers | API endpoints for webhooks and server logic    |
| Next.js Server Actions | Data mutations (forms, CRUD operations)        |

### 3.3 Supabase Project

| Property     | Value                                        |
| ------------ | -------------------------------------------- |
| Project URL  | `https://gtohzjvixvetzivcbzbq.supabase.co`  |
| Key Extensions | `uuid-ossp`, `pgcrypto`, `pg_stat_statements`, `supabase_vault` (installed) |
| Available    | `pg_net` (HTTP webhooks), `vector` (AI embeddings), `pg_cron` (scheduled jobs) |

---

## 4. Database Schema Design

### 4.1 Entity Relationship Overview

```
profiles ──────── users (Supabase Auth)
    │
    ├── admins
    ├── teachers ──┬── teacher_sections (pivot)
    │              └── teacher_subjects (pivot)
    └── students ──┬── student_subjects (pivot)
                   └── student_sections (pivot)

classes ──── sections ──── students
                │
                ├── tests ──── test_marks
                └── exams ──── exam_marks

site_settings (singleton — customizable front page)
ai_settings (singleton — AI toggle + config)
otp_codes (temporary OTP storage)
admissions (admission applications)
```

### 4.2 Table Definitions

#### `profiles`
Extends Supabase Auth users with application-specific data.

| Column            | Type        | Constraints            | Description                    |
| ----------------- | ----------- | ---------------------- | ------------------------------ |
| id                | uuid        | PK, FK → auth.users.id | Links to Supabase Auth user    |
| full_name         | text        | NOT NULL               | User's full name               |
| email             | text        | NOT NULL, UNIQUE       | User's email                   |
| role              | enum        | NOT NULL               | 'admin' / 'teacher' / 'student' |
| avatar_url        | text        | NULLABLE               | Profile picture URL (Storage)  |
| phone             | text        | NULLABLE               | Contact number                 |
| created_at        | timestamptz | DEFAULT now()          | Record creation time           |
| updated_at        | timestamptz | DEFAULT now()          | Last update time               |

#### `classes`

| Column     | Type        | Constraints   | Description                          |
| ---------- | ----------- | ------------- | ------------------------------------ |
| id         | uuid        | PK            | Unique identifier                    |
| name       | text        | NOT NULL, UNIQUE | Class name (Nursery, Prep, 1-12)  |
| sort_order | integer     | NOT NULL      | Display ordering                     |
| created_at | timestamptz | DEFAULT now() | Record creation time                 |

#### `sections`

| Column     | Type        | Constraints             | Description                  |
| ---------- | ----------- | ----------------------- | ---------------------------- |
| id         | uuid        | PK                      | Unique identifier            |
| class_id   | uuid        | FK → classes.id, NOT NULL | Parent class               |
| name       | text        | NOT NULL                | Section name (A, B, C, etc.) |
| created_at | timestamptz | DEFAULT now()           | Record creation time         |
| UNIQUE     |             | (class_id, name)        | No duplicate sections        |

#### `subjects`

| Column     | Type        | Constraints   | Description              |
| ---------- | ----------- | ------------- | ------------------------ |
| id         | uuid        | PK            | Unique identifier        |
| name       | text        | NOT NULL      | Subject name             |
| code       | text        | UNIQUE        | Short code (e.g., MATH)  |
| created_at | timestamptz | DEFAULT now() | Record creation time     |

#### `students`

| Column       | Type        | Constraints                | Description                   |
| ------------ | ----------- | -------------------------- | ----------------------------- |
| id           | uuid        | PK                         | Unique identifier             |
| profile_id   | uuid        | FK → profiles.id, NULLABLE | Link to profile (future login)|
| roll_number  | text        | NOT NULL                   | Student roll/admission number |
| full_name    | text        | NOT NULL                   | Student full name             |
| father_name  | text        | NULLABLE                   | Father's name                 |
| mother_name  | text        | NULLABLE                   | Mother's name                 |
| date_of_birth| date        | NULLABLE                   | Date of birth                 |
| gender       | text        | NULLABLE                   | Gender                        |
| address      | text        | NULLABLE                   | Home address                  |
| phone        | text        | NULLABLE                   | Contact number                |
| avatar_url   | text        | NULLABLE                   | Profile picture URL           |
| section_id   | uuid        | FK → sections.id, NOT NULL | Current section assignment    |
| status       | text        | DEFAULT 'active'           | active / inactive / graduated |
| admitted_at  | timestamptz | DEFAULT now()              | Admission date                |
| created_at   | timestamptz | DEFAULT now()              | Record creation time          |
| updated_at   | timestamptz | DEFAULT now()              | Last update time              |

#### `teachers`

| Column     | Type        | Constraints              | Description               |
| ---------- | ----------- | ------------------------ | ------------------------- |
| id         | uuid        | PK                       | Unique identifier         |
| profile_id | uuid        | FK → profiles.id, UNIQUE | Link to auth profile      |
| employee_id| text        | UNIQUE                   | Employee identifier       |
| qualification | text     | NULLABLE                 | Educational qualification |
| created_at | timestamptz | DEFAULT now()            | Record creation time      |
| updated_at | timestamptz | DEFAULT now()            | Last update time          |

#### `teacher_sections` (Pivot — Teacher ↔ Section assignments)

| Column     | Type | Constraints                          |
| ---------- | ---- | ------------------------------------ |
| id         | uuid | PK                                   |
| teacher_id | uuid | FK → teachers.id, NOT NULL           |
| section_id | uuid | FK → sections.id, NOT NULL           |
| UNIQUE     |      | (teacher_id, section_id)             |

#### `teacher_subjects` (Pivot — Teacher ↔ Subject ↔ Section)

| Column     | Type | Constraints                                |
| ---------- | ---- | ------------------------------------------ |
| id         | uuid | PK                                         |
| teacher_id | uuid | FK → teachers.id, NOT NULL                 |
| subject_id | uuid | FK → subjects.id, NOT NULL                 |
| section_id | uuid | FK → sections.id, NOT NULL                 |
| UNIQUE     |      | (teacher_id, subject_id, section_id)       |

#### `student_subjects` (Pivot — Student ↔ Subject enrollment)

| Column     | Type | Constraints                          |
| ---------- | ---- | ------------------------------------ |
| id         | uuid | PK                                   |
| student_id | uuid | FK → students.id, NOT NULL           |
| subject_id | uuid | FK → subjects.id, NOT NULL           |
| UNIQUE     |      | (student_id, subject_id)             |

#### `tests`

| Column      | Type        | Constraints              | Description                    |
| ----------- | ----------- | ------------------------ | ------------------------------ |
| id          | uuid        | PK                       | Unique identifier              |
| title       | text        | NOT NULL                 | Test title                     |
| subject_id  | uuid        | FK → subjects.id         | Subject being tested           |
| section_id  | uuid        | FK → sections.id         | Section taking the test        |
| teacher_id  | uuid        | FK → teachers.id         | Teacher who created the test   |
| total_marks | numeric     | NOT NULL                 | Maximum marks                  |
| test_date   | date        | NULLABLE                 | Date of the test               |
| created_at  | timestamptz | DEFAULT now()            | Record creation time           |

#### `test_marks`

| Column      | Type    | Constraints                     | Description          |
| ----------- | ------- | ------------------------------- | -------------------- |
| id          | uuid    | PK                              | Unique identifier    |
| test_id     | uuid    | FK → tests.id, NOT NULL         | Parent test          |
| student_id  | uuid    | FK → students.id, NOT NULL      | Student              |
| obtained_marks | numeric | NOT NULL                     | Marks obtained       |
| remarks     | text    | NULLABLE                        | Optional remarks     |
| UNIQUE      |         | (test_id, student_id)           | One entry per student|

#### `exams`

| Column      | Type        | Constraints              | Description                    |
| ----------- | ----------- | ------------------------ | ------------------------------ |
| id          | uuid        | PK                       | Unique identifier              |
| title       | text        | NOT NULL                 | Exam title (Midterm, Final)    |
| section_id  | uuid        | FK → sections.id         | Section taking the exam        |
| teacher_id  | uuid        | FK → teachers.id         | Teacher managing the exam      |
| academic_year | text      | NULLABLE                 | Academic year (e.g., 2026-27)  |
| created_at  | timestamptz | DEFAULT now()            | Record creation time           |

#### `exam_marks`

| Column          | Type    | Constraints                       | Description          |
| --------------- | ------- | --------------------------------- | -------------------- |
| id              | uuid    | PK                                | Unique identifier    |
| exam_id         | uuid    | FK → exams.id, NOT NULL           | Parent exam          |
| student_id      | uuid    | FK → students.id, NOT NULL        | Student              |
| subject_id      | uuid    | FK → subjects.id, NOT NULL        | Subject              |
| total_marks     | numeric | NOT NULL                          | Maximum marks        |
| obtained_marks  | numeric | NOT NULL                          | Marks obtained       |
| UNIQUE          |         | (exam_id, student_id, subject_id) | One entry per combo  |

#### `admissions`

| Column          | Type        | Constraints   | Description                           |
| --------------- | ----------- | ------------- | ------------------------------------- |
| id              | uuid        | PK            | Unique identifier                     |
| student_name    | text        | NOT NULL      | Applicant name                        |
| father_name     | text        | NULLABLE      | Father's name                         |
| mother_name     | text        | NULLABLE      | Mother's name                         |
| date_of_birth   | date        | NULLABLE      | Date of birth                         |
| gender          | text        | NULLABLE      | Gender                                |
| phone           | text        | NULLABLE      | Contact number                        |
| email           | text        | NULLABLE      | Contact email                         |
| address         | text        | NULLABLE      | Home address                          |
| class_id        | uuid        | FK → classes.id | Applying for class                  |
| previous_school | text        | NULLABLE      | Previous school name                  |
| status          | text        | DEFAULT 'pending' | pending / approved / rejected     |
| documents       | jsonb       | NULLABLE      | Uploaded document references          |
| submitted_at    | timestamptz | DEFAULT now() | Submission time                       |
| reviewed_at     | timestamptz | NULLABLE      | Review time                           |
| reviewed_by     | uuid        | FK → profiles.id, NULLABLE | Admin who reviewed         |

#### `site_settings` (Singleton)

| Column          | Type  | Constraints | Description                           |
| --------------- | ----- | ----------- | ------------------------------------- |
| id              | uuid  | PK          | Single row                            |
| school_name     | text  | NOT NULL    | School display name                   |
| tagline         | text  | NULLABLE    | School tagline/motto                  |
| logo_url        | text  | NULLABLE    | School logo (Storage)                 |
| hero_image_url  | text  | NULLABLE    | Hero banner image                     |
| primary_color   | text  | DEFAULT '#1a56db' | Theme primary color             |
| secondary_color | text  | DEFAULT '#7e3af2' | Theme secondary color           |
| accent_color    | text  | DEFAULT '#0e9f6e' | Theme accent color              |
| about_text      | text  | NULLABLE    | About section content                 |
| contact_email   | text  | NULLABLE    | Contact email displayed on site       |
| contact_phone   | text  | NULLABLE    | Contact phone displayed on site       |
| address         | text  | NULLABLE    | School address                        |
| social_links    | jsonb | DEFAULT '{}' | Social media links                   |
| custom_sections | jsonb | DEFAULT '[]' | Additional custom content blocks     |
| meta_data       | jsonb | DEFAULT '{}' | SEO and miscellaneous metadata       |
| updated_at      | timestamptz | DEFAULT now() | Last update time               |

#### `ai_settings` (Singleton)

| Column          | Type    | Constraints       | Description                        |
| --------------- | ------- | ----------------- | ---------------------------------- |
| id              | uuid    | PK                | Single row                         |
| enabled         | boolean | DEFAULT false     | Global AI on/off toggle            |
| chatbot_enabled | boolean | DEFAULT false     | Chatbot feature toggle             |
| recommendations_enabled | boolean | DEFAULT false | AI text recommendations toggle |
| n8n_webhook_url | text    | NULLABLE          | Base n8n webhook URL               |
| chatbot_webhook | text    | NULLABLE          | Chatbot-specific webhook URL       |
| recommendations_webhook | text | NULLABLE     | Recommendations webhook URL        |
| updated_at      | timestamptz | DEFAULT now() | Last update time                   |

#### `otp_codes`

| Column     | Type        | Constraints              | Description              |
| ---------- | ----------- | ------------------------ | ------------------------ |
| id         | uuid        | PK                       | Unique identifier        |
| email      | text        | NOT NULL                 | Email the OTP was sent to|
| code       | text        | NOT NULL                 | Hashed OTP code          |
| expires_at | timestamptz | NOT NULL                 | Expiration timestamp     |
| used       | boolean     | DEFAULT false            | Whether OTP was consumed |
| created_at | timestamptz | DEFAULT now()            | Record creation time     |

### 4.3 Enums

```sql
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');
CREATE TYPE admission_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE student_status AS ENUM ('active', 'inactive', 'graduated');
```

---

## 5. Authentication & Authorization

### 5.1 Authentication Flow

```
User enters email + password
    ↓
Server validates credentials against Supabase Auth
    ↓
If valid → Generate 6-digit OTP → Store hashed OTP in `otp_codes`
    ↓
Send OTP to email via Nodemailer (Gmail SMTP)
    ↓
User enters OTP → Server verifies → Create session
    ↓
Redirect to role-based dashboard
```

### 5.2 OTP Implementation

- **Generation**: Cryptographically secure 6-digit numeric code
- **Storage**: Hashed (bcrypt) in `otp_codes` table with 5-minute expiry
- **Delivery**: Nodemailer with Gmail SMTP (App Password)
- **Verification**: Compare hashed code, check expiry, mark as used
- **Rate Limiting**: Max 3 OTP requests per email per 15 minutes

### 5.3 Authorization (Row-Level Security)

Supabase RLS policies will enforce:

- **Admins**: Full read/write access to all tables
- **Teachers**: Read/write to assigned sections, students, tests, exams, marks
- **Students**: No direct database access (Phase 1)
- **Public**: Read-only access to `site_settings` for the public website

### 5.4 Route Protection

Next.js 16 uses `proxy.ts` (not middleware) for route-level protection:

```
/                    → Public (customizable landing page)
/login               → Public
/admission           → Public
/admin/*             → Admin only
/teacher/*           → Teacher only
/api/webhooks/*      → Authenticated + verified source
```

---

## 6. Application Architecture

### 6.1 Route Structure (App Router)

```
app/
├── (public)/                    # Public-facing pages
│   ├── layout.tsx               # Public layout (uses site_settings)
│   ├── page.tsx                 # Customizable home/landing page
│   ├── admission/
│   │   └── page.tsx             # Online admission form
│   └── about/
│       └── page.tsx             # About page
│
├── (auth)/                      # Authentication pages
│   ├── layout.tsx               # Auth layout (centered card)
│   ├── login/
│   │   └── page.tsx             # Login page
│   └── verify-otp/
│       └── page.tsx             # OTP verification page
│
├── (dashboard)/                 # Protected dashboard area
│   ├── layout.tsx               # Dashboard shell (sidebar, header)
│   │
│   ├── admin/                   # Admin panel
│   │   ├── page.tsx             # Admin dashboard overview
│   │   ├── users/
│   │   │   └── page.tsx         # Manage admins & teachers
│   │   ├── classes/
│   │   │   └── page.tsx         # Manage classes & sections
│   │   ├── students/
│   │   │   ├── page.tsx         # All students list
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Student detail/edit
│   │   ├── subjects/
│   │   │   └── page.tsx         # Manage subjects
│   │   ├── admissions/
│   │   │   └── page.tsx         # Review admissions
│   │   ├── website/
│   │   │   └── page.tsx         # Website customization
│   │   ├── ai-settings/
│   │   │   └── page.tsx         # AI features toggle
│   │   └── profile/
│   │       └── page.tsx         # Admin profile
│   │
│   └── teacher/                 # Teacher panel
│       ├── page.tsx             # Teacher dashboard
│       ├── classes/
│       │   └── page.tsx         # Assigned classes/sections
│       ├── students/
│       │   └── page.tsx         # Students in assigned sections
│       ├── tests/
│       │   ├── page.tsx         # Tests list
│       │   ├── new/
│       │   │   └── page.tsx     # Create test
│       │   └── [id]/
│       │       └── page.tsx     # Enter/edit marks
│       ├── exams/
│       │   ├── page.tsx         # Exams list
│       │   ├── new/
│       │   │   └── page.tsx     # Create exam
│       │   └── [id]/
│       │       └── page.tsx     # Enter/edit exam marks
│       └── profile/
│           └── page.tsx         # Teacher profile
│
├── api/                         # API Route Handlers
│   ├── auth/
│   │   ├── login/route.ts
│   │   ├── verify-otp/route.ts
│   │   └── logout/route.ts
│   ├── webhooks/
│   │   ├── n8n/route.ts         # Receive n8n webhook responses
│   │   └── chatbot/route.ts     # Chatbot webhook endpoint
│   └── upload/
│       └── route.ts             # File upload handler
│
├── layout.tsx                   # Root layout
├── globals.css                  # Global styles + Tailwind
└── not-found.tsx                # 404 page
```

### 6.2 Core Modules

```
lib/
├── supabase/
│   ├── client.ts                # Browser Supabase client
│   ├── server.ts                # Server Supabase client
│   └── admin.ts                 # Service-role client (admin ops)
├── auth/
│   ├── session.ts               # Session management (encrypt/decrypt)
│   ├── otp.ts                   # OTP generation, hashing, verification
│   └── mail.ts                  # Nodemailer Gmail transport
├── dal/                         # Data Access Layer
│   ├── users.ts
│   ├── classes.ts
│   ├── sections.ts
│   ├── students.ts
│   ├── teachers.ts
│   ├── subjects.ts
│   ├── tests.ts
│   ├── exams.ts
│   ├── admissions.ts
│   └── site-settings.ts
├── actions/                     # Server Actions
│   ├── auth.ts
│   ├── users.ts
│   ├── classes.ts
│   ├── students.ts
│   ├── teachers.ts
│   ├── tests.ts
│   ├── exams.ts
│   └── admissions.ts
├── validations/                 # Zod schemas
│   ├── auth.ts
│   ├── student.ts
│   ├── teacher.ts
│   ├── class.ts
│   └── admission.ts
├── hooks/                       # Custom React hooks
│   ├── use-auth.ts
│   └── use-theme.ts
├── utils/                       # Utility functions
│   ├── constants.ts
│   └── helpers.ts
└── types/                       # TypeScript type definitions
    └── index.ts

components/
├── ui/                          # shadcn/ui components
├── layout/
│   ├── sidebar.tsx
│   ├── header.tsx
│   └── footer.tsx
├── forms/
│   ├── login-form.tsx
│   ├── otp-form.tsx
│   ├── student-form.tsx
│   ├── teacher-form.tsx
│   └── admission-form.tsx
├── tables/
│   ├── students-table.tsx
│   ├── teachers-table.tsx
│   └── marks-table.tsx
├── dashboard/
│   ├── stats-card.tsx
│   ├── recent-activity.tsx
│   └── chart-card.tsx
├── website/
│   ├── theme-editor.tsx
│   ├── content-editor.tsx
│   └── preview-panel.tsx
└── ai/
    ├── chatbot-widget.tsx
    └── ai-toggle.tsx
```

---

## 7. Key Features Detail

### 7.1 Customizable Public Website

The public-facing website is fully customizable through the admin panel:

- **School Name & Branding**: Name, logo, tagline, favicon
- **Color Theme**: Primary, secondary, and accent colors applied via CSS custom properties
- **Content Sections**: Hero banner, about, programs, contact — all editable
- **Custom Sections**: Admin can add/remove/reorder content blocks via JSON-driven UI
- **Live Preview**: Changes preview in real-time before publishing

**Implementation**: CSS custom properties injected at the root layout level based on `site_settings`, allowing full theme customization without rebuilds.

### 7.2 Admission System

- Public-facing admission form accessible without login
- Form captures student details, parent info, previous school, document uploads
- Admin reviews and approves/rejects applications
- Approved admissions auto-create student records and assign to sections

### 7.3 Assessment System

#### Tests (Class Tests / Quizzes)
- Teacher creates a test for a specific section and subject
- Enters total marks for the test
- Enters obtained marks for each student in that section
- Auto-calculates percentage

#### Exams (Midterm / Final)
- Teacher creates an exam for a section
- Enters total and obtained marks per subject per student
- Supports multiple subjects per exam
- Report card generation (future scope)

### 7.4 Transfer System

- **Student Transfer**: Move a student from one section to another (same or different class)
- **Teacher Reassignment**: Change teacher's assigned sections and subjects
- **Subject Reassignment**: Add/remove subjects for individual students
- All transfers maintain audit trail via `updated_at` timestamps

### 7.5 AI Integration (n8n Webhooks)

```
Admin Panel → Enable AI → Configure Webhook URLs
    ↓
Feature Request (e.g., chatbot message)
    ↓
Next.js Route Handler → POST to n8n Webhook URL
    ↓
n8n processes (AI model, data enrichment, etc.)
    ↓
n8n sends response back → Route Handler receives
    ↓
Display result to user
```

**Features**:
- **Chatbot**: Floating widget that sends messages to n8n, receives AI responses
- **Content Recommendations**: AI-suggested text for website sections
- **Global Toggle**: Admin can enable/disable all AI features with one switch
- **Individual Toggles**: Granular control per AI feature

---

## 8. File Storage (Supabase Storage)

Images and documents are stored in Supabase Storage buckets, **not** in database tables. Tables only store the public/signed URL references (e.g., `avatar_url`, `logo_url`, `hero_image_url`, `documents` JSONB). Uploads and downloads happen via the Supabase browser client (`supabase.storage.from('bucket').upload(...)`) on the client side.

### 8.1 Buckets

| Bucket           | Access   | Size Limit | Allowed Types                                       | Contents                                    |
| ---------------- | -------- | ---------- | --------------------------------------------------- | ------------------------------------------- |
| `avatars`        | Private  | 5 MB       | JPEG, PNG, WebP, GIF                                | Profile pictures (admin, teacher, student)   |
| `school-assets`  | Public   | 10 MB      | JPEG, PNG, WebP, GIF, SVG, ICO                      | School logo, hero images, favicons           |
| `documents`      | Private  | 10 MB      | JPEG, PNG, WebP, PDF                                | Admission documents                          |

### 8.2 Storage RLS Policies

| Bucket           | Operation       | Who                          | Path Constraint                            |
| ---------------- | --------------- | ---------------------------- | ------------------------------------------ |
| `avatars`        | SELECT          | Authenticated                | Any file in bucket                         |
| `avatars`        | INSERT          | Authenticated                | Own folder: `{user_id}/*`                  |
| `avatars`        | UPDATE          | Authenticated                | Own folder: `{user_id}/*`                  |
| `avatars`        | DELETE          | Authenticated (own) or Admin | Own folder or any (admin)                  |
| `school-assets`  | SELECT          | Public (via public URL)      | N/A — public bucket                        |
| `school-assets`  | INSERT/UPDATE/DELETE | Admin only              | Any file in bucket                         |
| `documents`      | INSERT          | Anon + Authenticated         | Must be under `admissions/*`               |
| `documents`      | SELECT          | Admin only                   | Any file in bucket                         |
| `documents`      | DELETE          | Admin only                   | Any file in bucket                         |

### 8.3 File Naming Convention

```
avatars/{user_id}/{timestamp}-{filename}
school-assets/{type}/{timestamp}-{filename}
documents/admissions/{admission_id}/{filename}
```

### 8.4 Client-Side Upload Pattern

```typescript
// Upload avatar (browser client)
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/${Date.now()}-avatar.jpg`, file);

// Get public URL for school-assets (public bucket)
const { data: { publicUrl } } = supabase.storage
  .from('school-assets')
  .getPublicUrl('logo/school-logo.png');

// Get signed URL for private files
const { data: { signedUrl } } = await supabase.storage
  .from('documents')
  .createSignedUrl('admissions/abc123/birth-cert.pdf', 3600);
```

---

## 9. Security Considerations

### 9.1 Authentication Security

- Passwords hashed via Supabase Auth (bcrypt)
- OTP codes hashed before storage
- OTP expiry enforced (5 minutes)
- Rate limiting on OTP requests
- Session tokens encrypted (JWT via Jose library)
- HTTP-only, Secure, SameSite cookies

### 9.2 Data Security

- Row-Level Security (RLS) on all tables
- Service-role key never exposed to client
- Server Actions validate user role before mutations
- Input validation via Zod on both client and server
- CSRF protection via Next.js Server Actions
- File upload size limits and type validation

### 9.3 API Security

- Webhook endpoints verify request source
- Rate limiting on public endpoints
- Environment variables for all secrets

---

## 10. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://gtohzjvixvetzivcbzbq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>

# Session
SESSION_SECRET=<generated_secret>

# Email (Gmail SMTP)
GMAIL_USER=<gmail_address>
GMAIL_APP_PASSWORD=<app_password>

# n8n Webhooks
N8N_BASE_WEBHOOK_URL=<n8n_webhook_url>

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 11. Performance Considerations

- **Server Components** by default — minimal client JavaScript
- **Streaming** with `<Suspense>` for data-heavy pages
- **Image Optimization** via `next/image` for all uploaded images
- **Connection Pooling** via Supabase's built-in PgBouncer
- **Caching** with Next.js 16 Cache Components where appropriate

### 11.1 Database Indexes (37 custom indexes)

All foreign keys, frequently filtered columns, and common query patterns are indexed.

#### Foreign Key Indexes

| Index                              | Table              | Column(s)              |
| ---------------------------------- | ------------------ | ---------------------- |
| `idx_sections_class_id`            | sections           | class_id               |
| `idx_students_section_id`          | students           | section_id             |
| `idx_students_profile_id`          | students           | profile_id             |
| `idx_teachers_profile_id`          | teachers           | profile_id             |
| `idx_teacher_sections_teacher_id`  | teacher_sections   | teacher_id             |
| `idx_teacher_sections_section_id`  | teacher_sections   | section_id             |
| `idx_teacher_subjects_teacher_id`  | teacher_subjects   | teacher_id             |
| `idx_teacher_subjects_subject_id`  | teacher_subjects   | subject_id             |
| `idx_teacher_subjects_section_id`  | teacher_subjects   | section_id             |
| `idx_student_subjects_student_id`  | student_subjects   | student_id             |
| `idx_student_subjects_subject_id`  | student_subjects   | subject_id             |
| `idx_tests_subject_id`            | tests              | subject_id             |
| `idx_tests_section_id`            | tests              | section_id             |
| `idx_tests_teacher_id`            | tests              | teacher_id             |
| `idx_test_marks_test_id`          | test_marks         | test_id                |
| `idx_test_marks_student_id`       | test_marks         | student_id             |
| `idx_exams_section_id`            | exams              | section_id             |
| `idx_exams_teacher_id`            | exams              | teacher_id             |
| `idx_exam_marks_exam_id`          | exam_marks         | exam_id                |
| `idx_exam_marks_student_id`       | exam_marks         | student_id             |
| `idx_exam_marks_subject_id`       | exam_marks         | subject_id             |
| `idx_admissions_class_id`         | admissions         | class_id               |
| `idx_admissions_reviewed_by`      | admissions         | reviewed_by            |

#### Filter / Sort Indexes

| Index                              | Table     | Column(s)              | Purpose                                     |
| ---------------------------------- | --------- | ---------------------- | ------------------------------------------- |
| `idx_profiles_role`                | profiles  | role                   | Filter users by role                         |
| `idx_students_status`              | students  | status                 | Filter active/inactive/graduated             |
| `idx_students_roll_number`         | students  | roll_number            | Search students by roll number               |
| `idx_students_section_status`      | students  | section_id, status     | List active students in a section            |
| `idx_admissions_status`            | admissions | status                | Filter pending/approved/rejected             |
| `idx_admissions_submitted_at`      | admissions | submitted_at          | Sort admissions by submission date           |
| `idx_admissions_status_submitted`  | admissions | status, submitted_at  | Pending admissions sorted by date            |
| `idx_tests_test_date`             | tests      | test_date             | Filter/sort tests by date                    |
| `idx_tests_section_date`          | tests      | section_id, test_date | Tests for a section in date order            |
| `idx_exams_academic_year`         | exams      | academic_year         | Filter exams by academic year                |
| `idx_classes_sort_order`          | classes    | sort_order            | Ordered class listing                        |
| `idx_otp_codes_email`             | otp_codes  | email                 | Lookup OTPs by email                         |
| `idx_otp_codes_expires_at`        | otp_codes  | expires_at            | Cleanup expired OTPs                         |
| `idx_otp_codes_active`            | otp_codes  | email, expires_at     | Partial index (WHERE used = false) for verification |

> **Note**: UNIQUE constraints on `profiles.email`, `classes.name`, `subjects.code`, `teachers.employee_id`, `teachers.profile_id`, and all pivot table composite keys also create implicit indexes (not counted above).

---

## 12. Future Scope (Out of Current Phase)

- Student login portal
- Parent login portal
- Attendance tracking system
- Fee management
- Timetable management
- Report card generation & PDF export
- SMS notifications
- Mobile app (React Native)
- Analytics dashboard with charts
- Bulk data import/export (CSV/Excel)
