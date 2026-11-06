import { z } from "zod";

export const subjectSchema = z.object({
  name: z.string().min(1).max(100),
  code: z.string().min(1).max(20),
});

export const subjectUpdateSchema = subjectSchema.extend({
  id: z.string().uuid(),
});
