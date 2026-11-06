import { z } from "zod";

export const feeStructureSchema = z.object({
  class_id: z.string().uuid(),
  fee_type: z.enum(["tuition", "transport"]),
  amount: z.coerce.number().min(0),
  academic_year: z.string().min(4).max(20),
});

export const feeStructureUpdateSchema = feeStructureSchema.extend({
  id: z.string().uuid(),
});

export const generateFeesSchema = z.object({
  academic_year: z.string().min(4).max(20),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
  due_date: z.string().min(1),
});

export const feePaymentSchema = z.object({
  student_fee_id: z.string().uuid(),
  amount_paid: z.coerce.number().gt(0),
  payment_date: z.string().min(1),
  remarks: z.string().max(500).optional().or(z.literal("")),
});
