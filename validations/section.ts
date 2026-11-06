import { z } from "zod";

export const sectionSubjectsSchema = z.object({
  section_id: z.string().uuid(),
  subject_ids: z.array(z.string().uuid()).default([]),
});

export const assignTeacherToSectionSchema = z.object({
  section_id: z.string().uuid(),
  teacher_id: z.string().uuid(),
  subject_ids: z.array(z.string().uuid()).default([]),
});

export const removeTeacherFromSectionSchema = z.object({
  section_id: z.string().uuid(),
  teacher_id: z.string().uuid(),
});

export const appointPermanentHeadSchema = z.object({
  section_id: z.string().uuid(),
  teacher_id: z.string().uuid(),
});

export const appointTemporaryHeadSchema = z.object({
  section_id: z.string().uuid(),
  teacher_id: z.string().uuid(),
  duration: z.enum(["1d", "3d", "7d", "15d", "30d"]),
});

export const removeHeadSchema = z.object({
  id: z.string().uuid(),
});
