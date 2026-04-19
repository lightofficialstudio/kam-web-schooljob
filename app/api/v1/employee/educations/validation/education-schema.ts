import { z } from "zod";

// ✨ Schema สำหรับสร้างประวัติการศึกษาใหม่
export const createEducationSchema = z.object({
  level: z.string().min(1, "กรุณาระบุระดับการศึกษา"),
  institution: z.string().min(1, "กรุณาระบุชื่อสถาบัน"),
  major: z.string().min(1, "กรุณาระบุสาขาวิชา"),
  graduation_year: z.number().int().positive().optional().nullable(),
  gpa: z.number().min(0).max(4).optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
});

// ✨ Schema สำหรับอัปเดตประวัติการศึกษา — ทุก field เป็น optional
export const updateEducationSchema = z.object({
  level: z.string().min(1).optional(),
  institution: z.string().min(1).optional(),
  major: z.string().min(1).optional(),
  graduation_year: z.number().int().positive().optional().nullable(),
  gpa: z.number().min(0).max(4).optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
});

export type CreateEducationInput = z.infer<typeof createEducationSchema>;
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>;
