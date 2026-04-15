import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// ✨ Supabase Admin Client — ใช้ SERVICE_ROLE_KEY เพื่อเข้าถึง auth.users
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

// ✨ GET /api/v1/admin/users — ดึงรายการ User ทั้งหมด + รายละเอียดจาก Supabase + Prisma
// Query params:
//   role=EMPLOYEE|EMPLOYER|ADMIN
//   status=active|unverified|banned
//   keyword=string
//   page=number (default 1)
//   page_size=number (default 50, max 200)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roleFilter = searchParams.get("role") ?? "all";
    const statusFilter = searchParams.get("status") ?? "all";
    const keyword = searchParams.get("keyword") ?? "";
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const pageSize = Math.min(200, Math.max(1, Number(searchParams.get("page_size") ?? "50")));

    // ✨ ดึง auth.users ทั้งหมดจาก Supabase (max 1000)
    const { data: supabaseData, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (error) throw new Error(error.message);

    const supabaseUsers = supabaseData.users;

    // ✨ ดึง Prisma Profile ทั้งหมด พร้อม stats — ใช้ select เพื่อประหยัด query
    const profiles = await prisma.profile.findMany({
      select: {
        id: true,
        userId: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        profileImageUrl: true,
        profileVisibility: true,
        licenseStatus: true,
        createdAt: true,
        updatedAt: true,
        // ✨ นับ applications (EMPLOYEE)
        _count: {
          select: {
            applications: true,
            blogs: true,
            notifications: true,
          },
        },
        // ✨ SchoolProfile สำหรับ EMPLOYER
        schoolProfile: {
          select: {
            id: true,
            schoolName: true,
            accountPlan: true,
            jobQuotaMax: true,
            province: true,
            _count: {
              select: {
                jobs: true,
                orgMembers: { where: { status: "ACTIVE" } },
              },
            },
          },
        },
      },
    });

    // ✨ Map Prisma profile → dict keyed by userId
    const profileMap = new Map(profiles.map((p) => [p.userId, p]));

    // ✨ Merge Supabase + Prisma
    let merged = supabaseUsers.map((su) => {
      const profile = profileMap.get(su.id);
      const isBanned = !!(su as Record<string, unknown>).banned_until;
      const isEmailVerified = !!su.email_confirmed_at;
      const provider = su.app_metadata?.provider ?? "email";
      const lastSignIn = su.last_sign_in_at ?? null;

      return {
        id: su.id,
        email: su.email ?? "",
        // ✨ ใช้ชื่อจาก Prisma Profile ก่อน ถ้าไม่มีจึง fallback Supabase metadata
        firstName: profile?.firstName ?? su.user_metadata?.first_name ?? null,
        lastName: profile?.lastName ?? su.user_metadata?.last_name ?? null,
        fullName:
          profile
            ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") || null
            : su.user_metadata?.full_name ?? su.user_metadata?.name ?? null,
        role: (profile?.role ?? su.user_metadata?.role ?? "EMPLOYEE") as "EMPLOYEE" | "EMPLOYER" | "ADMIN",
        phoneNumber: profile?.phoneNumber ?? null,
        profileImageUrl: profile?.profileImageUrl ?? null,
        profileVisibility: profile?.profileVisibility ?? null,
        // ✨ Supabase Auth fields
        isEmailVerified,
        isBanned,
        provider,
        lastSignInAt: lastSignIn,
        createdAt: su.created_at,
        updatedAt: su.updated_at ?? su.created_at,
        // ✨ Prisma stats
        hasPrismaProfile: !!profile,
        prismaProfileId: profile?.id ?? null,
        applicationCount: profile?._count?.applications ?? 0,
        blogCount: profile?._count?.blogs ?? 0,
        // ✨ EMPLOYER stats
        schoolName: profile?.schoolProfile?.schoolName ?? null,
        accountPlan: profile?.schoolProfile?.accountPlan ?? null,
        jobCount: profile?.schoolProfile?._count?.jobs ?? 0,
        orgMemberCount: profile?.schoolProfile?._count?.orgMembers ?? 0,
        province: profile?.schoolProfile?.province ?? null,
      };
    });

    // ✨ Filter: keyword
    if (keyword) {
      const kw = keyword.toLowerCase();
      merged = merged.filter((u) =>
        [u.email, u.fullName ?? "", u.role, u.schoolName ?? "", u.province ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(kw),
      );
    }

    // ✨ Filter: role
    if (roleFilter !== "all") {
      merged = merged.filter((u) => u.role === roleFilter);
    }

    // ✨ Filter: status
    if (statusFilter === "active") {
      merged = merged.filter((u) => u.isEmailVerified && !u.isBanned);
    } else if (statusFilter === "unverified") {
      merged = merged.filter((u) => !u.isEmailVerified);
    } else if (statusFilter === "banned") {
      merged = merged.filter((u) => u.isBanned);
    } else if (statusFilter === "no_profile") {
      merged = merged.filter((u) => !u.hasPrismaProfile);
    }

    // ✨ เรียงล่าสุดก่อน
    merged.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // ✨ สถิติ summary
    const summary = {
      total: merged.length,
      byRole: {
        EMPLOYEE: merged.filter((u) => u.role === "EMPLOYEE").length,
        EMPLOYER: merged.filter((u) => u.role === "EMPLOYER").length,
        ADMIN: merged.filter((u) => u.role === "ADMIN").length,
      },
      byStatus: {
        active: merged.filter((u) => u.isEmailVerified && !u.isBanned).length,
        unverified: merged.filter((u) => !u.isEmailVerified).length,
        banned: merged.filter((u) => u.isBanned).length,
        no_profile: merged.filter((u) => !u.hasPrismaProfile).length,
      },
      providers: merged.reduce<Record<string, number>>((acc, u) => {
        acc[u.provider] = (acc[u.provider] ?? 0) + 1;
        return acc;
      }, {}),
      // ✨ Growth: สมัครใหม่ 30 วันล่าสุด
      newLast30Days: merged.filter((u) => {
        const d = new Date(u.createdAt);
        return Date.now() - d.getTime() < 30 * 24 * 60 * 60 * 1000;
      }).length,
      newLast7Days: merged.filter((u) => {
        const d = new Date(u.createdAt);
        return Date.now() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
      }).length,
    };

    // ✨ Paginate
    const total = merged.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginatedUsers = merged.slice((page - 1) * pageSize, page * pageSize);

    return NextResponse.json({
      status_code: 200,
      message_th: "ดึงข้อมูล User สำเร็จ",
      message_en: "Fetched users successfully",
      data: {
        users: paginatedUsers,
        total,
        page,
        page_size: pageSize,
        total_pages: totalPages,
        summary,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ [GET /api/v1/admin/users]", msg);
    return NextResponse.json(
      {
        status_code: 500,
        message_th: "ไม่สามารถดึงข้อมูล User ได้",
        message_en: "Failed to fetch users",
        data: null,
      },
      { status: 500 },
    );
  }
}
