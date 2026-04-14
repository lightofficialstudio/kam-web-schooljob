import { PACKAGE_DEFINITIONS, PlanType } from "@/app/api/v1/admin/packages/validation/package-schema";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// ✨ GET /api/v1/employer/package/read?user_id=xxx
// ดึงข้อมูล Package ปัจจุบันของโรงเรียน — dynamic จาก DB ไม่ hardcode
// Admin เปลี่ยน plan ที่หลังบ้าน → หน้านี้อัปเดตทันที
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return Response.json(
        { status_code: 400, message_th: "กรุณาระบุ user_id", message_en: "user_id is required", data: null },
        { status: 400 },
      );
    }

    // ✨ ดึง SchoolProfile ผ่าน Profile — รวม active job count
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: {
        schoolProfile: {
          select: {
            id: true,
            schoolName: true,
            accountPlan: true,
            jobQuotaMax: true,
            // ✨ นับ OPEN jobs จริงจาก DB
            jobs: {
              where: { status: "OPEN" },
              select: { id: true },
            },
          },
        },
      },
    });

    const sp = profile?.schoolProfile;
    if (!sp) {
      return Response.json(
        { status_code: 404, message_th: "ไม่พบข้อมูลโรงเรียน", message_en: "School profile not found", data: null },
        { status: 404 },
      );
    }

    const plan = sp.accountPlan as PlanType;
    // ✨ ดึง definition จาก shared PACKAGE_DEFINITIONS — Admin แก้ schema ที่เดียวกระทบทุกที่
    const def = PACKAGE_DEFINITIONS[plan] ?? PACKAGE_DEFINITIONS.basic;

    const activeJobCount = sp.jobs.length;
    const quotaUsed = activeJobCount;
    const quotaMax = sp.jobQuotaMax;
    const quotaRemaining = Math.max(0, quotaMax - quotaUsed);
    const quotaUsagePercent = quotaMax > 0 ? Math.min(100, Math.round((quotaUsed / quotaMax) * 100)) : 0;

    return Response.json({
      status_code: 200,
      message_th: "ดึงข้อมูล Package สำเร็จ",
      message_en: "Package fetched",
      data: {
        schoolProfileId: sp.id,
        plan,                          // "basic" | "premium" | "enterprise"
        planLabel: def.label,          // "Basic" | "Premium" | "Enterprise"
        planColor: def.color,          // hex color จาก admin config
        planPrice: def.price,          // ราคา/เดือน
        planFeatures: def.features,    // feature list จาก admin config
        jobQuotaMax: quotaMax,
        jobQuotaUsed: quotaUsed,
        jobQuotaRemaining: quotaRemaining,
        quotaUsagePercent,
        isAtLimit: quotaUsed >= quotaMax,
        isNearLimit: quotaUsagePercent >= 80 && quotaUsed < quotaMax,
      },
    });
  } catch (error) {
    console.error("❌ [GET /api/v1/employer/package/read]", error);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 },
    );
  }
}
