"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import {
  hasServiceRoleEnv,
  hasSessionSecret,
  hasSupabaseEnv,
} from "@/lib/supabase/env";
import { loginSchema, signupSchema } from "@/validations/auth";
import {
  consumeOTP,
  generateOTP,
  getLatestOTP,
  hashOTP,
  storeOTP,
  verifyOTP as verifyOTPHash,
} from "@/lib/auth/otp";
import {
  sendAdminNotification,
  sendOTPEmail,
} from "@/lib/auth/mail";
import {
  clearPendingAuthCookie,
  createSessionCookie,
  destroySession,
  getPendingAuth,
  setPendingAuthCookie,
} from "@/lib/auth/session";
import { roleHome, type UserRole } from "@/lib/auth/jwt";

export type AuthState = { error: string } | null;

function isUserRole(value: unknown): value is UserRole {
  return value === "admin" || value === "teacher" || value === "student";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validated = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { error: "Please enter a valid email and password." };
  }

  if (!hasSupabaseEnv() || !hasServiceRoleEnv() || !hasSessionSecret()) {
    return {
      error:
        "Authentication is not configured yet. Add the Supabase and session variables to .env.local.",
    };
  }

  const { email, password } = validated.data;
  const supabase = await createClient();

  // Step 1: Validate credentials against Supabase Auth.
  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !data.user) {
    return { error: "Invalid email or password." };
  }

  // Step 2: Look up the application role.
  const admin = createSupabaseAdmin();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || !profile || !isUserRole(profile.role)) {
    await supabase.auth.signOut();
    return { error: "This account is not configured for access." };
  }

  const emailLower = data.user.email?.toLowerCase() ?? email.toLowerCase();
  const sessionUser = {
    sub: data.user.id,
    email: emailLower,
    role: profile.role,
  };

  // Teachers skip OTP and receive a session immediately.
  if (profile.role === "teacher") {
    await createSessionCookie(sessionUser);
    redirect(roleHome("teacher"));
  }

  // Admins require email OTP verification before a session is created.
  const otpCode = generateOTP();
  const hashedOTP = await hashOTP(otpCode);

  try {
    await storeOTP(emailLower, hashedOTP);
    await sendOTPEmail(emailLower, otpCode);
    await setPendingAuthCookie(sessionUser);
  } catch (error) {
    console.error("Could not start OTP verification:", error);
    return {
      error:
        "We could not send the verification code. Check the email settings and try again.",
    };
  }

  redirect("/verify-otp");
}

export async function verifyOTP(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const code = String(formData.get("code") ?? "").trim();

  if (!/^\d{6}$/.test(code)) {
    return { error: "Please enter the 6-digit code from your email." };
  }

  if (!hasServiceRoleEnv() || !hasSessionSecret()) {
    return {
      error:
        "Authentication is not configured yet. Add the Supabase and session variables to .env.local.",
    };
  }

  const pending = await getPendingAuth();

  if (!pending) {
    return {
      error: "Your verification window expired. Please sign in again.",
    };
  }

  const otp = await getLatestOTP(pending.email);

  if (!otp) {
    return { error: "No verification code found. Please sign in again." };
  }

  if (otp.used) {
    return { error: "This code has already been used. Please sign in again." };
  }

  if (new Date(otp.expires_at).getTime() < Date.now()) {
    return { error: "This code has expired. Please sign in again." };
  }

  const valid = await verifyOTPHash(code, otp.code);

  if (!valid) {
    return { error: "That code is incorrect. Please try again." };
  }

  await consumeOTP(otp.id);
  await createSessionCookie(pending);
  await clearPendingAuthCookie();

  redirect(roleHome(pending.role));
}

export async function signup(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validated = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
  });

  if (!validated.success) {
    return {
      error:
        validated.error.issues[0]?.message ??
        "Please check the information you entered.",
    };
  }

  if (!hasServiceRoleEnv() || !hasSessionSecret()) {
    return {
      error:
        "Authentication is not configured yet. Add the Supabase and session variables to .env.local.",
    };
  }

  const { email, password, fullName } = validated.data;
  const emailLower = email.toLowerCase();
  const admin = createSupabaseAdmin();

  // Step 1: Create the Supabase Auth user.
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: emailLower,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (authError || !authData.user) {
    if (authError?.message.toLowerCase().includes("already")) {
      return { error: "An account with this email already exists." };
    }
    return { error: authError?.message ?? "Could not create the account." };
  }

  // Step 2: Create the matching profile record.
  const { error: profileError } = await admin.from("profiles").insert({
    id: authData.user.id,
    full_name: fullName,
    email: emailLower,
    role: "admin",
  });

  if (profileError) {
    console.error("Could not create profile:", profileError);
    await admin.auth.admin.deleteUser(authData.user.id);
    return { error: "Could not create the account profile. Please try again." };
  }

  // Notify the configured admin address. This is best-effort and never
  // blocks account creation.
  try {
    await sendAdminNotification({
      subject: "New Auto Campus admin account created",
      html: `
        <p>A new administrator account was created.</p>
        <ul>
          <li><strong>Name:</strong> ${escapeHtml(fullName)}</li>
          <li><strong>Email:</strong> ${escapeHtml(emailLower)}</li>
        </ul>
      `,
    });
  } catch (error) {
    console.error("Could not send admin notification:", error);
  }

  // Step 3: Generate and deliver a one-time password.
  const otpCode = generateOTP();
  const hashedOTP = await hashOTP(otpCode);

  try {
    await storeOTP(emailLower, hashedOTP);
    await sendOTPEmail(emailLower, otpCode);
    await setPendingAuthCookie({
      sub: authData.user.id,
      email: emailLower,
      role: "admin",
    });
  } catch (error) {
    console.error("Could not start OTP verification:", error);
    return {
      error:
        "Your account was created, but we could not send the verification code. Check the email settings and try signing in.",
    };
  }

  redirect("/verify-otp");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  await destroySession();
  revalidatePath("/", "layout");
  redirect("/login");
}
