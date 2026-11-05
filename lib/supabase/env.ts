export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

/**
 * Supabase now issues publishable keys. Fall back to the legacy anon key so
 * existing environments keep working.
 */
export function getSupabasePublishableKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Supabase now issues secret keys. Fall back to the legacy service-role key.
 * This must only be used on the server.
 */
export function getSupabaseSecretKey() {
  return process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function hasSupabaseEnv() {
  return Boolean(getSupabaseUrl() && getSupabasePublishableKey());
}

export function hasServiceRoleEnv() {
  return Boolean(hasSupabaseEnv() && getSupabaseSecretKey());
}

export function hasSessionSecret() {
  return Boolean(process.env.SESSION_SECRET);
}
