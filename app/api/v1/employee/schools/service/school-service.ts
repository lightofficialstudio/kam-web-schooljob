import { prisma } from "@/lib/prisma";
import { JobStatus, LicenseRequired } from "@prisma/client";
import { SchoolSearchQuery } from "../validation/school-search-schema";

// ✨ แปลง LicenseRequired → ข้อความภาษาไทย
const licenseMap: Record<LicenseRequired, string> = {
  required: "จำเป็นต้องมี",
  not_required: "ไม่จำเป็นต้องมี",
  pending_ok: "มีรับผู้ที่กำลังดำเนินการ",
};

// ✨ ดึงรายชื่อโรงเรียนที่มีงาน OPEN พร้อม jobs ในโรงเรียนนั้น
export const searchSchoolsService = async (query: SchoolSearchQuery) => {
  const { keyword, province, school_type, sort_by } = query;

  const schools = await prisma.schoolProfile.findMany({
    where: {
      // ✨ กรองเฉพาะโรงเรียนที่มีงาน OPEN อยู่
      jobs: { some: { status: JobStatus.OPEN } },
      ...(province && { province }),
      ...(school_type && { schoolType: school_type }),
      ...(keyword && {
        schoolName: { contains: keyword, mode: "insensitive" },
      }),
    },
    select: {
      id: true,
      schoolName: true,
      schoolType: true,
      province: true,
      logoUrl: true,
      jobs: {
        where: { status: JobStatus.OPEN },
        select: {
          id: true,
          title: true,
          salaryMin: true,
          salaryMax: true,
          salaryNegotiable: true,
          jobType: true,
          licenseRequired: true,
          jobGrades: { select: { grade: true } },
          jobSubjects: { select: { subject: true } },
        },
      },
      // ✨ นับงาน OPEN เพื่อใช้เรียงลำดับ most_jobs ฝั่ง DB
      _count: { select: { jobs: { where: { status: JobStatus.OPEN } } } },
    },
    // ✨ latest = createdAt desc (default), most_jobs = เรียงโดย _count ใน memory หลัง query
    orderBy: { createdAt: "desc" },
  });

  // ✨ เรียงตาม most_jobs หลัง query (Prisma ไม่รองรับ orderBy _count relation โดยตรง)
  if (sort_by === "most_jobs") {
    schools.sort((a, b) => b._count.jobs - a._count.jobs);
  }

  // ✨ แปลงโครงสร้างให้ตรงกับ School interface ฝั่ง frontend
  return schools.map((school) => ({
    id: school.id,
    name: school.schoolName,
    logo: school.logoUrl ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(school.schoolName)}`,
    province: school.province,
    type: school.schoolType ?? "โรงเรียน",
    jobCount: school.jobs.length,
    jobs: school.jobs.map((job) => {
      const salaryText = job.salaryNegotiable
        ? "ตามประสบการณ์"
        : job.salaryMin && job.salaryMax
          ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
          : job.salaryMin
            ? `${job.salaryMin.toLocaleString()}+`
            : "ไม่ระบุ";

      return {
        id: job.id,
        title: job.title,
        salary: salaryText,
        type: job.jobType ?? "Full-time",
        gradeLevels: job.jobGrades.map((g) => g.grade),
        subjects: job.jobSubjects.map((s) => s.subject),
        licenseRequired: licenseMap[job.licenseRequired],
      };
    }),
  }));
};
