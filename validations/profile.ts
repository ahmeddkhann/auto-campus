import { z } from "zod";

export const profileUpdateSchema = z.object({
  full_name: z.string().min(2).max(100),
  phone: z.string().max(50).optional().or(z.literal("")),
  avatar_url: z.string().url().optional().or(z.literal("")),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100)
    .optional()
    .or(z.literal("")),
});
