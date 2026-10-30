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
| **Admin**  | Yes (Email + OTP) | Full system control — manage users, classes, sections, subjects, admissions, website content, AI settings, appoint head teachers, mark teacher attendance, manage fees/fines/scholarships/salaries/maintenance |
| **Teacher**| Yes (Email + OTP) | Manage assigned classes/sections, create tests/exams, enter marks, view student data; **head teachers** additionally mark student attendance for their section; view own salary records |
| **Student**| No (Phase 1)      | Data is managed by admins and teachers; no login required in current scope                       |
| **Support Staff** | No         | Non-login records — name, phone, designation, salary tracked by admin                            |
| **Principal**     | No         | Non-login record — profile and salary tracked by admin                                           |

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
    │              ├── teacher_subjects (pivot)
    │              ├── section_head_teachers
    │              ├── student_attendance (marked_by)
    │              ├── teacher_attendance
    │              └── salary_payments (employee_type = 'teacher')
    └── students ──┬── student_subjects (pivot)
                   ├── student_sections (pivot)
                   ├── student_attendance
                   ├── student_fees ──── fee_payments
                   ├── student_fines
                   └── student_scholarships

classes ──┬── sections ──┬── students
          │              └── section_head_teachers
          │
          │    ├── tests ──── test_marks
          │    └── exams ──── exam_marks
          │
          └── fee_structures

support_staff ──── salary_payments (employee_type = 'support_staff')
principal ──────── salary_payments (employee_type = 'principal')
maintenance_costs (monthly school expenses)

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
| salary     | numeric     | NOT NULL, DEFAULT 0      | Monthly base salary       |
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

#### `section_head_teachers`

Tracks head teacher assignments (permanent and temporary) per section.

| Column       | Type               | Constraints                           | Description                                    |
| ------------ | ------------------ | ------------------------------------- | ---------------------------------------------- |
| id           | uuid               | PK                                    | Unique identifier                              |
| section_id   | uuid               | FK → sections.id, NOT NULL            | The section                                    |
| teacher_id   | uuid               | FK → teachers.id, NOT NULL            | The assigned head teacher                      |
| type         | head_teacher_type  | NOT NULL, DEFAULT 'permanent'         | Permanent or temporary appointment             |
| expires_at   | timestamptz        | NULLABLE                              | Expiry timestamp (NULL for permanent)          |
| duration     | text               | CHECK IN ('1d','3d','7d','15d','30d') | Duration label (temporary only)                |
| appointed_by | uuid               | FK → profiles.id, NOT NULL            | Admin who made the appointment                 |
| created_at   | timestamptz        | DEFAULT now()                         | Record creation time                           |
| updated_at   | timestamptz        | DEFAULT now()                         | Last update time                               |
| CHECK        |                    | chk_temp_has_expiry                   | Temporary rows require expires_at and duration; permanent rows must have both NULL |
| UNIQUE INDEX |                    | (section_id) WHERE type = 'permanent' | One permanent head per section                 |
| UNIQUE INDEX |                    | (section_id) WHERE type = 'temporary' | One temporary head per section                 |

#### `student_attendance`

Daily student attendance records, marked by the section's head teacher.

| Column     | Type              | Constraints                     | Description                          |
| ---------- | ----------------- | ------------------------------- | ------------------------------------ |
| id         | uuid              | PK                              | Unique identifier                    |
| student_id | uuid              | FK → students.id, NOT NULL      | The student                          |
| section_id | uuid              | FK → sections.id, NOT NULL      | Section at the time of marking       |
| date       | date              | NOT NULL                        | Attendance date                      |
| status     | attendance_status | NOT NULL                        | present / absent / leave             |
| marked_by  | uuid              | FK → teachers.id, NOT NULL      | Head teacher who marked attendance   |
| remarks    | text              | NULLABLE                        | Optional notes                       |
| created_at | timestamptz       | DEFAULT now()                   | Record creation time                 |
| updated_at | timestamptz       | DEFAULT now()                   | Last update time                     |
| UNIQUE     |                   | (student_id, date)              | One attendance record per student per day |

#### `teacher_attendance`

Daily teacher attendance records, marked by the admin.

