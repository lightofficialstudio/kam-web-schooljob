import { prisma } from "@/lib/prisma";
import { JobStatus, LicenseRequired, Prisma } from "@prisma/client";
import { JobSearchQuery } from "../validation/job-search-schema";

// ✨ ดึงรายการงานสำหรับหน้าค้นหา (Public — เฉพาะ Job ที่ OPEN เท่านั้น) — Cursor-based Lazy Loading
// ✨ แปลง posted_at string → วันที่เริ่มต้น (ค้นหาตั้งแต่วันนั้นจนถึงปัจจุบัน)
const postedAtToDate = (postedAt: string): Date => {
  const now = new Date();
  const dayMap: Record<string, number> = { today: 0, "3days": 3, "7days": 7, "30days": 30 };
  const days = dayMap[postedAt] ?? 0;
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const searchJobsService = async (query: JobSearchQuery) => {
  const { keyword, province, school_type, license, salary_min, salary_max, grade_level, job_type, posted_at, cursor, page_size } = query;

  // ✨ สร้าง where clause สำหรับ filter
  const whereClause: Prisma.JobWhereInput = {
    status: JobStatus.OPEN,
    // กรองด้วย grade level (ผ่าน relation jobGrades)
    ...(grade_level && {
      jobGrades: { some: { grade: grade_level } },
    }),
    // กรองด้วย license
    ...(license && {
      licenseRequired: license as LicenseRequired,
    }),
    // กรองด้วยรูปแบบการจ้างงาน
    ...(job_type && { jobType: job_type }),
    // กรองด้วยวันที่ประกาศ
    ...(posted_at && { createdAt: { gte: postedAtToDate(posted_at) } }),
    // กรองด้วยเงินเดือน
    ...(salary_min !== undefined && { salaryMin: { gte: salary_min } }),
    ...(salary_max !== undefined && { salaryMax: { lte: salary_max } }),
    // กรองด้วยโรงเรียน (province, school_type ผ่าน relation schoolProfile)
    schoolProfile: {
      ...(province && { province }),
      ...(school_type && { schoolType: school_type }),
    },
  };

  // ✨ กรองด้วย keyword (ค้นหาใน title + schoolProfile.schoolName + jobSubjects)
  if (keyword) {
    whereClause.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { schoolProfile: { schoolName: { contains: keyword, mode: "insensitive" } } },
      { jobSubjects: { some: { subject: { contains: keyword, mode: "insensitive" } } } },
    ];
  }

  // ✨ ดึง data เท่านั้น (take + 1 เพื่อตรวจว่ามีหน้าถัดไปหรือไม่ — ไม่ต้อง count ทุก request)
  const jobs = await prisma.job.findMany({
    where: whereClause,
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
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
    // ✨ cursor-based: ข้ามเฉพาะ record เดียว (cursor) แทน skip N records
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    take: page_size + 1, // ✨ ดึงเกิน 1 เพื่อตรวจ hasMore โดยไม่ต้อง COUNT(*)
  });

  // ✨ แปลง LicenseRequired enum → ข้อความภาษาไทย
  const licenseMap: Record<LicenseRequired, string> = {
    required: "จำเป็นต้องมี",
    not_required: "ไม่จำเป็นต้องมี",
    pending_ok: "มีรับผู้ที่กำลังดำเนินการ",
  };

  // ✨ ตรวจ hasMore จาก record ที่ดึงมาเกิน
  const hasMore = jobs.length > page_size;
  const pageJobs = hasMore ? jobs.slice(0, page_size) : jobs;
  const nextCursor = hasMore ? pageJobs[pageJobs.length - 1].id : null;

  // ✨ แปลงโครงสร้างข้อมูลให้ตรงกับ Job interface ฝั่ง frontend
  const formattedJobs = pageJobs.map((job) => ({
    id: job.id,
    title: job.title,
    subjects: job.jobSubjects.map((s) => s.subject),
    grades: job.jobGrades.map((g) => g.grade),
    vacancyCount: job.positionsAvailable,
    salaryType: job.salaryNegotiable
      ? "ตามประสบการณ์"
      : job.salaryMin || job.salaryMax
        ? "ระบุเงินเดือน"
        : "ไม่ระบุ",
    salaryMin: job.salaryMin ?? undefined,
    salaryMax: job.salaryMax ?? undefined,
    description: job.description ?? "",
    educationLevel: job.educationLevel ?? "",
    teachingExperience: job.experience ?? "",
    licenseRequired: licenseMap[job.licenseRequired],
    qualifications: job.qualifications ?? "",
    gender: job.gender ?? "ไม่จำกัด",
    jobType: job.jobType ?? undefined,
    schoolName: job.schoolProfile.schoolName,
    schoolType: job.schoolProfile.schoolType ?? "",
    province: job.schoolProfile.province,
    address: [job.schoolProfile.district, job.schoolProfile.province]
      .filter(Boolean)
      .join(" "),
    logoUrl: job.schoolProfile.logoUrl ?? undefined,
    benefits: job.jobBenefits.map((b) => b.benefit),
    applicantCount: job._count.applications,
    deadline: job.deadline?.toISOString() ?? null,
    postedAt: job.createdAt.toISOString(),
    isNew: Date.now() - job.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000,
  }));

  return {
    jobs: formattedJobs,
    next_cursor: nextCursor,
    has_more: hasMore,
    page_size,
  };
};
