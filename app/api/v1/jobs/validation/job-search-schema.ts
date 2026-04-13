import { z } from "zod";

// ✨ Schema สำหรับ query params การค้นหางาน (Public) — Cursor-based Lazy Loading
export const jobSearchQuerySchema = z.object({
  keyword: z.string().optional(),
  province: z.string().optional(),
  school_type: z.string().optional(),
  license: z.enum(["required", "not_required", "pending_ok"]).optional(),
  salary_min: z.coerce.number().optional(),
  salary_max: z.coerce.number().optional(),
  grade_level: z.string().optional(),
  cursor: z.string().optional(), // ✨ cursor = id ของ job สุดท้าย
  page_size: z.coerce.number().min(1).max(50).default(10),
});

export type JobSearchQuery = z.infer<typeof jobSearchQuerySchema>;
