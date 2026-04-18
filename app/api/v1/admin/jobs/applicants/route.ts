import { prisma } from "@/lib/prisma";

// ✨ GET /api/v1/admin/jobs/applicants?admin_user_id=xxx&job_id=xxx
// Admin ดูผู้สมัครของ job ใดก็ได้ โดยไม่ต้องผ่าน ownership check
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUserId = searchParams.get("admin_user_id");
    const jobId       = searchParams.get("job_id");

    if (!adminUserId || !jobId) {
      return Response.json({ status_code: 400, message_th: "กรุณาระบุ admin_user_id และ job_id", message_en: "admin_user_id and job_id are required", data: null }, { status: 400 });
    }

    // ตรวจ role
    const admin = await prisma.profile.findUnique({
      where: { userId: adminUserId },
      select: { role: true },
    });
    if (!admin || admin.role !== "ADMIN") {
      return Response.json({ status_code: 403, message_th: "ไม่มีสิทธิ์เข้าถึง", message_en: "Forbidden", data: null }, { status: 403 });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, title: true },
    });
    if (!job) {
      return Response.json({ status_code: 404, message_th: "ไม่พบประกาศงาน", message_en: "Job not found", data: null }, { status: 404 });
    }

    const applicants = await prisma.application.findMany({
      where: { jobId },
      orderBy: { appliedAt: "desc" },
      include: {
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            teachingExperience: true,
            specialActivities: true,
            profileImageUrl: true,
            licenseStatus: true,
            canRelocate: true,
            specializations: { select: { subject: true } },
            gradeCanTeaches: { select: { grade: true } },
            educations: {
              where: { isDeleted: false },
              orderBy: { graduationYear: "desc" },
              take: 1,
              select: { level: true, institution: true, major: true, graduationYear: true },
            },
            workExperiences: {
              where: { isDeleted: false },
              orderBy: { startDate: "desc" },
              take: 2,
              select: { jobTitle: true, companyName: true, startDate: true, endDate: true, inPresent: true },
            },
            preferredProvinces: { select: { province: true } },
          },
        },
        resume: { select: { fileName: true, fileUrl: true } },
      },
    });

    return Response.json({ status_code: 200, message_th: "ดึงข้อมูลสำเร็จ", message_en: "Success", data: { job, applicants } });
  } catch (err) {
    console.error("❌ [admin/jobs/applicants]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
