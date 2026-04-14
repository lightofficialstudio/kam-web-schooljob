import { prisma } from "@/lib/prisma";

// ✨ GET /api/v1/employer/organization/plan?user_id=xxx
// ดึงข้อมูล Account Plan + จำนวนประกาศที่ใช้ไป / โควต้าสูงสุด
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return Response.json(
        { status_code: 400, message_th: "กรุณาระบุ user_id", message_en: "user_id is required", data: null },
        { status: 400 },
      );
    }

    // ✨ ดึง SchoolProfile พร้อมนับ Job ที่ยังเปิดอยู่
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        schoolProfile: {
          select: {
            accountPlan: true,
            jobQuotaMax: true,
            _count: {
              select: {
                jobs: {
                  where: { status: { in: ["OPEN", "DRAFT"] } },
                },
              },
            },
          },
        },
      },
    });

    if (!profile?.schoolProfile) {
      return Response.json(
        { status_code: 404, message_th: "ไม่พบข้อมูลโรงเรียน", message_en: "School profile not found", data: null },
        { status: 404 },
      );
    }

    const { accountPlan, jobQuotaMax, _count } = profile.schoolProfile;
    const jobUsed = _count.jobs;
    const jobRemaining = Math.max(0, jobQuotaMax - jobUsed);

    return Response.json({
      status_code: 200,
      message_th: "ดึงข้อมูลสำเร็จ",
      message_en: "Fetched successfully",
      data: {
        account_plan: accountPlan,
        job_quota_max: jobQuotaMax,
        job_used: jobUsed,
        job_remaining: jobRemaining,
      },
    });
  } catch (error) {
    console.error("❌ [GET /api/v1/employer/organization/plan]", error);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 },
    );
  }
}
