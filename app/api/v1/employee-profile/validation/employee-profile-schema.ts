import { z } from "zod";

// 📝 Schema สำหรับ Work Experience แต่ละรายการ
const workExperienceSchema = z.object({
  id: z.string().uuid().optional(),
  job_title: z.string().min(1, "กรุณาระบุตำแหน่งงาน"),
  company_name: z.string().min(1, "กรุณาระบุชื่อสถานที่ทำงาน"),
  start_date: z.string().min(1, "กรุณาระบุวันที่เริ่มงาน"),
  end_date: z.string().optional().nullable(),
  in_present: z.boolean().default(false),
  description: z.string().optional().nullable(),
  work_year: z.number().int().nonnegative().optional().nullable(),
  is_deleted: z.boolean().default(false),
});

// 📝 Schema สำหรับ Education แต่ละรายการ
const educationSchema = z.object({
  id: z.string().uuid().optional(),
  level: z.string().min(1, "กรุณาระบุระดับการศึกษา"),
  institution: z.string().min(1, "กรุณาระบุชื่อสถาบัน"),
  major: z.string().min(1, "กรุณาระบุสาขาวิชา"),
  graduation_year: z.number().int().positive().optional().nullable(),
  gpa: z.number().min(0).max(4).optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  is_deleted: z.boolean().default(false),
});

// 📝 Schema สำหรับ License แต่ละรายการ
const licenseSchema = z.object({
  id: z.string().uuid().optional(),
  license_name: z.string().min(1, "กรุณาระบุชื่อใบประกอบ"),
  issuer: z.string().optional().nullable(),
  license_number: z.string().optional().nullable(),
  issue_date: z.string().optional().nullable(),
  expiry_date: z.string().optional().nullable(),
  file_url: z.string().url().optional().nullable(),
  credential_url: z.string().url().optional().nullable(),
  is_deleted: z.boolean().default(false),
});

// 📝 Schema สำหรับ Language แต่ละรายการ
const languageSchema = z.object({
  id: z.string().uuid().optional(),
  language_name: z.string().min(1, "กรุณาระบุชื่อภาษา"),
  proficiency: z.enum(["native", "fluent", "intermediate", "basic"]).optional().nullable(),
  is_deleted: z.boolean().default(false),
});

// 📝 Schema สำหรับ Skill แต่ละรายการ
const skillSchema = z.object({
  id: z.string().uuid().optional(),
  skill_name: z.string().min(1, "กรุณาระบุชื่อทักษะ"),
  is_deleted: z.boolean().default(false),
});

// 📝 Schema หลักสำหรับ Update Employee Profile (ทุก field เป็น optional — partial update)
export const updateEmployeeProfileSchema = z.object({
  // Basic Info
  first_name: z.string().min(1, "กรุณาระบุชื่อ").optional(),
  last_name: z.string().min(1, "กรุณาระบุนามสกุล").optional(),
  phone_number: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  profile_image_url: z.string().url().optional().nullable(),
  profile_visibility: z.enum(["public", "apply_only"]).optional(),

  // Teaching Info
  teaching_experience: z.string().optional().nullable(),
  recent_school: z.string().optional().nullable(),
  special_activities: z.string().optional().nullable(),
  can_relocate: z.boolean().optional(),
  license_status: z
    .enum(["has_license", "pending", "no_license", "not_required"])
    .optional()
    .nullable(),

  // Resume
  active_resume_id: z.string().uuid().optional().nullable(),

  // Array relations — ส่งมาเป็น array ทั้งก้อน (upsert by id)
  specializations: z.array(z.string()).optional(),         // array of subject strings
  grade_can_teaches: z.array(z.string()).optional(),       // array of grade strings
  preferred_provinces: z.array(z.string()).optional(),     // array of province strings
  work_experiences: z.array(workExperienceSchema).optional(),
  educations: z.array(educationSchema).optional(),
  licenses: z.array(licenseSchema).optional(),
  languages: z.array(languageSchema).optional(),
  skills: z.array(skillSchema).optional(),
});

export type UpdateEmployeeProfileInput = z.infer<typeof updateEmployeeProfileSchema>;

// 📝 Schema สำหรับ query param GET (ต้องการ user_id, email optional สำหรับ auto-create)
export const getProfileQuerySchema = z.object({
  user_id: z.string().min(1, "กรุณาระบุ user_id"),
});

export type GetProfileQueryInput = z.infer<typeof getProfileQuerySchema>;
