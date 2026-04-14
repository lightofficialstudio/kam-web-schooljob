import { z } from "zod";

// ✨ แผน Package ที่รองรับ
export const PLAN_LIST = ["basic", "premium", "enterprise"] as const;
export type PlanType = (typeof PLAN_LIST)[number];

// ✨ นิยาม Package พร้อม quota, ราคา, และ config ที่ Admin ปรับได้
// ⚠️  แก้ที่นี่ที่เดียว → กระทบ frontend employer + admin dashboard ทุกที่
export const PACKAGE_DEFINITIONS: Record<
  PlanType,
  {
    label: string;
    color: string;
    jobQuota: number;
    price: number;
    features: string[];
    quotaWarningThreshold: number; // % ที่จะแสดง warning (เช่น 80 = เมื่อใช้ quota ไป 80%)
    upgradeTarget: PlanType | null;  // plan ที่แนะนำให้ upgrade ไป (null = สูงสุดแล้ว)
    badgeIcon: "default" | "crown" | "thunder"; // icon badge บน UI
  }
> = {
  basic: {
    label: "Basic",
    color: "#8c8c8c",
    jobQuota: 3,
    price: 0,
    features: ["ประกาศงาน 3 ตำแหน่ง", "จัดการสมาชิก 1 คน", "โปรไฟล์โรงเรียน"],
    quotaWarningThreshold: 67, // เตือนเมื่อใช้ 2/3 (ตำแหน่งที่ 3 เหลืออีก 1)
    upgradeTarget: "premium",
    badgeIcon: "default",
  },
  premium: {
    label: "Premium",
    color: "#11b6f5",
    jobQuota: 20,
    price: 1990,
    features: ["ประกาศงาน 20 ตำแหน่ง", "จัดการสมาชิกไม่จำกัด", "โปรไฟล์พรีเมียม", "สถิติเชิงลึก", "Priority support"],
    quotaWarningThreshold: 80,
    upgradeTarget: "enterprise",
    badgeIcon: "thunder",
  },
  enterprise: {
    label: "Enterprise",
    color: "#722ed1",
    jobQuota: 999,
    price: 4990,
    features: ["ประกาศงานไม่จำกัด", "จัดการสมาชิกไม่จำกัด", "API Access", "Custom branding", "Dedicated support"],
    quotaWarningThreshold: 95,
    upgradeTarget: null,
    badgeIcon: "crown",
  },
};

// ✨ Schema สำหรับ query รายการโรงเรียนตาม plan
export const listSchoolsByPlanSchema = z.object({
  plan: z.enum(["basic", "premium", "enterprise", "all"]).default("all"),
  keyword: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  page_size: z.coerce.number().min(1).max(100).default(20),
});

// ✨ Schema สำหรับอัปเดต plan ของโรงเรียน (Admin กด manual)
export const updateSchoolPlanSchema = z.object({
  school_profile_id: z.string().min(1),
  plan: z.enum(["basic", "premium", "enterprise"]),
  job_quota_max: z.coerce.number().min(0).optional(), // override quota ถ้าต้องการ
});

export type ListSchoolsByPlanInput = z.infer<typeof listSchoolsByPlanSchema>;
export type UpdateSchoolPlanInput = z.infer<typeof updateSchoolPlanSchema>;
