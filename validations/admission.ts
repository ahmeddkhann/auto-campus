import { z } from "zod";

export const submitAdmissionSchema = z.object({
  student_name: z.string().trim().min(1, "Student name is required"),
  father_name: z.string().trim().optional(),
  mother_name: z.string().trim().optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().email("Valid email is required"),
  address: z.string().trim().optional(),
  class_id: z.string().uuid("Select a class"),
  previous_school: z.string().trim().optional(),
});

export const approveAdmissionSchema = z.object({
  id: z.string().uuid(),
  section_id: z.string().uuid("Select a section"),
  roll_number: z.string().trim().min(1, "Roll number is required"),
});

export const rejectAdmissionSchema = z.object({
  id: z.string().uuid(),
  rejection_reason: z.string().trim().min(1, "Rejection reason is required"),
});