| Column     | Type              | Constraints                     | Description                          |
| ---------- | ----------------- | ------------------------------- | ------------------------------------ |
| id         | uuid              | PK                              | Unique identifier                    |
| teacher_id | uuid              | FK → teachers.id, NOT NULL      | The teacher                          |
| date       | date              | NOT NULL                        | Attendance date                      |
| status     | attendance_status | NOT NULL                        | present / absent / leave             |
| marked_by  | uuid              | FK → profiles.id, NOT NULL      | Admin who marked attendance          |
| remarks    | text              | NULLABLE                        | Optional notes                       |
| created_at | timestamptz       | DEFAULT now()                   | Record creation time                 |
| updated_at | timestamptz       | DEFAULT now()                   | Last update time                     |
| UNIQUE     |                   | (teacher_id, date)              | One attendance record per teacher per day |

#### `support_staff`

Non-login staff members — data tracked by admin only.

| Column      | Type        | Constraints   | Description                    |
| ----------- | ----------- | ------------- | ------------------------------ |
| id          | uuid        | PK            | Unique identifier              |
| full_name   | text        | NOT NULL      | Staff member's full name       |
| phone       | text        | NULLABLE      | Contact number                 |
| designation | text        | NULLABLE      | Role (Peon, Guard, Cleaner, etc.) |
| salary      | numeric     | NOT NULL, DEFAULT 0 | Monthly base salary      |
| created_at  | timestamptz | DEFAULT now() | Record creation time           |
| updated_at  | timestamptz | DEFAULT now() | Last update time               |

#### `principal`

School principal record (typically one row).

| Column        | Type        | Constraints   | Description                    |
| ------------- | ----------- | ------------- | ------------------------------ |
| id            | uuid        | PK            | Unique identifier              |
| full_name     | text        | NOT NULL      | Principal's full name          |
| phone         | text        | NULLABLE      | Contact number                 |
| email         | text        | NULLABLE      | Email address                  |
| qualification | text        | NULLABLE      | Educational qualification      |
| salary        | numeric     | NOT NULL, DEFAULT 0 | Monthly base salary      |
| avatar_url    | text        | NULLABLE      | Profile picture URL            |
| created_at    | timestamptz | DEFAULT now() | Record creation time           |
| updated_at    | timestamptz | DEFAULT now() | Last update time               |

#### `fee_structures`

Defines fee amounts per class, per type (tuition/transport), per academic year.

| Column        | Type        | Constraints                              | Description                    |
| ------------- | ----------- | ---------------------------------------- | ------------------------------ |
| id            | uuid        | PK                                       | Unique identifier              |
| class_id      | uuid        | FK → classes.id, NOT NULL                | Which class this fee applies to|
| fee_type      | fee_type    | NOT NULL                                 | tuition / transport            |
| amount        | numeric     | NOT NULL, CHECK >= 0                     | Fee amount                     |
| academic_year | text        | NOT NULL                                 | Academic year (e.g., 2026-27)  |
| created_at    | timestamptz | DEFAULT now()                            | Record creation time           |
| updated_at    | timestamptz | DEFAULT now()                            | Last update time               |
| UNIQUE        |             | (class_id, fee_type, academic_year)      | One fee per class/type/year    |

#### `student_fees`

Individual monthly fee records per student.

| Column               | Type        | Constraints                                         | Description                          |
| -------------------- | ----------- | --------------------------------------------------- | ------------------------------------ |
| id                   | uuid        | PK                                                  | Unique identifier                    |
| student_id           | uuid        | FK → students.id, NOT NULL                          | The student                          |
| fee_structure_id     | uuid        | FK → fee_structures.id, NOT NULL                    | Which fee structure                  |
| month                | integer     | NOT NULL, CHECK 1-12                                | Fee month                            |
| year                 | integer     | NOT NULL                                            | Fee year                             |
| gross_amount         | numeric     | NOT NULL, CHECK >= 0                                | Original amount                      |
| scholarship_discount | numeric     | NOT NULL, DEFAULT 0, CHECK >= 0                     | Scholarship deduction (tuition only) |
| fine_amount          | numeric     | NOT NULL, DEFAULT 0, CHECK >= 0                     | Any fines added                      |
| net_amount           | numeric     | NOT NULL, CHECK >= 0                                | gross - discount + fine              |
| status               | fee_status  | NOT NULL, DEFAULT 'pending'                         | pending / paid / partial / overdue   |
| due_date             | date        | NOT NULL                                            | Payment due date                     |
| created_at           | timestamptz | DEFAULT now()                                       | Record creation time                 |
| updated_at           | timestamptz | DEFAULT now()                                       | Last update time                     |
| UNIQUE               |             | (student_id, fee_structure_id, month, year)         | One record per student/fee/period    |

