import { NextRequest } from "next/server";
import { z } from "zod";
import { adminBlogService } from "../service/blog-service";

// ✨ Bulk update schema — validate ids[] + status
const bulkUpdateSchema = z.object({
  ids: z.array(z.string()).min(1, "กรุณาระบุ id อย่างน้อย 1 รายการ"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

// ✨ PUT /api/v1/admin/blogs/bulk-update — เปลี่ยนสถานะหลายบทความพร้อมกัน
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bulkUpdateSchema.safeParse(body);
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

    const { ids, status } = parsed.data;
    await adminBlogService.bulkUpdateStatus(ids, status);

    return Response.json({
      status_code: 200,
      message_th: `อัปเดต ${ids.length} บทความสำเร็จ`,
      message_en: `${ids.length} blogs updated`,
      data: null,
    });
  } catch (error) {
    console.error("❌ [PUT /api/v1/admin/blogs/bulk-update]", error);
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
