import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";

// ✨ แปลง ApplicationStatus DB → status ฝั่ง frontend
const statusMap: Record<ApplicationStatus, string> = {
  PENDING: "submitted",
  INTERVIEW: "interview",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

// ✨ ดึงใบสมัครทั้งหมดของ Employee พร้อมข้อมูลงาน
export const getEmployeeApplicationsService = async (userId: string) => {
  // ค้นหา profile จาก userId
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
          schoolProfile: {
            select: { schoolName: true },
          },
        },
      },
    },
  });

  // ✨ แปลงโครงสร้างให้ตรงกับ JobApplication interface ฝั่ง frontend
  return applications.map((app) => ({
    id: app.id,
    jobId: app.jobId,
    jobTitle: app.job.title,
    schoolName: app.job.schoolProfile.schoolName,
    appliedAt: app.appliedAt.toISOString(),
    status: statusMap[app.status],
  }));
};
