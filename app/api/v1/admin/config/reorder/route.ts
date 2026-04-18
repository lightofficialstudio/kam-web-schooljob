import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { z } from "zod";

// ✨ Batch reorder schema — validate array ของ { id, sort_order }
const reorderSchema = z.object({
  items: z
    .array(z.object({ id: z.string(), sort_order: z.number().int().min(0) }))
    .min(1),
});

// ✨ PATCH /api/v1/admin/config/reorder — อัปเดต sortOrder หลาย items พร้อมกัน
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = reorderSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          status_code: 400,
          message_th: "ข้อมูลไม่ถูกต้อง",
          message_en: "Invalid input",
          data: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    // ✨ ใช้ transaction batch update เพื่อ atomic
    const { items } = parsed.data;
    await prisma.$transaction(
      items.map(({ id, sort_order }) =>
        prisma.configOption.update({
          where: { id },
          data: { sortOrder: sort_order },
        }),
      ),
    );

    return Response.json({
      status_code: 200,
      message_th: `บันทึกลำดับ ${items.length} รายการสำเร็จ`,
      message_en: `Reordered ${items.length} items`,
      data: null,
    });
  } catch (error) {
    console.error("❌ [PATCH /api/v1/admin/config/reorder]", error);
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
