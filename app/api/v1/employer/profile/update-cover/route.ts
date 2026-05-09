import { prisma } from "@/lib/prisma";

// ✨ PATCH /api/v1/employer/profile/update-cover?user_id=xxx
// อัปเดตเฉพาะ coverImageUrl ของ SchoolProfile — ไม่แตะข้อมูลอื่น
export async function PATCH(request: Request) {
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
    const coverImageUrl = body?.cover_image_url;

    if (typeof coverImageUrl !== "string" || !coverImageUrl.startsWith("http")) {
      return Response.json(
        { status_code: 400, message_th: "cover_image_url ไม่ถูกต้อง", message_en: "Invalid cover_image_url", data: null },
        { status: 400 },
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      return Response.json(
        { status_code: 404, message_th: "ไม่พบผู้ใช้", message_en: "Profile not found", data: null },
        { status: 404 },
      );
    }

    // ✨ upsert SchoolProfile — กรณีที่ยังไม่ได้สร้างก็ create ให้อัตโนมัติ
    await prisma.schoolProfile.upsert({
      where: { profileId: profile.id },
      update: { coverImageUrl },
      create: { profileId: profile.id, schoolName: "", province: "", coverImageUrl },
    });

    return Response.json({
      status_code: 200,
      message_th: "อัปเดตภาพพื้นหลังสำเร็จ",
      message_en: "Cover image updated successfully",
      data: { cover_image_url: coverImageUrl },
    });
  } catch (err) {
    console.error("❌ [employer/profile/update-cover]", err);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 },
    );
  }
}
