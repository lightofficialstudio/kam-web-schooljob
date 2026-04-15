import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

// ✨ GET /api/v1/admin/users/[id] — รายละเอียด User เต็มรูปแบบ (Supabase + Prisma)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // ✨ ดึง Supabase user
    const { data: supabaseData, error: supabaseError } =
      await supabaseAdmin.auth.admin.getUserById(id);
    if (supabaseError || !supabaseData?.user) {
      return NextResponse.json(
        { status_code: 404, message_th: "ไม่พบผู้ใช้", message_en: "User not found", data: null },
        { status: 404 },
      );
    }
    const su = supabaseData.user;

    // ✨ ดึง Prisma Profile พร้อม relations เต็ม
    const profile = await prisma.profile.findUnique({
      where: { userId: id },
      include: {
        workExperiences: { where: { isDeleted: false }, orderBy: { startDate: "desc" } },
        educations: { where: { isDeleted: false } },
        licenses: { where: { isDeleted: false } },
        specializations: true,
        gradeCanTeaches: true,
        preferredProvinces: true,
        languages: { where: { isDeleted: false } },
        skills: { where: { isDeleted: false } },
        // ✨ 10 ใบสมัครล่าสุด
        applications: {
          orderBy: { appliedAt: "desc" },
          take: 10,
          include: {
            job: {
              select: {
                id: true,
                title: true,
                status: true,
                schoolProfile: { select: { schoolName: true } },
              },
            },
          },
        },
        // ✨ SchoolProfile + OrgMembers + Jobs
        schoolProfile: {
          include: {
            jobs: {
              orderBy: { createdAt: "desc" },
              take: 10,
              select: {
                id: true,
                title: true,
                status: true,
                createdAt: true,
                deadline: true,
                _count: { select: { applications: true } },
              },
            },
            orgMembers: {
              where: { status: "ACTIVE" },
              include: {
                profile: { select: { email: true, firstName: true, lastName: true, role: true } },
                role: { select: { name: true } },
              },
            },
            orgRoles: { include: { permissions: true } },
            _count: {
              select: { jobs: true, orgMembers: { where: { status: "ACTIVE" } } },
            },
          },
        },
        // ✨ Blog activity
        blogs: { orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, status: true, createdAt: true } },
        _count: {
          select: {
            applications: true,
            blogs: true,
            workExperiences: { where: { isDeleted: false } },
            educations: { where: { isDeleted: false } },
          },
        },
      },
    });

    // ✨ สร้าง Audit Log จากข้อมูล Supabase + Prisma (timeline ของ events สำคัญ)
    const auditTimeline: {
      timestamp: string;
      event: string;
      detail: string;
      type: "auth" | "profile" | "activity" | "system";
    }[] = [];

    // Auth events
    auditTimeline.push({
      timestamp: su.created_at,
      event: "สมัครสมาชิก",
      detail: `ผ่านช่องทาง ${su.app_metadata?.provider ?? "email"}`,
      type: "auth",
    });

    if (su.email_confirmed_at) {
      auditTimeline.push({
        timestamp: su.email_confirmed_at,
        event: "ยืนยันอีเมลสำเร็จ",
        detail: su.email ?? "",
        type: "auth",
      });
    }

    if (su.last_sign_in_at) {
      auditTimeline.push({
        timestamp: su.last_sign_in_at,
        event: "เข้าสู่ระบบล่าสุด",
        detail: `provider: ${su.app_metadata?.provider ?? "email"}`,
        type: "auth",
      });
    }

    if (profile) {
      auditTimeline.push({
        timestamp: profile.createdAt.toISOString(),
        event: "สร้าง Profile สำเร็จ",
        detail: `role: ${profile.role}`,
        type: "profile",
      });

      if (profile.updatedAt.getTime() !== profile.createdAt.getTime()) {
        auditTimeline.push({
          timestamp: profile.updatedAt.toISOString(),
          event: "อัปเดต Profile ล่าสุด",
          detail: "",
          type: "profile",
        });
      }

      // Application events (EMPLOYEE)
      for (const app of profile.applications ?? []) {
        auditTimeline.push({
          timestamp: app.appliedAt.toISOString(),
          event: "สมัครงาน",
          detail: `${app.job?.title ?? "—"} @ ${app.job?.schoolProfile?.schoolName ?? "—"} (${app.status})`,
          type: "activity",
        });
      }

      // SchoolProfile + Job events (EMPLOYER)
      if (profile.schoolProfile) {
        auditTimeline.push({
          timestamp: profile.schoolProfile.createdAt.toISOString(),
          event: "สร้าง School Profile",
          detail: profile.schoolProfile.schoolName,
          type: "profile",
        });
        for (const job of profile.schoolProfile.jobs ?? []) {
          auditTimeline.push({
            timestamp: job.createdAt.toISOString(),
            event: "ประกาศงาน",
            detail: `${job.title} (${job.status})`,
            type: "activity",
          });
        }
      }

      // Blog events
      for (const blog of profile.blogs ?? []) {
        auditTimeline.push({
          timestamp: blog.createdAt.toISOString(),
          event: "สร้างบทความ",
          detail: `${blog.title} (${blog.status})`,
          type: "activity",
        });
      }
    }

    // ✨ เรียง timeline ล่าสุดก่อน
    auditTimeline.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    const result = {
      // ─── Supabase Auth ───
      id: su.id,
      email: su.email ?? "",
      phone: su.phone ?? null,
      isEmailVerified: !!su.email_confirmed_at,
      emailConfirmedAt: su.email_confirmed_at ?? null,
      isBanned: !!(su as Record<string, unknown>).banned_until,
      bannedUntil: (su as Record<string, unknown>).banned_until ?? null,
      provider: su.app_metadata?.provider ?? "email",
      providers: su.app_metadata?.providers ?? [],
      lastSignInAt: su.last_sign_in_at ?? null,
      createdAt: su.created_at,
      updatedAt: su.updated_at ?? su.created_at,
      supabaseMetadata: su.user_metadata,

      // ─── Prisma Profile ───
      hasPrismaProfile: !!profile,
      profile: profile
        ? {
            id: profile.id,
            role: profile.role,
            firstName: profile.firstName,
            lastName: profile.lastName,
            fullName: [profile.firstName, profile.lastName].filter(Boolean).join(" ") || null,
            phoneNumber: profile.phoneNumber,
            profileImageUrl: profile.profileImageUrl,
            profileVisibility: profile.profileVisibility,
            licenseStatus: profile.licenseStatus,
            teachingExperience: profile.teachingExperience,
            canRelocate: profile.canRelocate,
            gender: profile.gender,
            dateOfBirth: profile.dateOfBirth,
            nationality: profile.nationality,
            recentSchool: profile.recentSchool,
            specialActivities: profile.specialActivities,
            // ─── Relations ───
            specializations: profile.specializations.map((s) => s.subject),
            gradeCanTeaches: profile.gradeCanTeaches.map((g) => g.grade),
            preferredProvinces: profile.preferredProvinces.map((p) => p.province),
            languages: profile.languages.map((l) => ({ language: l.language, level: l.level })),
            skills: profile.skills.map((s) => ({ skill: s.skill, level: s.level })),
            workExperienceCount: profile._count.workExperiences,
            educationCount: profile._count.educations,
          }
        : null,

      // ─── Activity Stats ───
      stats: {
        applicationCount: profile?._count?.applications ?? 0,
        blogCount: profile?._count?.blogs ?? 0,
        jobCount: profile?.schoolProfile?._count?.jobs ?? 0,
        orgMemberCount: profile?.schoolProfile?._count?.orgMembers ?? 0,
      },

      // ─── SchoolProfile (EMPLOYER) ───
      schoolProfile: profile?.schoolProfile
        ? {
            id: profile.schoolProfile.id,
            schoolName: profile.schoolProfile.schoolName,
            accountPlan: profile.schoolProfile.accountPlan,
            jobQuotaMax: profile.schoolProfile.jobQuotaMax,
            province: profile.schoolProfile.province,
            recentJobs: profile.schoolProfile.jobs,
            orgMembers: profile.schoolProfile.orgMembers.map((m) => ({
              email: m.profile.email,
              name: [m.profile.firstName, m.profile.lastName].filter(Boolean).join(" "),
              role: m.role?.name ?? "—",
              status: m.status,
            })),
            orgRoles: profile.schoolProfile.orgRoles.map((r) => ({
              name: r.name,
              permissions: r.permissions.map((p) => p.permissionKey),
            })),
          }
        : null,

      // ─── Recent Applications (EMPLOYEE) ───
      recentApplications: (profile?.applications ?? []).map((a) => ({
        id: a.id,
        jobTitle: a.job?.title ?? "—",
        schoolName: a.job?.schoolProfile?.schoolName ?? "—",
        status: a.status,
        appliedAt: a.appliedAt.toISOString(),
      })),

      // ─── Recent Blogs ───
      recentBlogs: profile?.blogs ?? [],

      // ─── Audit Timeline ───
      auditTimeline,
    };

    return NextResponse.json({
      status_code: 200,
      message_th: "ดึงข้อมูล User สำเร็จ",
      message_en: "User detail fetched",
      data: result,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ [GET /api/v1/admin/users/[id]]", msg);
    return NextResponse.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาด", message_en: "Internal server error", data: null },
      { status: 500 },
    );
  }
}

