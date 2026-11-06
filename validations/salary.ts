import { z } from "zod";

export const processSalariesSchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
  entries: z.array(
    z.object({
      employee_type: z.enum(["teacher", "support_staff", "principal"]),
      employee_id: z.string().uuid(),
      base_salary: z.coerce.number().min(0),
      bonus: z.coerce.number().min(0).default(0),
    })
  ),
});
