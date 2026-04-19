import { z } from "zod";

// ✨ Schema สำหรับ query params ค้นหาโรงเรียน
export const schoolSearchQuerySchema = z.object({
  keyword: z.string().optional(),
  province: z.string().optional(),
  school_type: z.string().optional(),
  // ✨ sort_by — latest = เรียงตาม createdAt desc, most_jobs = เรียงตามจำนวนงาน desc
  sort_by: z.enum(["latest", "most_jobs"]).optional().default("latest"),
});

export type SchoolSearchQuery = z.infer<typeof schoolSearchQuerySchema>;
