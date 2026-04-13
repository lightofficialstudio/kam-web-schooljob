import { z } from "zod";

// ✨ Schema สำหรับ query params ค้นหาโรงเรียน
export const schoolSearchQuerySchema = z.object({
  keyword: z.string().optional(),
  province: z.string().optional(),
  school_type: z.string().optional(),
});

export type SchoolSearchQuery = z.infer<typeof schoolSearchQuerySchema>;
