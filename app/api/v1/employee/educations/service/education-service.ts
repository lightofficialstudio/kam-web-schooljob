import { prisma } from "@/lib/prisma";
import { CreateEducationInput, UpdateEducationInput } from "../validation/education-schema";

// ✨ สร้างประวัติการศึกษาใหม่สำหรับ Employee
export const createEducationService = async (
  userId: string,
  payload: CreateEducationInput
) => {
  // 📝 ดึง profileId จาก userId
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) throw new Error("PROFILE_NOT_FOUND");

  return await prisma.education.create({
    data: {
      profileId: profile.id,
      level: payload.level,
      institution: payload.institution,
      major: payload.major,
      graduationYear: payload.graduation_year ?? null,
      gpa: payload.gpa ?? null,
      startDate: payload.start_date ? new Date(payload.start_date) : null,
      endDate: payload.end_date ? new Date(payload.end_date) : null,
    },
  });
};

// ✨ อัปเดตประวัติการศึกษาโดยใช้ id ของ record
export const updateEducationService = async (
  id: string,
  payload: UpdateEducationInput
) => {
  return await prisma.education.update({
    where: { id },
    data: {
      ...(payload.level !== undefined && { level: payload.level }),
      ...(payload.institution !== undefined && { institution: payload.institution }),
      ...(payload.major !== undefined && { major: payload.major }),
      ...(payload.graduation_year !== undefined && { graduationYear: payload.graduation_year ?? null }),
      ...(payload.gpa !== undefined && { gpa: payload.gpa ?? null }),
      ...(payload.start_date !== undefined && { startDate: payload.start_date ? new Date(payload.start_date) : null }),
      ...(payload.end_date !== undefined && { endDate: payload.end_date ? new Date(payload.end_date) : null }),
      updatedAt: new Date(),
    },
  });
};

// ✨ ลบประวัติการศึกษา (soft-delete: ตั้ง isDeleted = true)
export const deleteEducationService = async (id: string) => {
  return await prisma.education.update({
    where: { id },
    data: { isDeleted: true },
  });
};
