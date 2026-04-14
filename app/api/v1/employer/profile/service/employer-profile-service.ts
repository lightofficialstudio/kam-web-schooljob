import { prisma } from "@/lib/prisma";
import { UpdateEmployerProfileInput } from "../validation/employer-profile-schema";

// ✨ ดึงข้อมูล SchoolProfile ครบทุก relation โดยใช้ userId จาก Supabase Auth
// ถ้ายังไม่มี SchoolProfile จะ auto-create ให้
export const getEmployerProfileService = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      schoolProfile: {
        include: { schoolBenefits: true },
      },
    },
  });
  return profile;
};

// ✨ Auto-create Profile + SchoolProfile ถ้ายังไม่มีใน DB
export const ensureEmployerProfileService = async (
  userId: string,
  email: string,
) => {
  return await prisma.profile.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      email,
      role: "EMPLOYER",
      schoolProfile: {
        create: {
          schoolName: "",
          province: "",
        },
      },
    },
    include: {
      schoolProfile: {
        include: { schoolBenefits: true },
      },
    },
  });
};

// ✨ อัปเดต SchoolProfile + schoolBenefits ใน Transaction เดียว
export const updateEmployerProfileService = async (
  userId: string,
  payload: UpdateEmployerProfileInput,
) => {
  return await prisma.$transaction(async (tx) => {
    // ค้นหา Profile เพื่อเอา profileId
    const profile = await tx.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error("Profile not found");

    // Upsert SchoolProfile
    const schoolProfile = await tx.schoolProfile.upsert({
      where: { profileId: profile.id },
      update: {
        schoolName: payload.school_name,
        schoolType: payload.school_type ?? null,
        province: payload.province,
        district: payload.district ?? null,
        address: payload.address ?? null,
        website: payload.website ?? null,
        phone: payload.phone ?? null,
        description: payload.description ?? null,
        vision: payload.vision ?? null,
        foundedYear: payload.founded_year ?? null,
        teacherCount: payload.teacher_count ?? null,
        studentCount: payload.student_count ?? null,
        affiliation: payload.affiliation ?? null,
        curriculum: payload.curriculum ?? null,
        levels: payload.levels ? JSON.stringify(payload.levels) : null,
        ...(payload.logo_url !== undefined && {
          logoUrl: payload.logo_url ?? null,
        }),
        ...(payload.cover_image_url !== undefined && {
          coverImageUrl: payload.cover_image_url ?? null,
        }),
      },
      create: {
        profileId: profile.id,
        schoolName: payload.school_name,
        schoolType: payload.school_type ?? null,
        province: payload.province,
        district: payload.district ?? null,
        address: payload.address ?? null,
        website: payload.website ?? null,
        phone: payload.phone ?? null,
        description: payload.description ?? null,
        vision: payload.vision ?? null,
        foundedYear: payload.founded_year ?? null,
        teacherCount: payload.teacher_count ?? null,
        studentCount: payload.student_count ?? null,
        affiliation: payload.affiliation ?? null,
        curriculum: payload.curriculum ?? null,
        levels: payload.levels ? JSON.stringify(payload.levels) : null,
        logoUrl: payload.logo_url ?? null,
        coverImageUrl: payload.cover_image_url ?? null,
      },
      include: { schoolBenefits: true },
    });

    // อัปเดต schoolBenefits — ลบทั้งหมดแล้วสร้างใหม่ (replace strategy)
    if (payload.benefits !== undefined) {
      await tx.schoolBenefit.deleteMany({
        where: { schoolProfileId: schoolProfile.id },
      });
      if (payload.benefits.length > 0) {
        await tx.schoolBenefit.createMany({
          data: payload.benefits.map((benefit) => ({
            schoolProfileId: schoolProfile.id,
            benefit,
          })),
        });
      }
    }

    // Return ข้อมูลล่าสุด รวม benefit ที่อัปเดตแล้ว
    return await tx.schoolProfile.findUnique({
      where: { id: schoolProfile.id },
      include: { schoolBenefits: true },
    });
  });
};
