import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";

// ✨ แปลง ApplicationStatus DB → status ฝั่ง frontend
const statusMap: Record<ApplicationStatus, string> = {
  PENDING: "submitted",
  INTERVIEW: "interview",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

// ✨ ดึงใบสมัครทั้งหมดของ Employee พร้อมข้อมูลงานและโรงเรียน
export const getEmployeeApplicationsService = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) throw new Error("PROFILE_NOT_FOUND");

  const applications = await prisma.application.findMany({
    where: { applicantId: profile.id },
    orderBy: { appliedAt: "desc" },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          jobType: true,
          province: true,
          salaryMin: true,
          salaryMax: true,
          salaryNegotiable: true,
          deadline: true,
          schoolProfile: {
            select: {
              schoolName: true,
              schoolType: true,
              logoUrl: true,
            },
          },
        },
      },
    },
  });

  return applications.map((app) => ({
    id: app.id,
    jobId: app.jobId,
    jobTitle: app.job.title,
    jobType: app.job.jobType ?? null,
    province: app.job.province,
    salaryMin: app.job.salaryMin ?? null,
    salaryMax: app.job.salaryMax ?? null,
    salaryNegotiable: app.job.salaryNegotiable,
    deadline: app.job.deadline ? app.job.deadline.toISOString() : null,
    schoolName: app.job.schoolProfile.schoolName,
    schoolType: app.job.schoolProfile.schoolType ?? null,
    schoolLogoUrl: app.job.schoolProfile.logoUrl ?? null,
    coverLetter: app.coverLetter ?? null,
    appliedAt: app.appliedAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    status: statusMap[app.status],
  }));
};
