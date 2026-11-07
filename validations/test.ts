import { z } from "zod";

export const createTestSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  section_id: z.string().uuid("Select a section"),
  subject_id: z.string().uuid("Select a subject"),
  total_marks: z.coerce.number().positive("Total marks must be greater than 0"),
  test_date: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
});

export const updateTestSchema = createTestSchema.omit({
  section_id: true,
  subject_id: true,
});

export const bulkTestMarksSchema = z.object({
  test_id: z.string().uuid(),
  entries: z.array(
    z.object({
      student_id: z.string().uuid(),
      obtained_marks: z.coerce.number().min(0, "Marks cannot be negative"),
      remarks: z.string().max(500).optional().or(z.literal("")),
    })
  ),
});
