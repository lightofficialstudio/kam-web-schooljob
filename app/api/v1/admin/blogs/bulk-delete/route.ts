import { NextRequest } from "next/server";
import { z } from "zod";
import { adminBlogService } from "../service/blog-service";

// ✨ Bulk delete schema — validate ids[]
const bulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1, "กรุณาระบุ id อย่างน้อย 1 รายการ"),
});

// ✨ DELETE /api/v1/admin/blogs/bulk-delete — ลบหลายบทความพร้อมกัน
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bulkDeleteSchema.safeParse(body);
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

    const { ids } = parsed.data;
    await adminBlogService.bulkDeleteBlogs(ids);

    return Response.json({
      status_code: 200,
      message_th: `ลบ ${ids.length} บทความสำเร็จ`,
      message_en: `${ids.length} blogs deleted`,
      data: null,
    });
  } catch (error) {
    console.error("❌ [DELETE /api/v1/admin/blogs/bulk-delete]", error);
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
