import { NextRequest } from "next/server";
import { adminBlogService } from "../service/blog-service";
import { listBlogQuerySchema } from "../validation/blog-schema";

// ✨ GET /api/v1/admin/blogs/read — ดึงรายการบทความทั้งหมด รวม DRAFT (ADMIN เท่านั้น)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = listBlogQuerySchema.safeParse({
      keyword: searchParams.get("keyword") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      page_size: searchParams.get("page_size") ?? undefined,
    });

    if (!parsed.success) {
      return Response.json({ status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid params", data: null }, { status: 400 });
    }

    // ✨ ดึง single blog ถ้ามี id
    const id = searchParams.get("id");
    if (id) {
      const blog = await adminBlogService.getBlogById(id);
      return Response.json({ status_code: 200, message_th: "ดึงบทความสำเร็จ", message_en: "Blog fetched", data: blog });
    }

    const data = await adminBlogService.listBlogs(parsed.data);
    return Response.json({ status_code: 200, message_th: "ดึงรายการบทความสำเร็จ", message_en: "Blogs fetched", data });
  } catch (error: any) {
    if (error.message === "ไม่พบบทความ") {
      return Response.json({ status_code: 404, message_th: error.message, message_en: "Blog not found", data: null }, { status: 404 });
    }
    console.error("❌ [GET /api/v1/admin/blogs/read]", error);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