#### `fee_payments`

Actual payment transactions against student fees.

| Column         | Type        | Constraints                     | Description                    |
| -------------- | ----------- | ------------------------------- | ------------------------------ |
| id             | uuid        | PK                              | Unique identifier              |
| student_fee_id | uuid        | FK → student_fees.id, NOT NULL  | Which fee this pays            |
| amount_paid    | numeric     | NOT NULL, CHECK > 0             | Payment amount                 |
| payment_date   | date        | NOT NULL, DEFAULT CURRENT_DATE  | Date of payment                |
| received_by    | uuid        | FK → profiles.id, NOT NULL      | Admin who received payment     |
| remarks        | text        | NULLABLE                        | Optional notes                 |
| created_at     | timestamptz | DEFAULT now()                   | Record creation time           |

#### `student_fines`

Fines imposed on students by admin.

| Column     | Type        | Constraints                     | Description                    |
| ---------- | ----------- | ------------------------------- | ------------------------------ |
| id         | uuid        | PK                              | Unique identifier              |
| student_id | uuid        | FK → students.id, NOT NULL      | The student                    |
| amount     | numeric     | NOT NULL, CHECK > 0             | Fine amount                    |
| reason     | text        | NOT NULL                        | Reason for the fine            |
| imposed_by | uuid        | FK → profiles.id, NOT NULL      | Admin who imposed the fine     |
| is_paid    | boolean     | DEFAULT false                   | Whether the fine has been paid |
| paid_at    | timestamptz | NULLABLE                        | When the fine was paid         |
| created_at | timestamptz | DEFAULT now()                   | Record creation time           |
| updated_at | timestamptz | DEFAULT now()                   | Last update time               |

#### `student_scholarships`

Percentage-based scholarships — the percentage is deducted from tuition fees.

| Column              | Type        | Constraints                          | Description                          |
| ------------------- | ----------- | ------------------------------------ | ------------------------------------ |
| id                  | uuid        | PK                                   | Unique identifier                    |
| student_id          | uuid        | FK → students.id, NOT NULL           | The student                          |
| scholarship_percent | numeric     | NOT NULL, CHECK > 0 AND <= 100       | Percentage discount on tuition       |
| reason              | text        | NULLABLE                             | Reason for scholarship               |
| granted_by          | uuid        | FK → profiles.id, NOT NULL           | Admin who granted it                 |
| academic_year       | text        | NOT NULL                             | Academic year (e.g., 2026-27)        |
| is_active           | boolean     | DEFAULT true                         | Whether currently active             |
| created_at          | timestamptz | DEFAULT now()                        | Record creation time                 |
| updated_at          | timestamptz | DEFAULT now()                        | Last update time                     |
| UNIQUE              |             | (student_id, academic_year)          | One scholarship per student per year |

#### `salary_payments`

Unified monthly salary + optional bonus records for teachers, support staff, and principal.

| Column        | Type        | Constraints                                       | Description                          |
| ------------- | ----------- | ------------------------------------------------- | ------------------------------------ |
| id            | uuid        | PK                                                | Unique identifier                    |
| employee_type | text        | NOT NULL, CHECK IN ('teacher','support_staff','principal') | Which staff type              |
| employee_id   | uuid        | NOT NULL                                          | References teachers.id, support_staff.id, or principal.id |
| month         | integer     | NOT NULL, CHECK 1-12                              | Salary month                         |
| year          | integer     | NOT NULL                                          | Salary year                          |
| base_salary   | numeric     | NOT NULL, CHECK >= 0                              | Base salary amount                   |
| bonus         | numeric     | NOT NULL, DEFAULT 0, CHECK >= 0                   | Optional bonus amount                |
| total_amount  | numeric     | NOT NULL, CHECK >= 0                              | base_salary + bonus                  |
| paid_at       | timestamptz | NULLABLE                                          | When payment was disbursed           |
| created_at    | timestamptz | DEFAULT now()                                     | Record creation time                 |
| UNIQUE        |             | (employee_type, employee_id, month, year)         | One payment per employee per period  |

#### `maintenance_costs`

Monthly school maintenance and operational expenses.

