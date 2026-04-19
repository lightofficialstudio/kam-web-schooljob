import { prisma } from "@/lib/prisma";

// ✨ GET /api/v1/blogs/categories — ดึงหมวดหมู่ที่มีบทความ PUBLISHED อยู่จริง
export async function GET() {
  try {
    // ✨ ดึงค่า category ที่ไม่ซ้ำกันจากบทความที่ publish แล้ว
    const raw = await prisma.blog.findMany({
      where: { status: "PUBLISHED", category: { not: null } },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });

    const categories = raw
      .map((b) => b.category)
      .filter((c): c is string => !!c);

    return Response.json({
      status_code: 200,
      message_th: "ดึงหมวดหมู่สำเร็จ",
      message_en: "Categories fetched",
      data: categories,
    });
  } catch (error) {
    console.error("❌ [GET /api/v1/blogs/categories]", error);
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
