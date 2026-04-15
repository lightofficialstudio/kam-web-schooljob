import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// ✨ Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

// ✨ GET /api/v1/admin/dashboard — ดึงข้อมูล Dashboard ครบวงจร (1 call)
export async function GET() {
  try {
    const now = new Date();
    const startOf7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOf30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // ✨ ดึง Supabase users + Prisma stats พร้อมกัน
    const [supabaseResult, prismaStats] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      // ✨ Prisma: stats หลายอย่างพร้อมกัน
      Promise.all([
        // 0 — จำนวน Profile แต่ละ role
        prisma.profile.groupBy({ by: ["role"], _count: { id: true } }),
        // 1 — จำนวน Job แต่ละ status
        prisma.job.groupBy({ by: ["status"], _count: { id: true } }),
        // 2 — จำนวน Application แต่ละ status
        prisma.application.groupBy({ by: ["status"], _count: { id: true } }),
        // 3 — 5 Profile ล่าสุด (recent signups ที่มี Prisma profile)
        prisma.profile.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            userId: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            profileImageUrl: true,
            createdAt: true,
            schoolProfile: { select: { schoolName: true, accountPlan: true } },
          },
        }),
        // 4 — งานที่ deadline ใกล้ (< 7 วัน)
        prisma.job.findMany({
          where: {
            status: "OPEN",
            deadline: { gte: now, lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
          },
          orderBy: { deadline: "asc" },
          take: 5,
          select: {
            id: true,
            title: true,
            deadline: true,
            schoolProfile: { select: { schoolName: true } },
            _count: { select: { applications: true } },
          },
        }),
        // 5 — SchoolProfile ที่ไม่มีงาน OPEN เลย (Basic, ควรกระตุ้น)
        prisma.schoolProfile.findMany({
          where: {
            accountPlan: "basic",
            jobs: { none: { status: "OPEN" } },
          },
          take: 5,
          select: {
            id: true,
            schoolName: true,
            accountPlan: true,
            province: true,
            profile: { select: { email: true } },
          },
        }),
        // 6 — growth: สมัครใหม่ 6 เดือนย้อนหลัง (group by month)
        prisma.$queryRaw<{ month: string; role: string; count: bigint }[]>`
          SELECT
            TO_CHAR(created_at, 'YYYY-MM') AS month,
            role,
            COUNT(*) AS count
          FROM profiles
          WHERE created_at >= NOW() - INTERVAL '6 months'
          GROUP BY month, role
          ORDER BY month ASC
        `,
        // 7 — job growth: ประกาศงานรายเดือน
        prisma.$queryRaw<{ month: string; count: bigint }[]>`
          SELECT
            TO_CHAR(created_at, 'YYYY-MM') AS month,
            COUNT(*) AS count
          FROM jobs
          WHERE created_at >= NOW() - INTERVAL '6 months'
          GROUP BY month
          ORDER BY month ASC
        `,
        // 8 — Application ที่ PENDING นานเกิน 14 วัน
        prisma.application.count({
          where: {
            status: "PENDING",
            appliedAt: { lte: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) },
          },
        }),
        // 9 — Blog DRAFT ที่ยังไม่ publish
        prisma.blog.count({ where: { status: "DRAFT" } }),
      ]),
    ]);

    const supabaseUsers = supabaseResult.data?.users ?? [];
    const [
      roleGroups,
      jobGroups,
      appGroups,
      recentProfiles,
      deadlineJobs,
      inactiveSchools,
      profileGrowthRaw,
      jobGrowthRaw,
      stalePendingCount,
      draftBlogCount,
    ] = prismaStats;

    // ─── Stats ───
    const roleMap = Object.fromEntries(roleGroups.map((r) => [r.role, r._count.id]));
    const jobMap = Object.fromEntries(jobGroups.map((j) => [j.status, j._count.id]));
    const appMap = Object.fromEntries(appGroups.map((a) => [a.status, a._count.id]));

    const totalUsers = supabaseUsers.length;
    const verifiedUsers = supabaseUsers.filter((u) => !!u.email_confirmed_at).length;
    const unverifiedUsers = totalUsers - verifiedUsers;
    const newLast7Days = supabaseUsers.filter(
      (u) => new Date(u.created_at) >= startOf7Days,
    ).length;
    const newLast30Days = supabaseUsers.filter(
      (u) => new Date(u.created_at) >= startOf30Days,
    ).length;

    const stats = {
      users: {
        total: totalUsers,
        verified: verifiedUsers,
        unverified: unverifiedUsers,
        newLast7Days,
        newLast30Days,
        byRole: {
          EMPLOYEE: roleMap["EMPLOYEE"] ?? 0,
          EMPLOYER: roleMap["EMPLOYER"] ?? 0,
          ADMIN: roleMap["ADMIN"] ?? 0,
        },
      },
      jobs: {
        open: jobMap["OPEN"] ?? 0,
        closed: jobMap["CLOSED"] ?? 0,
        draft: jobMap["DRAFT"] ?? 0,
        total: (jobMap["OPEN"] ?? 0) + (jobMap["CLOSED"] ?? 0) + (jobMap["DRAFT"] ?? 0),
        deadlineSoon: deadlineJobs.length,
      },
      applications: {
        pending: appMap["PENDING"] ?? 0,
        interview: appMap["INTERVIEW"] ?? 0,
        accepted: appMap["ACCEPTED"] ?? 0,
        rejected: appMap["REJECTED"] ?? 0,
        total: Object.values(appMap).reduce((s, v) => s + v, 0),
        stalePending: stalePendingCount,
      },
      content: {
        draftBlogs: draftBlogCount,
      },
    };

    // ─── Pending Actions ─── สิ่งที่ Admin ควรทำ
    const pendingActions: { type: string; label: string; count: number; href: string; severity: "high" | "medium" | "low" }[] = [];

    if (unverifiedUsers > 0) {
      pendingActions.push({
        type: "unverified_users",
        label: `User ยังไม่ยืนยันอีเมล`,
        count: unverifiedUsers,
        href: "/pages/admin/user-management?status=unverified",
        severity: "medium",
      });
    }
    if (stalePendingCount > 0) {
      pendingActions.push({
        type: "stale_applications",
        label: "ใบสมัครค้างเกิน 14 วัน",
        count: stalePendingCount,
        href: "/pages/admin/user-management",
        severity: "high",
      });
    }
    if (deadlineJobs.length > 0) {
      pendingActions.push({
        type: "deadline_soon",
        label: "งานที่ Deadline ใกล้ (< 7 วัน)",
        count: deadlineJobs.length,
        href: "/pages/job",
        severity: "high",
      });
    }
    if (inactiveSchools.length > 0) {
      pendingActions.push({
        type: "inactive_schools",
        label: "โรงเรียน Basic ยังไม่มีงานเปิด",
        count: inactiveSchools.length,
        href: "/pages/admin/package-management",
        severity: "low",
      });
    }
    if (draftBlogCount > 0) {
      pendingActions.push({
        type: "draft_blogs",
        label: "บทความที่ยัง Draft",
        count: draftBlogCount,
        href: "/pages/admin/blog",
        severity: "low",
      });
    }

    // ─── Recent Signups (5 ล่าสุด — merge Supabase + Prisma) ───
    const profileUserIdSet = new Set(recentProfiles.map((p) => p.userId));
    const recentSupabase = supabaseUsers
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    const recentSignups = recentSupabase.map((su) => {
      const profile = recentProfiles.find((p) => p.userId === su.id);
      return {
        id: su.id,
        email: su.email ?? "",
        fullName: profile
          ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") || null
          : (su.user_metadata?.full_name ?? null),
        role: (profile?.role ?? su.user_metadata?.role ?? "EMPLOYEE") as string,
        profileImageUrl: profile?.profileImageUrl ?? null,
        isEmailVerified: !!su.email_confirmed_at,
        provider: su.app_metadata?.provider ?? "email",
        schoolName: profile?.schoolProfile?.schoolName ?? null,
        accountPlan: profile?.schoolProfile?.accountPlan ?? null,
        createdAt: su.created_at,
        hasPrismaProfile: profileUserIdSet.has(su.id),
      };
    });

    // ─── Growth Chart data (6 เดือน) ───
    // สร้าง 6 เดือนย้อนหลัง
    const months: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    const thaiMonthShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

    const growthChart = months.map((m) => {
      const [yr, mo] = m.split("-").map(Number);
      const employee = profileGrowthRaw.find((r) => r.month === m && r.role === "EMPLOYEE");
      const employer = profileGrowthRaw.find((r) => r.month === m && r.role === "EMPLOYER");
      const jobs = jobGrowthRaw.find((r) => r.month === m);
      return {
        month: thaiMonthShort[mo - 1],
        year: yr,
        key: m,
        teachers: Number(employee?.count ?? 0),
        schools: Number(employer?.count ?? 0),
        users: Number(employee?.count ?? 0) + Number(employer?.count ?? 0),
        jobs: Number(jobs?.count ?? 0),
      };
    });

    // ─── Deadline Jobs detail ───
    const deadlineJobsFormatted = deadlineJobs.map((j) => ({
      id: j.id,
      title: j.title,
      schoolName: j.schoolProfile.schoolName,
      deadline: j.deadline?.toISOString() ?? null,
      applicationCount: j._count.applications,
      daysLeft: j.deadline
        ? Math.ceil((j.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null,
    }));

    return NextResponse.json({
      status_code: 200,
      message_th: "ดึงข้อมูล Dashboard สำเร็จ",
      message_en: "Dashboard data fetched successfully",
      data: {
        stats,
        pendingActions,
        recentSignups,
        growthChart,
        deadlineJobs: deadlineJobsFormatted,
        inactiveSchools: inactiveSchools.map((s) => ({
          id: s.id,
          schoolName: s.schoolName,
          province: s.province,
          email: s.profile.email,
        })),
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ [GET /api/v1/admin/dashboard]", msg);
    return NextResponse.json(
      {
        status_code: 500,
        message_th: "เกิดข้อผิดพลาดภายในระบบ",
        message_en: "Internal server error",
        data: null,
      },
      { status: 500 },
    );
  }
}
