import { z } from "zod";

// 📝 Schema สำหรับ Query params ของ GET
export const getEmployerProfileQuerySchema = z.object({
  user_id: z.string().min(1, "กรุณาระบุ user_id"),
});

// 📝 Schema สำหรับ Update Employer Profile
export const updateEmployerProfileSchema = z.object({
  school_name: z.string().min(1, "กรุณาระบุชื่อโรงเรียน"),
  school_type: z.string().optional().nullable(),
  province: z.string().min(1, "กรุณาระบุจังหวัด"),
  address: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  vision: z.string().optional().nullable(),
  founded_year: z.number().int().positive().optional().nullable(),
  teacher_count: z.number().int().nonnegative().optional().nullable(),
  student_count: z.number().int().nonnegative().optional().nullable(),
  affiliation: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  curriculum: z.string().optional().nullable(),
  levels: z.array(z.string()).optional(),
  // สวัสดิการ — ส่งมาเป็น array of string แล้ว service จะ upsert
  benefits: z.array(z.string()).optional(),
  // รูปภาพโลโก้และปก
  logo_url: z.string().optional().nullable(),
  cover_image_url: z.string().optional().nullable(),
  // ฟิลด์ email — มาจาก Profile ไม่ใช่ SchoolProfile (read-only ใน UI)
  email: z.string().email().optional().nullable(),
  // ฟิลด์ UI ที่ยังไม่มีใน DB (client-side เท่านั้น)
  gallery: z.array(z.string()).optional(),
});

export type UpdateEmployerProfileInput = z.infer<
  typeof updateEmployerProfileSchema
>;
