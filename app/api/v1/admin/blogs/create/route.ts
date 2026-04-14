import { NextRequest } from "next/server";
import { adminBlogService } from "../service/blog-service";
import { createBlogSchema } from "../validation/blog-schema";

// ✨ POST /api/v1/admin/blogs/create — สร้างบทความใหม่ (ADMIN เท่านั้น)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createBlogSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid input", data: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const blog = await adminBlogService.createBlog(parsed.data);
    return Response.json(
      { status_code: 201, message_th: "สร้างบทความสำเร็จ", message_en: "Blog created", data: blog },
      { status: 201 },
    );
  } catch (error: any) {
    if (error.message === "slug นี้ถูกใช้แล้ว") {
      return Response.json({ status_code: 409, message_th: error.message, message_en: "Slug already exists", data: null }, { status: 409 });
    }
    console.error("❌ [POST /api/v1/admin/blogs/create]", error);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
