import { prisma } from "@/lib/prisma";
import { JobStatus, LicenseRequired } from "@prisma/client";

const licenseMap: Record<LicenseRequired, string> = {
  required: "จำเป็นต้องมี",
  not_required: "ไม่จำเป็นต้องมี",
  pending_ok: "มีรับผู้ที่กำลังดำเนินการ",
};

// ✨ GET /api/v1/jobs/[job_id] — ดึงรายละเอียดงานตาม ID (Public)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ job_id: string }> },
) {
  try {
    const { job_id } = await params;

    const job = await prisma.job.findFirst({
      where: { id: job_id, status: JobStatus.OPEN },
      include: {
        schoolProfile: {
          select: {
            id: true,
            schoolName: true,
            schoolType: true,
            province: true,
            district: true,
            logoUrl: true,
          },
        },
        jobSubjects: { select: { subject: true } },
        jobGrades: { select: { grade: true } },
        jobBenefits: { select: { benefit: true } },
      },
    });

    if (!job) {
      return Response.json(
        { status_code: 404, message_th: "ไม่พบประกาศงาน", message_en: "Job not found", data: null },
        { status: 404 },
      );
    }

    return Response.json({
      status_code: 200,
      message_th: "ดึงข้อมูลสำเร็จ",
      message_en: "Job fetched successfully",
      data: {
        id: job.id,
        title: job.title,
        description: job.description,
        jobType: job.jobType,
        province: job.schoolProfile.province,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryNegotiable: job.salaryNegotiable,
        licenseRequired: licenseMap[job.licenseRequired],
        positionsAvailable: job.positionsAvailable,
        deadline: job.deadline?.toISOString() ?? null,
        subjects: job.jobSubjects.map((s) => s.subject),
        grades: job.jobGrades.map((g) => g.grade),
        benefits: job.jobBenefits.map((b) => b.benefit),
        schoolName: job.schoolProfile.schoolName,
        schoolType: job.schoolProfile.schoolType,
        logoUrl: job.schoolProfile.logoUrl,
      },
    });
  } catch (error) {
    console.error("❌ [GET /api/v1/jobs/:id]", error);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 },
    );
  }
}
