import "server-only";

import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function listSalaryBases() {
  const admin = createSupabaseAdmin();
  const [teachers, staff, principal] = await Promise.all([
    admin
      .from("teachers")
      .select("id, salary, employee_id, profiles(full_name)")
      .then(({ data, error }) => {
        if (error) throw error;
        return data ?? [];
      }),
    admin
      .from("support_staff")
      .select("id, salary, full_name, designation")
      .then(({ data, error }) => {
        if (error) throw error;
        return data ?? [];
      }),
    admin
      .from("principal")
      .select("id, salary, full_name")
      .then(({ data, error }) => {
        if (error) throw error;
        return data ?? [];
      }),
  ]);

  return { teachers, staff, principal };
}

export async function listSalaryPayments({
  month,
  year,
  employeeType,
}: {
  month?: number;
  year?: number;
  employeeType?: string;
} = {}) {
  const admin = createSupabaseAdmin();
  let query = admin
    .from("salary_payments")
    .select("*")
    .order("created_at", { ascending: false });

  if (month) query = query.eq("month", month);
  if (year) query = query.eq("year", year);
  if (employeeType) query = query.eq("employee_type", employeeType);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
