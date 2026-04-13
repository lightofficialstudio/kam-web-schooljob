import { prisma } from "@/lib/prisma";
import { JobStatus } from "@prisma/client";

// ✨ GET /api/v1/jobs/latest — ดึงประกาศงานล่าสุดสำหรับ Landing Page (Public)
export async function GET() {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const jobs = await prisma.job.findMany({
      where: { status: JobStatus.OPEN },
      include: {
        schoolProfile: {
          select: { schoolName: true, province: true, logoUrl: true },
        },
        jobSubjects: { select: { subject: true } },
        jobGrades: { select: { grade: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    const formatted = jobs.map((job) => {
      const salaryText =
        job.salaryNegotiable
          ? "ตามประสบการณ์"
          : job.salaryMin && job.salaryMax
            ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
            : job.salaryMin
              ? `${job.salaryMin.toLocaleString()}+`
              : "ไม่ระบุ";

      const tags = [
        ...(job.jobType ? [job.jobType] : []),
        ...job.jobSubjects.slice(0, 2).map((s) => s.subject),
      ];

      return {
        id: job.id,
        title: job.title,
        school: job.schoolProfile.schoolName,
        schoolLogo: job.schoolProfile.logoUrl
          ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job.schoolProfile.schoolName)}`,
        location: job.schoolProfile.province,
        salary: salaryText,
        postedAt: job.createdAt.toISOString(),
        isNew: job.createdAt >= sevenDaysAgo,
        tags,
      };
    });

    return Response.json({
      status_code: 200,
      message_th: "ดึงงานล่าสุดสำเร็จ",
      message_en: "Latest jobs fetched",
      data: formatted,
    });
  } catch (error) {
    console.error("❌ [GET /api/v1/jobs/latest]", error);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 },
    );
  }
}
