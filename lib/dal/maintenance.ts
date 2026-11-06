import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function listMaintenanceCosts({
  month,
  year,
  category,
}: {
  month?: number;
  year?: number;
  category?: string;
} = {}) {
  const admin = createSupabaseAdmin();
  let query = admin
    .from("maintenance_costs")
    .select("*")
    .order("year", { ascending: false })
    .order("month", { ascending: false })
    .order("created_at", { ascending: false });

  if (month) query = query.eq("month", month);
  if (year) query = query.eq("year", year);
  if (category) query = query.ilike("category", category);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getMaintenanceMonthlySummary(year?: number) {
  const admin = createSupabaseAdmin();
  let query = admin
    .from("maintenance_costs")
    .select("month, year, amount");

  if (year) query = query.eq("year", year);

  const { data, error } = await query;
  if (error) throw error;

  const map = new Map<string, number>();
  for (const row of data ?? []) {
    const key = `${row.year}-${row.month}`;
    map.set(key, (map.get(key) ?? 0) + Number(row.amount));
  }

  return Array.from(map.entries())
    .map(([key, total]) => {
      const [y, m] = key.split("-").map(Number);
      return { year: y, month: m, total };
    })
    .sort((a, b) => b.year - a.year || b.month - a.month);
}

export async function getMaintenanceCost(id: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("maintenance_costs")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