| Column      | Type        | Constraints        | Description                              |
| ----------- | ----------- | ------------------ | ---------------------------------------- |
| id          | uuid        | PK                 | Unique identifier                        |
| title       | text        | NOT NULL           | Expense title                            |
| description | text        | NULLABLE           | Detailed description                     |
| amount      | numeric     | NOT NULL, CHECK > 0| Expense amount                           |
| month       | integer     | NOT NULL, CHECK 1-12 | Expense month                          |
| year        | integer     | NOT NULL           | Expense year                             |
| category    | text        | NULLABLE           | Category (Electricity, Water, Repairs, etc.) |
| created_at  | timestamptz | DEFAULT now()      | Record creation time                     |
| updated_at  | timestamptz | DEFAULT now()      | Last update time                         |

### 4.3 Enums

```sql
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');
CREATE TYPE admission_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE student_status AS ENUM ('active', 'inactive', 'graduated');
CREATE TYPE head_teacher_type AS ENUM ('permanent', 'temporary');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'leave');
CREATE TYPE fee_type AS ENUM ('tuition', 'transport');
CREATE TYPE fee_status AS ENUM ('pending', 'paid', 'partial', 'overdue');
```

### 4.4 Helper Functions

#### `is_active_head_teacher(p_teacher_id, p_section_id)`

Returns `true` if the given teacher is the currently **active** head teacher of the given section. A non-expired temporary head teacher takes precedence over the permanent one.

```sql
CREATE OR REPLACE FUNCTION is_active_head_teacher(p_teacher_id uuid, p_section_id uuid)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM section_head_teachers
    WHERE teacher_id = p_teacher_id
      AND section_id = p_section_id
      AND (
        (type = 'temporary' AND expires_at > now())
        OR
        (type = 'permanent' AND NOT EXISTS (
          SELECT 1 FROM section_head_teachers t
          WHERE t.section_id = p_section_id
            AND t.type = 'temporary'
            AND t.expires_at > now()
        ))
      )
  );
$$;
```

#### `get_teacher_id_for_auth()`

Returns the `teachers.id` for the currently authenticated user.

```sql
CREATE OR REPLACE FUNCTION get_teacher_id_for_auth()
RETURNS uuid
LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT id FROM teachers WHERE profile_id = auth.uid();
$$;
```

Both functions have `EXECUTE` revoked from `public` and `anon`; granted only to `authenticated`.

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
- **Head Teachers**: INSERT/UPDATE/SELECT on `student_attendance` for their section (via `is_active_head_teacher()`)
- **Teachers (non-head)**: SELECT own records from `teacher_attendance`
- **Students**: No direct database access (Phase 1)
- **Public**: Read-only access to `site_settings` for the public website

#### Attendance-Specific RLS Policies

| Table                    | Policy Name                              | Operation | Role     | Rule                                                                 |
| ------------------------ | ---------------------------------------- | --------- | -------- | -------------------------------------------------------------------- |
| `section_head_teachers`  | `admin_all_section_heads`                | ALL       | Admin    | Full CRUD                                                            |
| `section_head_teachers`  | `teacher_select_section_heads`           | SELECT    | Teacher  | Read-only (check own head-teacher status)                            |
| `student_attendance`     | `admin_select_student_attendance`        | SELECT    | Admin    | Full read access                                                     |
| `student_attendance`     | `head_teacher_select_student_attendance` | SELECT    | Teacher  | Only rows where teacher is active head of the section                |
| `student_attendance`     | `head_teacher_insert_student_attendance` | INSERT    | Teacher  | Only for sections where teacher is active head; `marked_by` must match |
| `student_attendance`     | `head_teacher_update_student_attendance` | UPDATE    | Teacher  | Only for sections where teacher is active head; `marked_by` must match |
| `teacher_attendance`     | `admin_all_teacher_attendance`           | ALL       | Admin    | Full CRUD                                                            |
| `teacher_attendance`     | `teacher_select_own_attendance`          | SELECT    | Teacher  | Own records only (`teacher_id` matches authenticated teacher)        |

#### Financial RLS Policies

