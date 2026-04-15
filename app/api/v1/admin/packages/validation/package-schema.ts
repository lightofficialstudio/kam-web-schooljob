import { z } from "zod";

// ✨ แผน Package ที่รองรับ (legacy — ใช้เพื่อ type-safety ของ plan key ดั้งเดิม)
export const PLAN_LIST = ["basic", "premium", "enterprise"] as const;
export type PlanType = string; // ✨ เปิดกว้าง — admin สร้าง plan key เองได้

// ✨ PACKAGE_DEFINITIONS ยังเก็บไว้เพื่อ seed ค่าเริ่มต้น และ fallback UI
// ⚠️ Source of truth ที่แท้จริงอยู่ใน DB (PackagePlan table) ไม่ใช่ที่นี่
export const PACKAGE_DEFINITIONS: Record<
  string,
  {
    label: string;
    color: string;
    jobQuota: number;
    price: number;
    features: string[];
    quotaWarningThreshold: number;
    upgradeTarget: string | null;
    badgeIcon: "default" | "crown" | "thunder";
    sortOrder: number;
    isActive: boolean;
  }
> = {
  basic: {
    label: "Basic",
    color: "#8c8c8c",
    jobQuota: 3,
    price: 0,
    features: ["ประกาศงาน 3 ตำแหน่ง", "จัดการสมาชิก 1 คน", "โปรไฟล์โรงเรียน"],
    quotaWarningThreshold: 67,
    upgradeTarget: "premium",
    badgeIcon: "default",
    sortOrder: 0,
    isActive: true,
  },
  premium: {
    label: "Premium",
    color: "#11b6f5",
    jobQuota: 20,
    price: 1990,
    features: [
      "ประกาศงาน 20 ตำแหน่ง",
      "จัดการสมาชิกไม่จำกัด",
      "โปรไฟล์พรีเมียม",
      "สถิติเชิงลึก",
      "Priority support",
    ],
    quotaWarningThreshold: 80,
    upgradeTarget: "enterprise",
    badgeIcon: "thunder",
    sortOrder: 1,
    isActive: true,
  },
  enterprise: {
    label: "Enterprise",
    color: "#722ed1",
    jobQuota: 999,
    price: 4990,
    features: [
      "ประกาศงานไม่จำกัด",
      "จัดการสมาชิกไม่จำกัด",
      "API Access",
      "Custom branding",
      "Dedicated support",
    ],
    quotaWarningThreshold: 95,
    upgradeTarget: null,
    badgeIcon: "crown",
    sortOrder: 2,
    isActive: true,
  },
};

// ✨ Schema สำหรับ query รายการโรงเรียนตาม plan
export const listSchoolsByPlanSchema = z.object({
  plan: z.string().default("all"),
  keyword: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  page_size: z.coerce.number().min(1).max(100).default(20),
});

// ✨ Schema สำหรับอัปเดต plan ของโรงเรียน (Admin กด manual หรือ Payment webhook)
export const updateSchoolPlanSchema = z.object({
  school_profile_id: z.string().min(1),
  plan: z.string().min(1),
  job_quota_max: z.coerce.number().min(0).optional(),
});

// ✨ Schema สำหรับสร้าง/แก้ไข Package Plan (Admin CRUD)
export const upsertPlanSchema = z.object({
  plan: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9_]+$/, "plan key ต้องเป็น lowercase, ตัวเลข หรือ _ เท่านั้น"),
  label: z.string().min(1).max(100),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{3,8}$/, "ต้องเป็น Hex color เช่น #11b6f5"),
  price: z.number().int().min(0),
  job_quota: z.number().int().min(0).max(99999),
  features: z.array(z.string().min(1)).min(1, "ต้องมีอย่างน้อย 1 feature"),
  quota_warning_threshold: z.number().int().min(0).max(100).default(80),
  badge_icon: z.enum(["default", "crown", "thunder"]).default("default"),
  upgrade_target: z.string().nullable().optional(),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

// ✨ Schema สำหรับแก้ไขบางส่วน (PATCH)
export const patchPlanSchema = upsertPlanSchema
  .partial()
  .omit({ plan: true })
  .extend({
    price: z.number().int().min(0).optional(),
  });

export type ListSchoolsByPlanInput = z.infer<typeof listSchoolsByPlanSchema>;
export type UpdateSchoolPlanInput = z.infer<typeof updateSchoolPlanSchema>;
export type UpsertPlanInput = z.infer<typeof upsertPlanSchema>;
export type PatchPlanInput = z.infer<typeof patchPlanSchema>;
