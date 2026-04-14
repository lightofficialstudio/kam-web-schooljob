import { prisma } from "@/lib/prisma";

// ✨ GET /api/v1/config/options?group=school_type
// ดึงตัวเลือก dropdown ตาม group (Public — ใช้ใน form ฝั่ง Employer/Employee)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get("group");

    if (!group) {
      return Response.json(
        { status_code: 400, message_th: "กรุณาระบุ group", message_en: "group is required", data: null },
        { status: 400 },
      );
    }

    const options = await prisma.configOption.findMany({
      where: { group, isActive: true },
      select: { id: true, label: true, value: true, sortOrder: true },
      orderBy: { sortOrder: "asc" },
    });

    return Response.json({
      status_code: 200,
      message_th: "ดึงข้อมูลสำเร็จ",
      message_en: "Fetched successfully",
      data: options,
    });
  } catch (error) {
    console.error("❌ [GET /api/v1/config/options]", error);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 },
    );
  }
}
