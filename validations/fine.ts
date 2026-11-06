import { z } from "zod";

export const imposeFineSchema = z.object({
  student_id: z.string().uuid(),
  amount: z.coerce.number().gt(0),
  reason: z.string().min(2).max(500),
});
