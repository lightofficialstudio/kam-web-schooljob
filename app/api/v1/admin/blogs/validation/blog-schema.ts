import { z } from "zod";

// ✨ Schema สำหรับสร้างบทความใหม่
export const createBlogSchema = z.object({
  title: z.string().min(1, "กรุณาระบุชื่อบทความ").max(200),
  slug: z.string().min(1, "กรุณาระบุ slug").max(200).regex(/^[a-z0-9-]+$/, "slug ต้องเป็น lowercase a-z, 0-9, และ - เท่านั้น"),
  content: z.string().min(1, "กรุณาใส่เนื้อหาบทความ"),
  excerpt: z.string().max(500).optional(),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  author_id: z.string().optional(), // ✨ profile.id ของ admin ที่สร้าง
});

// ✨ Schema สำหรับแก้ไขบทความ (ทุก field optional)
export const updateBlogSchema = createBlogSchema.partial().extend({
  id: z.string().min(1, "กรุณาระบุ id บทความ"),
});

// ✨ Schema query สำหรับ admin list (รวม DRAFT ด้วย)
export const listBlogQuerySchema = z.object({
  keyword: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "all"]).default("all"),
  page: z.coerce.number().min(1).default(1),
  page_size: z.coerce.number().min(1).max(50).default(20),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type ListBlogQueryInput = z.infer<typeof listBlogQuerySchema>;
