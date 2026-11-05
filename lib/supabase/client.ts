"use client";

import { createBrowserClient } from "@supabase/ssr";

import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

/**
 * Creates a Supabase client for use in Client Components.
 */
export function createClient() {
  return createBrowserClient(
    getSupabaseUrl()!,
    getSupabasePublishableKey()!
  );
}
