import { z } from "zod";

export const attendanceStatusSchema = z.enum(["present", "absent", "leave"]);

export const bulkTeacherAttendanceSchema = z.object({
  date: z.string().min(1),
  entries: z.array(
    z.object({
      teacher_id: z.string().uuid(),
      status: attendanceStatusSchema,
      remarks: z.string().max(500).optional().or(z.literal("")),
    })
  ),
});

export const bulkStudentAttendanceSchema = z.object({
  date: z.string().min(1),
  section_id: z.string().uuid(),
  entries: z.array(
    z.object({
      student_id: z.string().uuid(),
      status: attendanceStatusSchema,
      remarks: z.string().max(500).optional().or(z.literal("")),
    })
  ),
});
