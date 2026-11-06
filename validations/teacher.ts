import { z } from "zod";

export const createTeacherSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z.string().max(50).optional().or(z.literal("")),
  employee_id: z.string().min(1).max(50),
  qualification: z.string().max(200).optional().or(z.literal("")),
  salary: z.coerce.number().min(0).default(0),
});

export const updateTeacherSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(2).max(100),
  phone: z.string().max(50).optional().or(z.literal("")),
  employee_id: z.string().min(1).max(50),
  qualification: z.string().max(200).optional().or(z.literal("")),
  salary: z.coerce.number().min(0).default(0),
  password: z.string().min(6).max(100).optional().or(z.literal("")),
});
