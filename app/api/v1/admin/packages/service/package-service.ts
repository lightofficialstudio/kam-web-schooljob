import { prisma } from "@/lib/prisma";
import {
  ListSchoolsByPlanInput,
  PACKAGE_DEFINITIONS,
  UpdateSchoolPlanInput,
} from "../validation/package-schema";

export class AdminPackageService {
  // ✨ ดึงสถิติ Package ภาพรวมทุก plan
  async getSummary() {
    const rows = await prisma.schoolProfile.groupBy({
      by: ["accountPlan"],
      _count: { id: true },
    });

    const summary = {
      basic: 0,
      premium: 0,
      enterprise: 0,
      total: 0,
    };

    for (const r of rows) {
      const plan = r.accountPlan as keyof typeof summary;
      if (plan in summary) summary[plan] = r._count.id;
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
          { profile: { email: { contains: keyword, mode: "insensitive" as const } } },
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
          // ✨ นับจำนวน active jobs เพื่อแสดง quota usage
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
        name: [s.profile.firstName, s.profile.lastName].filter(Boolean).join(" ") || "—",
        phoneNumber: s.profile.phoneNumber ?? null,
      },
    }));

    return { schools: formatted, total, page, page_size, total_pages: Math.ceil(total / page_size) };
  }

  // ✨ อัปเดต Plan ของโรงเรียน (Admin กด manual หรือ Payment webhook เรียก)
  async updateSchoolPlan(input: UpdateSchoolPlanInput) {
    const { school_profile_id, plan, job_quota_max } = input;

    // ✨ ถ้าไม่ได้ override quota → ใช้ค่าจาก PACKAGE_DEFINITIONS
    const defaultQuota = PACKAGE_DEFINITIONS[plan].jobQuota;
    const finalQuota = job_quota_max !== undefined ? job_quota_max : defaultQuota;

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
