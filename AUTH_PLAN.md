# Authentication Plan — Auto Campus

## 1. Overview
The authentication system uses a **two-step verification flow** with Supabase Auth as the underlying auth provider, complemented by OTP (One-Time Password) verification for session creation. This approach balances security with the requirement for Gmail SMTP OTP delivery.

## 2. Authentication Flow

### Step 1: Email + Password Login
- User enters email and password on the login page
- Server validates credentials against **Supabase Auth** (`auth.users` table)
- If valid → Generate 6-digit OTP → Store hashed OTP in `otp_codes` table (5-min expiry)
- Send OTP to email via **Nodemailer + Gmail SMTP**
- Redirect user to OTP verification page

### Step 2: OTP Verification
- User enters 6-digit OTP on the verification page
- Server verifies the OTP against the stored hash in `otp_codes`
- Check that OTP has not expired (5 minutes) and has not been used
- If valid → Create a **JWT session** cookie (HttpOnly, Secure, SameSite, 7-day expiry)
- Redirect user to role-based dashboard:
  - **Admin** → `/admin` dashboard
  - **Teacher** → `/teacher` dashboard

### Step 3: Session Management
- Session cookie is encrypted using `jose` library
- `verifySession()` function is cached with React `cache()` for performance
- Session refresh on each protected route visit
- Logout destroys the session cookie and signs out from Supabase Auth

## 3. User Roles & Route Protection

| Route Pattern | Access Rule |
|---------------|-------------|
| `/` | Public (customizable landing page) |
| `/login` | Public |
| `/admission` | Public |
| `/admin/*` | **Admin only** — redirects to `/login` if not authenticated as admin |
| `/teacher/*` | **Teacher only** — redirects to `/login` if not authenticated as teacher |
| `/api/webhooks/*` | Authenticated + verified source |
| `/api/auth/*` | Authenticated |

### Role Determination
- After OTP verification, the system checks the user's `role` in the `profiles` table
- `role = 'admin'` → admin dashboard
- `role = 'teacher'` → teacher dashboard
- Users with no profile or unrecognized role → redirected to `/login`

## 4. Components & Files

### 4.1 `app/(auth)/login/page.tsx` — Shared Login Page
A single login page that works for both admin and teachers. After login, the role is determined and the user is redirected appropriately.

### 4.2 `app/(auth)/verify-otp/page.tsx` — OTP Verification Page
- 6-digit OTP input with auto-focus and auto-advance
- Server Action verifies OTP → creates session → redirects to dashboard

### 4.3 `lib/auth/session.ts` — Session Management
- JWT encrypt/decrypt using `jose` library
- Cookie settings: HttpOnly, Secure, SameSite, 7-day expiry
- `verifySession()` — cached with React `cache()`

### 4.4 `lib/auth/otp.ts` — OTP System
- `generateOTP()` — crypto-secure 6-digit code
- `hashOTP()` / `verifyOTP()` — bcrypt hash/compare
- `storeOTP()` — save to `otp_codes` with 5-min expiry
- `cleanupExpiredOTPs()` — delete expired records

### 4.5 `lib/auth/mail.ts` — Email Service
- Nodemailer transport with Gmail SMTP
- OTP email template (HTML)
- `sendOTPEmail()` function

### 4.6 `proxy.ts` — Route Protection (Next.js 16)
- Decrypts session from cookie
- Redirects unauthenticated users to `/login`
- Redirects authenticated users away from auth pages
- Role-based route protection (`/admin/*` → admin only, `/teacher/*` → teacher only)

### 4.7 `lib/dal/auth.ts` — Data Access Layer
- `verifySession()` — cached session verification
- `getUser()` — fetch current user profile
- `requireAdmin()` — throw if not admin
- `requireTeacher()` — throw if not teacher

## 5. OTP Implementation Details

- **Generation**: Cryptographically secure 6-digit numeric code (000000-999999)
- **Storage**: Hashed using bcrypt in `otp_codes` table with **5-minute expiry**
- **Delivery**: Nodemailer with Gmail SMTP (App Password required)
- **Verification**: Compare hashed code, check expiry, mark as used in `otp_codes`
- **Rate Limiting**: Max 3 OTP requests per email per 15 minutes (enforced in server action)

## 6. Environment Variables Required (Phase 2)

| Variable | Description | Source |
|----------|-------------|--------|
| `SESSION_SECRET` | Secret key for JWT signing | Generated |
| `GMAIL_USER` | Gmail account for OTP email delivery | Gmail account |
| `GMAIL_APP_PASSWORD` | Gmail App Password for SMTP | Gmail settings |

## 7. Phase 2 Deliverables

- [ ] Login page with email/password (shared for admin/teacher)
- [ ] OTP generation, sending, and verification working
- [ ] Session management (create, verify, refresh, delete)
- [ ] Route protection via proxy.ts
- [ ] Role-based redirects (admin → /admin, teacher → /teacher)
- [ ] Logout functionality
- [ ] OTP rate limiting
- [ ] Error handling and toast notifications

## 8. Database Schema Support

The `otp_codes` table (already created in Phase 1 migration) stores:
- `id` (uuid, PK)
- `email` (text, NOT NULL) — Email the OTP was sent to
- `code` (text, NOT NULL) — **Hashed** OTP code (bcrypt)
- `expires_at` (timestamptz, NOT NULL) — Expiration timestamp
- `used` (boolean, DEFAULT false) — Whether OTP was consumed
- `created_at` (timestamptz, DEFAULT now())

RLS on `otp_codes` is enabled with no policies — managed exclusively via service-role key.