| Table                  | Policy Name                        | Operation | Role    | Rule                                                   |
| ---------------------- | ---------------------------------- | --------- | ------- | ------------------------------------------------------ |
| `support_staff`        | `admin_all_support_staff`          | ALL       | Admin   | Full CRUD                                              |
| `principal`            | `admin_all_principal`              | ALL       | Admin   | Full CRUD                                              |
| `fee_structures`       | `admin_all_fee_structures`         | ALL       | Admin   | Full CRUD                                              |
| `student_fees`         | `admin_all_student_fees`           | ALL       | Admin   | Full CRUD                                              |
| `fee_payments`         | `admin_all_fee_payments`           | ALL       | Admin   | Full CRUD                                              |
| `student_fines`        | `admin_all_student_fines`          | ALL       | Admin   | Full CRUD                                              |
| `student_scholarships` | `admin_all_student_scholarships`   | ALL       | Admin   | Full CRUD                                              |
| `salary_payments`      | `admin_all_salary_payments`        | ALL       | Admin   | Full CRUD                                              |
| `salary_payments`      | `teacher_select_own_salary`        | SELECT    | Teacher | Own records only (employee_type='teacher', employee_id matches) |
| `maintenance_costs`    | `admin_all_maintenance_costs`      | ALL       | Admin   | Full CRUD                                              |

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
│   │   ├── head-teachers/
│   │   │   └── page.tsx         # Appoint/manage head teachers
│   │   ├── attendance/
│   │   │   ├── page.tsx         # Teacher attendance overview
│   │   │   ├── teachers/
│   │   │   │   └── page.tsx     # Mark/view daily teacher attendance
│   │   │   └── reports/
│   │   │       └── page.tsx     # Attendance reports & summaries
│   │   ├── fees/
│   │   │   ├── page.tsx         # Fee structures overview
│   │   │   ├── structures/
│   │   │   │   └── page.tsx     # Manage fee structures per class
│   │   │   ├── collection/
│   │   │   │   └── page.tsx     # Collect fee payments
│   │   │   └── reports/
│   │   │       └── page.tsx     # Fee collection reports
│   │   ├── fines/
│   │   │   └── page.tsx         # Manage student fines
│   │   ├── scholarships/
│   │   │   └── page.tsx         # Manage student scholarships
│   │   ├── salaries/
│   │   │   ├── page.tsx         # Salary overview (all staff)
│   │   │   └── payments/
│   │   │       └── page.tsx     # Process monthly salary payments
│   │   ├── staff/
│   │   │   ├── page.tsx         # Support staff list
│   │   │   └── principal/
│   │   │       └── page.tsx     # Principal profile
│   │   ├── maintenance/
│   │   │   └── page.tsx         # Monthly maintenance costs
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
│       ├── attendance/
│       │   ├── page.tsx         # Mark daily student attendance (head teachers only)
│       │   └── history/
│       │       └── page.tsx     # View attendance history for section
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
│   ├── site-settings.ts
│   ├── attendance.ts            # Student & teacher attendance queries
│   ├── head-teachers.ts         # Head teacher assignment queries
│   ├── fees.ts                  # Fee structures, student fees, payments
│   ├── fines.ts                 # Student fines queries
│   ├── scholarships.ts          # Student scholarship queries
│   ├── salaries.ts              # Salary payment queries (all staff types)
│   ├── staff.ts                 # Support staff & principal queries
│   └── maintenance.ts           # Maintenance cost queries
├── actions/                     # Server Actions
│   ├── auth.ts
│   ├── users.ts
│   ├── classes.ts
│   ├── students.ts
│   ├── teachers.ts
│   ├── tests.ts
│   ├── exams.ts
│   ├── admissions.ts
│   ├── attendance.ts            # Mark/update student & teacher attendance
│   ├── head-teachers.ts         # Appoint/remove/replace head teachers
│   ├── fees.ts                  # Manage fee structures, collect payments
│   ├── fines.ts                 # Impose/pay student fines
│   ├── scholarships.ts          # Grant/revoke scholarships
│   ├── salaries.ts              # Process salary + bonus payments
│   ├── staff.ts                 # CRUD support staff & principal
│   └── maintenance.ts           # Record maintenance costs
├── validations/                 # Zod schemas
│   ├── auth.ts
│   ├── student.ts
│   ├── teacher.ts
│   ├── class.ts
│   ├── admission.ts
│   ├── attendance.ts            # Attendance form schemas
│   ├── head-teacher.ts          # Head teacher assignment schemas
│   ├── fee.ts                   # Fee structure & payment schemas
│   ├── fine.ts                  # Student fine schemas
│   ├── scholarship.ts           # Scholarship schemas
│   ├── salary.ts                # Salary payment schemas
│   ├── staff.ts                 # Support staff & principal schemas
│   └── maintenance.ts           # Maintenance cost schemas
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
│   ├── admission-form.tsx
│   ├── mark-attendance-form.tsx  # Mark student/teacher attendance
│   ├── head-teacher-form.tsx     # Appoint head teacher
│   ├── fee-structure-form.tsx    # Define fee structures
│   ├── fee-payment-form.tsx      # Collect fee payment
│   ├── fine-form.tsx             # Impose student fine
│   ├── scholarship-form.tsx      # Grant scholarship
│   ├── salary-payment-form.tsx   # Process salary/bonus
│   ├── staff-form.tsx            # Add/edit support staff or principal
│   └── maintenance-form.tsx      # Record maintenance cost
├── tables/
│   ├── students-table.tsx
│   ├── teachers-table.tsx
│   ├── marks-table.tsx
│   ├── student-attendance-table.tsx  # Student attendance records
│   ├── teacher-attendance-table.tsx  # Teacher attendance records
│   ├── fees-table.tsx                # Student fee records
│   ├── fines-table.tsx               # Student fines
│   ├── scholarships-table.tsx        # Scholarships
│   ├── salary-table.tsx              # Salary payments
│   ├── staff-table.tsx               # Support staff list
│   └── maintenance-table.tsx         # Maintenance costs
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

