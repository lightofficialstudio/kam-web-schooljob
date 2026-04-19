import { prisma } from "@/lib/prisma";
import { CreateWorkExperienceInput, UpdateWorkExperienceInput } from "../validation/work-experience-schema";

// ✨ สร้างประวัติการทำงานใหม่สำหรับ Employee
export const createWorkExperienceService = async (
  userId: string,
  payload: CreateWorkExperienceInput
) => {
  // 📝 ดึง profileId จาก userId
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) throw new Error("PROFILE_NOT_FOUND");

  return await prisma.workExperience.create({
    data: {
      profileId: profile.id,
      jobTitle: payload.job_title,
      companyName: payload.company_name,
      startDate: new Date(payload.start_date),
      endDate: payload.end_date ? new Date(payload.end_date) : null,
      inPresent: payload.in_present ?? false,
      description: payload.description ?? null,
      workYear: payload.work_year ?? null,
    },
  });
};

// ✨ อัปเดตประวัติการทำงานโดยใช้ id ของ record
export const updateWorkExperienceService = async (
  id: string,
  payload: UpdateWorkExperienceInput
) => {
  return await prisma.workExperience.update({
    where: { id },
    data: {
      ...(payload.job_title !== undefined && { jobTitle: payload.job_title }),
      ...(payload.company_name !== undefined && { companyName: payload.company_name }),
      ...(payload.start_date !== undefined && { startDate: new Date(payload.start_date) }),
      ...(payload.end_date !== undefined && { endDate: payload.end_date ? new Date(payload.end_date) : null }),
      ...(payload.in_present !== undefined && { inPresent: payload.in_present }),
      ...(payload.description !== undefined && { description: payload.description ?? null }),
      ...(payload.work_year !== undefined && { workYear: payload.work_year ?? null }),
      updatedAt: new Date(),
    },
  });
};

// ✨ ลบประวัติการทำงาน (soft-delete: ตั้ง isDeleted = true)
export const deleteWorkExperienceService = async (id: string) => {
  return await prisma.workExperience.update({
    where: { id },
    data: { isDeleted: true },
  });
};
