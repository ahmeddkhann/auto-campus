import "server-only";

import { getSession } from "@/lib/auth/session";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Verifies the signed session cookie and loads the matching profile.
 */
export async function verifySession() {
  const session = await getSession();

  if (!session) {
    return { user: null, profile: null };
  }

  const admin = createSupabaseAdmin();
  const { data: profile, error } = await admin
    .from("profiles")
    .select("*")
    .eq("id", session.sub)
    .maybeSingle();

  if (error || !profile) {
    return { user: session, profile: null };
  }

  return { user: session, profile };
}

/**
 * Returns the current user's profile, or null when not signed in.
 */
export async function getUser() {
  const { profile } = await verifySession();
  return profile;
}

export async function requireAdmin() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    const err = new Error("Admin access required");
    err.name = "ForbiddenError";
    throw err;
  }

  return session;
}

export async function requireTeacher() {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    const err = new Error("Teacher access required");
    err.name = "ForbiddenError";
    throw err;
  }

  return session;
}

/**
 * Gets the `teachers.id` for the currently authenticated user.
 */
export async function getTeacherIdForAuth(): Promise<string | null> {
  const session = await getSession();
  if (!session) return null;

  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("teachers")
    .select("id")
    .eq("profile_id", session.sub)
    .maybeSingle();

  if (error) {
    console.error("Error getting teacher ID for auth:", error);
    return null;
  }

  return data?.id ?? null;
}