### 7.6 Attendance System

#### Head Teacher Assignments

Each section has **one permanent head teacher** appointed by the admin. A teacher can only be head teacher of **one section at a time**. The admin can also appoint a **temporary head teacher** (who must not currently be a head teacher of any section) for a fixed duration: 1 day, 3 days, 7 days, 15 days, or 30 days.

The "active" head teacher is determined by precedence:
1. If a **temporary** head teacher exists and `expires_at > now()`, they are active
2. Otherwise, the **permanent** head teacher is active
3. Expired temporary records remain in the table but are ignored at query time

```
Admin appoints Head Teacher
    ↓
section_head_teachers record created (type = 'permanent')
    ↓
[Optional] Admin appoints Temporary Head Teacher
    ↓
section_head_teachers record created (type = 'temporary', expires_at set)
    ↓
Active head = temporary (while not expired) > permanent
```

#### Student Attendance

- Marked by the **active head teacher** of the section
- One record per student per day
- Statuses: present, absent, leave
- Head teacher sees only their section's students
- Admin has read-only access to all student attendance

#### Teacher Attendance

- Marked by the **admin**
- One record per teacher per day
- Statuses: present, absent, leave
- Teachers can view their own attendance records (read-only)

### 7.7 Financial Management

#### Fee System

Two fee types per class: **tuition** (required) and **transport** (optional).

```
Admin defines Fee Structures (per class, per type, per academic year)
    ↓
System generates Student Fees monthly (gross amount from structure)
    ↓
Scholarship discount applied to tuition fees (if student has active scholarship)
    ↓
Fines added to net amount (if any unpaid fines)
    ↓
net_amount = gross_amount - scholarship_discount + fine_amount
    ↓
Admin collects Fee Payments → status updated (pending → partial → paid)
```

- Fee structures are defined per class per academic year
- Transport fees are optional — only assigned to students who use transport
- Scholarships are percentage-based and deducted from tuition fees only
- Multiple partial payments are supported per fee record
- Fee status transitions: pending → partial (some paid) → paid (fully paid); overdue (past due date)

#### Fines

- Admin imposes fines on individual students with a reason
- Fines are tracked separately and can be linked to fee records
- Each fine has an `is_paid` flag and `paid_at` timestamp

#### Scholarships

- Admin grants scholarships as a percentage (1-100%) per student per academic year
- The percentage is deducted from tuition fees when generating monthly fee records
- One active scholarship per student per academic year
- Can be deactivated without deleting (preserves history)

#### Salary Management

All staff types (teachers, support staff, principal) have base salaries stored on their respective tables. Monthly salary payments are recorded in a unified `salary_payments` table.

- **Base salary**: Stored on `teachers.salary`, `support_staff.salary`, `principal.salary`
- **Monthly payments**: Recorded in `salary_payments` with optional `bonus`
- **total_amount** = base_salary + bonus
- Teachers can view their own salary history (read-only)

#### Support Staff

- Non-login records managed by admin
- Fields: name, phone, designation (e.g., Peon, Guard, Cleaner), salary
- Included in salary payment system

#### Principal

- Non-login record managed by admin (typically one row)
- Fields: name, phone, email, qualification, salary, avatar
- Included in salary payment system

#### Maintenance Costs

