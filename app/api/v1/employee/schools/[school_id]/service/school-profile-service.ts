import { prisma } from "@/lib/prisma";
import { JobStatus, LicenseRequired } from "@prisma/client";

// ✨ แปลง LicenseRequired → ข้อความภาษาไทย
const licenseMap: Record<LicenseRequired, string> = {
  required: "จำเป็นต้องมี",
  not_required: "ไม่จำเป็นต้องมี",
  pending_ok: "มีรับผู้ที่กำลังดำเนินการ",
};

// ✨ ดึงข้อมูล SchoolProfile ครบถ้วนพร้อมงาน OPEN สำหรับหน้า profile โรงเรียน
export const getSchoolProfileService = async (schoolId: string) => {
  const school = await prisma.schoolProfile.findUnique({
    where: { id: schoolId },
    include: {
      schoolBenefits: {
        select: { benefit: true },
        orderBy: { id: "asc" },
      },
      jobs: {
        where: { status: JobStatus.OPEN },
        include: {
          jobSubjects: { select: { subject: true } },
          jobGrades: { select: { grade: true } },
          jobBenefits: { select: { benefit: true } },
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      // ✨ ดึง profile ของ EMPLOYER เพื่อเอา email
      profile: {
        select: {
          email: true,
          phoneNumber: true,
        },
      },
    },
  });

  if (!school) return null;

  // ✨ นับตำแหน่งงานทั้งหมดในระบบ (รวม CLOSED/DRAFT ด้วย เพื่อแสดงประวัติ)
  const totalJobsPosted = await prisma.job.count({
    where: { schoolProfileId: schoolId },
  });

  // ✨ แปลงโครงสร้างข้อมูลให้พร้อมส่งกลับ frontend
  return {
    id: school.id,
    schoolName: school.schoolName,
    schoolType: school.schoolType ?? null,
    affiliation: school.affiliation ?? null,
    province: school.province,
    district: school.district ?? null,
    address: school.address ?? null,
    logoUrl: school.logoUrl ?? null,
    coverImageUrl: school.coverImageUrl ?? null,
    website: school.website ?? null,
    phone: school.phone ?? school.profile?.phoneNumber ?? null,
    email: school.email ?? school.profile?.email ?? null,
    description: school.description ?? null,
    studentCount: school.studentCount ?? null,
    teacherCount: school.teacherCount ?? null,
    foundedYear: school.foundedYear ?? null,
    totalJobsPosted,
    benefits: school.schoolBenefits.map((b) => b.benefit),
    openJobCount: school.jobs.length,
    jobs: school.jobs.map((job) => ({
      id: job.id,
      title: job.title,
      jobType: job.jobType ?? null,
      positionsAvailable: job.positionsAvailable,
      salaryMin: job.salaryMin ?? null,
      salaryMax: job.salaryMax ?? null,
      salaryNegotiable: job.salaryNegotiable,
      licenseRequired: licenseMap[job.licenseRequired],
      deadline: job.deadline?.toISOString() ?? null,
      postedAt: job.createdAt.toISOString(),
      isNew: Date.now() - job.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000,
      applicantCount: job._count.applications,
      subjects: job.jobSubjects.map((s) => s.subject),
      grades: job.jobGrades.map((g) => g.grade),
      benefits: job.jobBenefits.map((b) => b.benefit),
    })),
  };
};
