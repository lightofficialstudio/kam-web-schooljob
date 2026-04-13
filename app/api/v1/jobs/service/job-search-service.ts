import { prisma } from "@/lib/prisma";
import { JobStatus, LicenseRequired, Prisma } from "@prisma/client";
import { JobSearchQuery } from "../validation/job-search-schema";

// ✨ ดึงรายการงานสำหรับหน้าค้นหา (Public — เฉพาะ Job ที่ OPEN เท่านั้น)
export const searchJobsService = async (query: JobSearchQuery) => {
  const { keyword, province, school_type, license, salary_min, salary_max, grade_level, page, page_size } = query;

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

  const skip = (page - 1) * page_size;

  // ✨ ดึง total count และ data พร้อมกัน
  const [total, jobs] = await Promise.all([
    prisma.job.count({ where: whereClause }),
    prisma.job.findMany({
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
      skip,
      take: page_size,
    }),
  ]);

  // ✨ แปลง LicenseRequired enum → ข้อความภาษาไทย
  const licenseMap: Record<LicenseRequired, string> = {
    required: "จำเป็นต้องมี",
    not_required: "ไม่จำเป็นต้องมี",
    pending_ok: "มีรับผู้ที่กำลังดำเนินการ",
  };

  // ✨ แปลงโครงสร้างข้อมูลให้ตรงกับ Job interface ฝั่ง frontend
  const formattedJobs = jobs.map((job) => ({
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
    educationLevel: "",
    teachingExperience: "",
    licenseRequired: licenseMap[job.licenseRequired],
    gender: "ไม่จำกัด",
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
    total,
    page,
    page_size,
    total_pages: Math.ceil(total / page_size),
  };
};
