import { prisma } from "@/lib/prisma";
import {
  ListSchoolsByPlanInput,
  PACKAGE_DEFINITIONS,
  PatchPlanInput,
  UpdateSchoolPlanInput,
  UpsertPlanInput,
} from "../validation/package-schema";

export class AdminPackageService {
  // ✨ ดึง config ของ plan จาก DB — fallback หา PACKAGE_DEFINITIONS ถ้ายังไม่มีใน DB
  async getPlanConfig(planKey: string) {
    const dbPlan = await prisma.packagePlan.findUnique({ where: { plan: planKey } });
    if (dbPlan) {
      return {
        jobQuota: dbPlan.jobQuota,
        label: dbPlan.label,
        color: dbPlan.color,
        price: dbPlan.price,
      };
    }
    // ✨ fallback ไป PACKAGE_DEFINITIONS ถ้ายังไม่ได้ seed DB
    const def = PACKAGE_DEFINITIONS[planKey];
    return def
      ? { jobQuota: def.jobQuota, label: def.label, color: def.color, price: def.price }
      : { jobQuota: 3, label: planKey, color: "#8c8c8c", price: 0 };
  }

  // ✨ ดึง PackagePlan ทั้งหมดจาก DB (active เท่านั้น เรียงตาม sortOrder)
  async listPlans(includeInactive = false) {
    return prisma.packagePlan.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { plan: "asc" }],
    });
  }

  // ✨ สร้าง PackagePlan ใหม่ (Admin)
  async createPlan(input: UpsertPlanInput) {
    return prisma.packagePlan.create({
      data: {
        plan: input.plan,
        label: input.label,
        color: input.color,
        price: input.price,
        jobQuota: input.job_quota,
        features: JSON.stringify(input.features),
        quotaWarningThreshold: input.quota_warning_threshold ?? 80,
        badgeIcon: input.badge_icon ?? "default",
        upgradeTarget: input.upgrade_target ?? null,
        sortOrder: input.sort_order ?? 0,
        isActive: input.is_active ?? true,
      },
    });
  }

  // ✨ แก้ไข PackagePlan (PATCH — เฉพาะ field ที่ส่งมา)
  async patchPlan(planKey: string, input: PatchPlanInput) {
    const data: Record<string, unknown> = {};
    if (input.label !== undefined) data.label = input.label;
    if (input.color !== undefined) data.color = input.color;
    if (input.price !== undefined) data.price = input.price;
    if (input.job_quota !== undefined) data.jobQuota = input.job_quota;
    if (input.features !== undefined) data.features = JSON.stringify(input.features);
    if (input.quota_warning_threshold !== undefined) data.quotaWarningThreshold = input.quota_warning_threshold;
    if (input.badge_icon !== undefined) data.badgeIcon = input.badge_icon;
    if (input.upgrade_target !== undefined) data.upgradeTarget = input.upgrade_target;
    if (input.sort_order !== undefined) data.sortOrder = input.sort_order;
    if (input.is_active !== undefined) data.isActive = input.is_active;

    return prisma.packagePlan.update({ where: { plan: planKey }, data });
  }

  // ✨ ลบ PackagePlan (ตรวจว่ายังมีโรงเรียนใช้อยู่ไหม)
  async deletePlan(planKey: string) {
    const schoolCount = await prisma.schoolProfile.count({
      where: { accountPlan: planKey },
    });
    if (schoolCount > 0) {
      throw new Error(`PLAN_IN_USE:${schoolCount}`);
    }
    return prisma.packagePlan.delete({ where: { plan: planKey } });
  }

  // ✨ Seed plan เริ่มต้นจาก PACKAGE_DEFINITIONS ถ้า DB ว่าง
  async seedDefaultPlans() {
    const existing = await prisma.packagePlan.count();
    if (existing > 0) return { seeded: 0, message: "มี plan อยู่แล้ว" };

    const entries = Object.entries(PACKAGE_DEFINITIONS);
    await prisma.packagePlan.createMany({
      data: entries.map(([key, def]) => ({
        plan: key,
        label: def.label,
        color: def.color,
        price: def.price,
        jobQuota: def.jobQuota,
        features: JSON.stringify(def.features),
        quotaWarningThreshold: def.quotaWarningThreshold,
        badgeIcon: def.badgeIcon,
        upgradeTarget: def.upgradeTarget ?? null,
        sortOrder: def.sortOrder,
        isActive: def.isActive,
      })),
      skipDuplicates: true,
    });

    return { seeded: entries.length, message: `Seeded ${entries.length} plans` };
  }

  // ✨ ดึงสถิติ Package ภาพรวมทุก plan
  async getSummary() {
    const rows = await prisma.schoolProfile.groupBy({
      by: ["accountPlan"],
      _count: { id: true },
    });

    const summary: Record<string, number> & { total: number } = { total: 0 };
    for (const r of rows) {
      summary[r.accountPlan] = r._count.id;
      summary.total += r._count.id;
    }

    return summary;
  }

  // ✨ ดึงรายการโรงเรียนพร้อม plan — filter ได้ตาม plan และ keyword
  async listSchools(input: ListSchoolsByPlanInput) {
    const { plan, keyword, page, page_size } = input;
    const skip = (page - 1) * page_size;

    const where = {
      ...(plan !== "all" && { accountPlan: plan }),
      ...(keyword && {
        OR: [
          { schoolName: { contains: keyword, mode: "insensitive" as const } },
          { province: { contains: keyword, mode: "insensitive" as const } },
          {
            profile: {
              email: { contains: keyword, mode: "insensitive" as const },
            },
          },
        ],
      }),
    };

    const [total, schools] = await Promise.all([
      prisma.schoolProfile.count({ where }),
      prisma.schoolProfile.findMany({
        where,
        select: {
          id: true,
          schoolName: true,
          schoolType: true,
          province: true,
          logoUrl: true,
          accountPlan: true,
          jobQuotaMax: true,
          createdAt: true,
          updatedAt: true,
          profile: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
            },
          },
          jobs: {
            where: { status: "OPEN" },
            select: { id: true },
          },
        },
        orderBy: [{ accountPlan: "asc" }, { updatedAt: "desc" }],
        skip,
        take: page_size,
      }),
    ]);

    const formatted = schools.map((s) => ({
      id: s.id,
      schoolName: s.schoolName,
      schoolType: s.schoolType ?? null,
      province: s.province,
      logoUrl: s.logoUrl ?? null,
      accountPlan: s.accountPlan,
      jobQuotaMax: s.jobQuotaMax,
      activeJobCount: s.jobs.length,
      quotaUsagePercent:
        s.jobQuotaMax > 0
          ? Math.min(100, Math.round((s.jobs.length / s.jobQuotaMax) * 100))
          : 0,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      owner: {
        profileId: s.profile.id,
        email: s.profile.email,
        name:
          [s.profile.firstName, s.profile.lastName].filter(Boolean).join(" ") ||
          "—",
        phoneNumber: s.profile.phoneNumber ?? null,
      },
    }));

    return {
      schools: formatted,
      total,
      page,
      page_size,
      total_pages: Math.ceil(total / page_size),
    };
  }

  // ✨ อัปเดต Plan ของโรงเรียน (Admin กด manual หรือ Payment webhook เรียก)
  async updateSchoolPlan(input: UpdateSchoolPlanInput) {
    const { school_profile_id, plan, job_quota_max } = input;

    // ✨ ดึง quota จาก DB — fallback ไป PACKAGE_DEFINITIONS
    const planConfig = await this.getPlanConfig(plan);
    const finalQuota =
      job_quota_max !== undefined ? job_quota_max : planConfig.jobQuota;

    const updated = await prisma.schoolProfile.update({
      where: { id: school_profile_id },
      data: {
        accountPlan: plan,
        jobQuotaMax: finalQuota,
      },
      select: {
        id: true,
        schoolName: true,
        accountPlan: true,
        jobQuotaMax: true,
        updatedAt: true,
      },
    });

    return updated;
  }
}

export const adminPackageService = new AdminPackageService();
