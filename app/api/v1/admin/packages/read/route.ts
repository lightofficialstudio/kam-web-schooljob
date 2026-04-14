import { NextRequest } from "next/server";
import { adminPackageService } from "../service/package-service";
import { listSchoolsByPlanSchema } from "../validation/package-schema";

// ✨ GET /api/v1/admin/packages/read — ดึงรายการโรงเรียน+plan และ summary (ADMIN)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // ✨ ?summary=true → คืนแค่สถิติภาพรวม
    if (searchParams.get("summary") === "true") {
      const summary = await adminPackageService.getSummary();
      return Response.json({ status_code: 200, message_th: "ดึงสถิติ package สำเร็จ", message_en: "Package summary fetched", data: summary });
    }

    const parsed = listSchoolsByPlanSchema.safeParse({
      plan: searchParams.get("plan") ?? undefined,
      keyword: searchParams.get("keyword") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      page_size: searchParams.get("page_size") ?? undefined,
    });

    if (!parsed.success) {
      return Response.json({ status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid params", data: null }, { status: 400 });
    }

    const data = await adminPackageService.listSchools(parsed.data);
    return Response.json({ status_code: 200, message_th: "ดึงรายการโรงเรียนสำเร็จ", message_en: "Schools fetched", data });
  } catch (error) {
    console.error("❌ [GET /api/v1/admin/packages/read]", error);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
