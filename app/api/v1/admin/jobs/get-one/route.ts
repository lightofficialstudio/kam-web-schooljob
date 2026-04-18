import { prisma } from "@/lib/prisma";

// ✨ GET /api/v1/admin/jobs/get-one?admin_user_id=xxx&job_id=xxx
// Admin ดึงรายละเอียด job เพื่อนำไปแก้ไข — ไม่ต้องผ่าน ownership check
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUserId = searchParams.get("admin_user_id");
    const jobId       = searchParams.get("job_id");

    if (!adminUserId || !jobId) {
      return Response.json({ status_code: 400, message_th: "กรุณาระบุ admin_user_id และ job_id", message_en: "admin_user_id and job_id are required", data: null }, { status: 400 });
    }

    // ✨ ตรวจ role
    const admin = await prisma.profile.findFirst({
      where: { OR: [{ userId: adminUserId }, { id: adminUserId }] },
      select: { role: true },
    });
    if (!admin || admin.role !== "ADMIN") {
      return Response.json({ status_code: 403, message_th: "ไม่มีสิทธิ์เข้าถึง", message_en: "Forbidden", data: null }, { status: 403 });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        jobSubjects:  { select: { subject: true } },
        jobGrades:    { select: { grade: true } },
        jobBenefits:  { select: { benefit: true } },
        schoolProfile: { select: { id: true, schoolName: true, logoUrl: true } },
      },
    });
    if (!job) {
      return Response.json({ status_code: 404, message_th: "ไม่พบประกาศงาน", message_en: "Job not found", data: null }, { status: 404 });
    }

    return Response.json({ status_code: 200, message_th: "ดึงข้อมูลสำเร็จ", message_en: "Success", data: job });
  } catch (err) {
    console.error("❌ [admin/jobs/get-one]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
