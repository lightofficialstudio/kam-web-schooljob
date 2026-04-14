import { NextRequest } from "next/server";
import { adminBlogService } from "../service/blog-service";
import { updateBlogSchema } from "../validation/blog-schema";

// ✨ PUT /api/v1/admin/blogs/update — แก้ไขบทความ (ADMIN เท่านั้น)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateBlogSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid input", data: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const blog = await adminBlogService.updateBlog(parsed.data);
    return Response.json({ status_code: 200, message_th: "แก้ไขบทความสำเร็จ", message_en: "Blog updated", data: blog });
  } catch (error: any) {
    if (error.message === "slug นี้ถูกใช้แล้ว") {
      return Response.json({ status_code: 409, message_th: error.message, message_en: "Slug already exists", data: null }, { status: 409 });
    }
    console.error("❌ [PUT /api/v1/admin/blogs/update]", error);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
