import { prisma } from "@/lib/prisma";
import { z } from "zod";

// ✨ Schema อัปเดตข้อมูลส่วนตัวผู้ดูแลโรงเรียน
const updatePersonalSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
});

// ✨ PUT /api/v1/employer/account-setting/update-personal?user_id=xxx
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return Response.json(
        { status_code: 400, message_th: "กรุณาระบุ user_id", message_en: "user_id is required", data: null },
        { status: 400 },
      );
    }

    const body = await request.json();
    const parsed = updatePersonalSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid input", data: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { first_name, last_name, phone_number } = parsed.data;

    // ✨ อัปเดต Profile ของผู้ดูแล (ไม่แตะ SchoolProfile)
    const updated = await prisma.profile.update({
      where: { userId },
      data: {
        ...(first_name !== undefined && { firstName: first_name }),
        ...(last_name !== undefined && { lastName: last_name }),
        ...(phone_number !== undefined && { phoneNumber: phone_number }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        email: true,
        profileImageUrl: true,
      },
    });

    return Response.json({
      status_code: 200,
      message_th: "อัปเดตข้อมูลส่วนตัวสำเร็จ",
      message_en: "Personal info updated",
      data: updated,
    });
  } catch (err) {
    console.error("❌ [account-setting/update-personal]:", err);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 },
    );
  }
}
