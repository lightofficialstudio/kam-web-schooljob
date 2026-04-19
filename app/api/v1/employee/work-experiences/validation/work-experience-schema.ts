import { z } from "zod";

// ✨ Schema สำหรับสร้างประวัติการทำงานใหม่
export const createWorkExperienceSchema = z.object({
  job_title: z.string().min(1, "กรุณาระบุตำแหน่งงาน"),
  company_name: z.string().min(1, "กรุณาระบุชื่อสถานที่ทำงาน"),
  start_date: z.string().min(1, "กรุณาระบุวันที่เริ่มงาน"),
  end_date: z.string().optional().nullable(),
  in_present: z.boolean().default(false),
  description: z.string().optional().nullable(),
  work_year: z.number().int().nonnegative().optional().nullable(),
});

// ✨ Schema สำหรับอัปเดตประวัติการทำงาน — ทุก field เป็น optional
export const updateWorkExperienceSchema = z.object({
  job_title: z.string().min(1).optional(),
  company_name: z.string().min(1).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional().nullable(),
  in_present: z.boolean().optional(),
  description: z.string().optional().nullable(),
  work_year: z.number().int().nonnegative().optional().nullable(),
});

export type CreateWorkExperienceInput = z.infer<typeof createWorkExperienceSchema>;
export type UpdateWorkExperienceInput = z.infer<typeof updateWorkExperienceSchema>;
