import { prisma } from "@/lib/prisma";

// ✨ GET /api/v1/admin/schools/read — ดึงรายการโรงเรียนทั้งหมดสำหรับ Admin dropdown
// ไม่ต้องตรวจสอบ auth เพราะ route นี้อยู่ภายใต้ Admin layout guard อยู่แล้ว
export async function GET() {
  try {
    // ✨ ดึงโรงเรียนทั้งหมด เรียงตามชื่อโรงเรียน
    const schools = await prisma.schoolProfile.findMany({
      select: {
        id: true,
        schoolName: true,
        province: true,
        logoUrl: true,
      },
      orderBy: { schoolName: "asc" },
    });

    return Response.json({
      status_code: 200,
      message_th: "ดึงรายการโรงเรียนสำเร็จ",
      message_en: "Schools fetched successfully",
      data: schools,
    });
  } catch (err) {
    console.error("❌ [admin/schools/read]", err);
    return Response.json(
      {
        status_code: 500,
        message_th: "เกิดข้อผิดพลาดภายในระบบ",
        message_en: "Internal server error",
        data: null,
      },
      { status: 500 },
    );
  }
}
