import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import {
  getSupabaseSecretKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

/**
 * Service-role/secret client for privileged server-side operations.
 * Never import this module into a Client Component.
 */
export function createSupabaseAdmin() {
  return createSupabaseClient(
    getSupabaseUrl()!,
    getSupabaseSecretKey()!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
