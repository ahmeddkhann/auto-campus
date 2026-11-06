import { z } from "zod";

export const sectionSchema = z.object({
  class_id: z.string().uuid(),
  name: z.string().min(1).max(20),
});

export const sectionUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(20),
});