- Admin records monthly school expenses
- Each entry: title, description, amount, month/year, category
- Categories: Electricity, Water, Repairs, Supplies, etc.
- Used for financial reporting and budgeting

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

### 11.1 Database Indexes (68 custom indexes)

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
| `idx_section_heads_teacher_id`    | section_head_teachers | teacher_id          |
| `idx_section_heads_section_id`    | section_head_teachers | section_id          |
| `idx_student_attendance_section_id`   | student_attendance | section_id         |
| `idx_student_attendance_marked_by`    | student_attendance | marked_by          |
| `idx_student_attendance_student_id`   | student_attendance | student_id         |
| `idx_teacher_attendance_marked_by`    | teacher_attendance | marked_by          |
| `idx_teacher_attendance_teacher_id`   | teacher_attendance | teacher_id         |
| `idx_fee_structures_class_id`         | fee_structures     | class_id           |
| `idx_student_fees_student_id`         | student_fees       | student_id         |
| `idx_student_fees_fee_structure_id`   | student_fees       | fee_structure_id   |
| `idx_fee_payments_student_fee_id`     | fee_payments       | student_fee_id     |
| `idx_fee_payments_received_by`        | fee_payments       | received_by        |
| `idx_student_fines_student_id`        | student_fines      | student_id         |
| `idx_student_fines_imposed_by`        | student_fines      | imposed_by         |
| `idx_student_scholarships_student_id` | student_scholarships | student_id       |

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
| `idx_section_heads_expires_at`    | section_head_teachers | expires_at   | Expiry lookups for temporary head teachers           |
| `idx_student_attendance_date`     | student_attendance    | date         | Filter attendance by date                            |
| `idx_student_attendance_section_date` | student_attendance | section_id, date | Bulk lookup: all students in a section on a day  |
| `idx_teacher_attendance_date`     | teacher_attendance    | date         | Filter teacher attendance by date                    |
| `idx_fee_structures_academic_year`| fee_structures        | academic_year | Filter fee structures by year                       |
| `idx_fee_structures_fee_type`     | fee_structures        | fee_type     | Filter by tuition/transport                          |
| `idx_student_fees_status`         | student_fees          | status       | Filter pending/paid/partial/overdue fees             |
| `idx_student_fees_due_date`       | student_fees          | due_date     | Find overdue fees                                    |
| `idx_student_fees_month_year`     | student_fees          | year, month  | Lookup fees by period                                |
| `idx_fee_payments_payment_date`   | fee_payments          | payment_date | Filter payments by date                              |
| `idx_student_fines_is_paid`       | student_fines         | is_paid      | Filter paid/unpaid fines                             |
| `idx_student_scholarships_academic_year` | student_scholarships | academic_year | Filter by academic year                        |
| `idx_student_scholarships_is_active`     | student_scholarships | is_active    | Filter active scholarships                     |
| `idx_salary_payments_employee`    | salary_payments       | employee_type, employee_id | Lookup salary by employee              |
| `idx_salary_payments_month_year`  | salary_payments       | year, month  | Lookup salaries by period                            |
| `idx_salary_payments_paid_at`     | salary_payments       | paid_at      | Filter paid/unpaid salaries                          |
| `idx_maintenance_costs_month_year`| maintenance_costs     | year, month  | Lookup costs by period                               |
| `idx_maintenance_costs_category`  | maintenance_costs     | category     | Filter by expense category                           |

#### Partial Unique Indexes (Attendance)

| Index                                 | Table                 | Column(s)  | Condition              | Purpose                              |
| ------------------------------------- | --------------------- | ---------- | ---------------------- | ------------------------------------ |
| `idx_unique_section_permanent_head`   | section_head_teachers | section_id | WHERE type = 'permanent' | One permanent head per section     |
| `idx_unique_section_temporary_head`   | section_head_teachers | section_id | WHERE type = 'temporary' | One temporary head per section     |

> **Note**: UNIQUE constraints on `profiles.email`, `classes.name`, `subjects.code`, `teachers.employee_id`, `teachers.profile_id`, all pivot table composite keys, `(student_id, date)` on `student_attendance`, and `(teacher_id, date)` on `teacher_attendance` also create implicit indexes (not counted above).

---

## 12. Future Scope (Out of Current Phase)

- Student login portal
- Parent login portal
- Timetable management
- Report card generation & PDF export
- SMS notifications
- Mobile app (React Native)
- Analytics dashboard with charts
- Bulk data import/export (CSV/Excel)
