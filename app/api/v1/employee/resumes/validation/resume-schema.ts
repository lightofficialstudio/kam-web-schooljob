import { z } from "zod";

// ✨ Schema สำหรับสร้าง Resume ใหม่
export const createResumeSchema = z.object({
  file_name: z.string().min(1),
  file_url: z.string().url(),
  file_size: z.number().optional(),
});

// ✨ Schema สำหรับอัปเดต Resume (set active หรือเปลี่ยนชื่อ)
export const updateResumeSchema = z.object({
  is_active: z.boolean().optional(),
  file_name: z.string().min(1).optional(),
});

export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
