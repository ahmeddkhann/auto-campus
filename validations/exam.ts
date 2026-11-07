import { z } from "zod";

export const createExamSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  section_id: z.string().uuid("Select a section"),
  academic_year: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
});

export const bulkExamMarksSchema = z.object({
  exam_id: z.string().uuid(),
  entries: z.array(
    z.object({
      student_id: z.string().uuid(),
      subject_id: z.string().uuid(),
      total_marks: z.coerce.number().positive("Total marks must be greater than 0"),
      obtained_marks: z.coerce.number().min(0, "Marks cannot be negative"),
    })
  ),
});
