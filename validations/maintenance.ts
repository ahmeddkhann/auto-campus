import { z } from "zod";

export const createMaintenanceSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
  category: z.string().trim().optional(),
});

export const updateMaintenanceSchema = createMaintenanceSchema.extend({
  id: z.string().uuid(),
});
