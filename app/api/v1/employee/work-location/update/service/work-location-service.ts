import { prisma } from "@/lib/prisma";
import { UpdateWorkLocationInput } from "../validation/work-location-schema";

// ✨ อัปเดต Work Location — preferred_provinces + can_relocate
// ใช้ replace strategy สำหรับ preferred_provinces (ลบเก่า สร้างใหม่ใน transaction)
export const updateWorkLocationService = async (
  userId: string,
  payload: UpdateWorkLocationInput,
) => {
  const { preferred_provinces, can_relocate } = payload;

  return await prisma.$transaction(async (tx) => {
    // 📝 ดึง profile id จาก userId
    const profile = await tx.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new Error("PROFILE_NOT_FOUND");
    }

    const profileId = profile.id;

    // ✨ อัปเดต can_relocate บน Profile
    await tx.profile.update({
      where: { userId },
      data: { canRelocate: can_relocate },
    });

    // ✨ Sync preferred_provinces — ลบของเดิมทั้งหมดแล้วสร้างใหม่
    await tx.preferredProvince.deleteMany({ where: { profileId } });
    if (preferred_provinces.length > 0) {
      await tx.preferredProvince.createMany({
        data: preferred_provinces.map((province) => ({ profileId, province })),
      });
    }

    return { preferred_provinces, can_relocate };
  });
};
