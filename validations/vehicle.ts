import { z } from "zod";

export const vehicleSchema = z.object({
  name: z.string().min(1).max(100),
  registration_number: z.string().max(50).optional().or(z.literal("")),
  capacity: z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? undefined : value),
    z.coerce.number().int().positive().optional()
  ),
  monthly_fee: z.coerce.number().min(0),
  is_active: z.boolean().default(true),
});

export const vehicleUpdateSchema = vehicleSchema.extend({
  id: z.string().uuid(),
});
