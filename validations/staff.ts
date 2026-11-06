import { z } from "zod";

export const supportStaffSchema = z.object({
  full_name: z.string().min(2).max(100),
  phone: z.string().max(50).optional().or(z.literal("")),
  designation: z.string().max(100).optional().or(z.literal("")),
  salary: z.coerce.number().min(0).default(0),
});

export const supportStaffUpdateSchema = supportStaffSchema.extend({
  id: z.string().uuid(),
});

export const principalSchema = z.object({
  full_name: z.string().min(2).max(100),
  phone: z.string().max(50).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  qualification: z.string().max(200).optional().or(z.literal("")),
  salary: z.coerce.number().min(0).default(0),
  avatar_url: z.string().url().optional().or(z.literal("")),
});
