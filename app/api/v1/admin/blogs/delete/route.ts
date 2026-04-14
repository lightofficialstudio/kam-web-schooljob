import { NextRequest } from "next/server";
import { adminBlogService } from "../service/blog-service";

// ✨ DELETE /api/v1/admin/blogs/delete?id=xxx — ลบบทความ (ADMIN เท่านั้น)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return Response.json({ status_code: 400, message_th: "กรุณาระบุ id บทความ", message_en: "Blog id is required", data: null }, { status: 400 });
    }

    await adminBlogService.deleteBlog(id);
    return Response.json({ status_code: 200, message_th: "ลบบทความสำเร็จ", message_en: "Blog deleted", data: null });
  } catch (error: any) {
    console.error("❌ [DELETE /api/v1/admin/blogs/delete]", error);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
