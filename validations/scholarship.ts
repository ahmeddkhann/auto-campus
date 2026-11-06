import { z } from "zod";

export const grantScholarshipSchema = z.object({
  student_id: z.string().uuid(),
  scholarship_percent: z.coerce.number().gt(0).lte(100),
  reason: z.string().max(500).optional().or(z.literal("")),
  academic_year: z.string().min(4).max(20),
});
