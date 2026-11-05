import "server-only";

import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const OTP_EXPIRY_MINUTES = 5;

/**
 * Generates a cryptographically secure 6-digit OTP code.
 */
export function generateOTP(): string {
  return randomInt(100000, 1000000).toString();
}

/**
 * Hashes the OTP code using bcrypt.
 */
export async function hashOTP(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

/**
 * Verifies a plain OTP code against a hashed OTP.
 */
export async function verifyOTP(
  plainOTP: string,
  hashedOTP: string
): Promise<boolean> {
  return bcrypt.compare(plainOTP, hashedOTP);
}

/**
 * Stores the OTP in the database with a 5-minute expiry.
 * `otp_codes` has RLS enabled without policies, so the service-role client is required.
 */
export async function storeOTP(
  email: string,
  hashedOTP: string
): Promise<void> {
  const supabase = createSupabaseAdmin();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  const { error } = await supabase.from("otp_codes").insert({
    email: email.toLowerCase(),
    code: hashedOTP,
    expires_at: expiresAt.toISOString(),
    used: false,
  });

  if (error) {
    console.error("Error storing OTP:", error);
    throw new Error("Failed to store OTP. Please try again.");
  }
}

/**
 * Fetches the most recently created OTP for an email address.
 */
export async function getLatestOTP(email: string) {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from("otp_codes")
    .select("id, email, code, expires_at, used")
    .eq("email", email.toLowerCase())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching OTP:", error);
    return null;
  }

  return data;
}

/**
 * Marks an OTP as used so it cannot be replayed.
 */
export async function consumeOTP(id: string): Promise<void> {
  const supabase = createSupabaseAdmin();
  await supabase.from("otp_codes").update({ used: true }).eq("id", id);
}

/**
 * Deletes expired, unused OTP records. Intended to be called periodically.
 */
export async function cleanupExpiredOTPs(): Promise<void> {
  const supabase = createSupabaseAdmin();

  const { error } = await supabase
    .from("otp_codes")
    .delete()
    .lt("expires_at", new Date().toISOString())
    .eq("used", false);

  if (error) {
    console.error("Error cleaning up expired OTPs:", error);
  }
}