// ✨ PUT /api/v1/admin/users/[id] — อัปเดต role + ban/unban
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { role, ban } = body as { role?: string; ban?: boolean };

    const updateData: Record<string, unknown> = {};

    // ✨ อัปเดต role ใน user_metadata
    if (role) {
      updateData.user_metadata = { role };
      // ✨ sync Prisma Profile ด้วย
      await prisma.profile.updateMany({
        where: { userId: id },
        data: { role: role as "EMPLOYEE" | "EMPLOYER" | "ADMIN" },
      });
    }

    // ✨ Ban/Unban — set ban_duration ผ่าน Supabase Admin API
    if (ban !== undefined) {
      updateData.ban_duration = ban ? "876000h" : "none"; // 876000h ≈ 100 ปี = permanent
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, updateData as Parameters<typeof supabaseAdmin.auth.admin.updateUserById>[1]);

    if (error) {
      return NextResponse.json(
        { status_code: 500, message_th: error.message, message_en: error.message, data: null },
        { status: 500 },
      );
    }

    return NextResponse.json({
      status_code: 200,
      message_th: "อัปเดต User สำเร็จ",
      message_en: "User updated successfully",
      data: {
        user_id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role,
        isBanned: !!(data.user as Record<string, unknown>).banned_until,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("❌ [PUT /api/v1/admin/users/[id]]", msg);
    return NextResponse.json(
      { status_code: 500, message_th: msg, message_en: msg, data: null },
      { status: 500 },
    );
  }
}

// ✨ DELETE /api/v1/admin/users/[id] — ลบ User ออกจาก Supabase + Prisma
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // ✨ ลบ Prisma Profile ก่อน (cascade relations)
    await prisma.profile.deleteMany({ where: { userId: id } });

    // ✨ ลบ Supabase auth user
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) {
      return NextResponse.json(
        { status_code: 500, message_th: error.message, message_en: error.message, data: null },
        { status: 500 },
      );
    }

    return NextResponse.json({
      status_code: 200,
      message_th: "ลบ User สำเร็จ",
      message_en: "User deleted successfully",
      data: { deleted_user_id: id },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("❌ [DELETE /api/v1/admin/users/[id]]", msg);
    return NextResponse.json(
      { status_code: 500, message_th: msg, message_en: msg, data: null },
      { status: 500 },
    );
  }
}
