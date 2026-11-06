import { z } from "zod";

export const createAdminSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z.string().max(50).optional().or(z.literal("")),
});
