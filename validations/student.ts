import { z } from "zod";

export const studentStatusSchema = z.enum(["active", "inactive", "graduated"]);

export const createStudentSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  roll_number: z.string().min(1).max(50),
  father_name: z.string().max(100).optional().or(z.literal("")),
  mother_name: z.string().max(100).optional().or(z.literal("")),
  date_of_birth: z.string().optional().or(z.literal("")),
  gender: z.string().max(30).optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  section_id: z.string().uuid(),
  status: studentStatusSchema.default("active"),
  uses_transport: z.coerce.boolean().default(false),
});

export const updateStudentSchema = createStudentSchema.extend({
  id: z.string().uuid(),
});
