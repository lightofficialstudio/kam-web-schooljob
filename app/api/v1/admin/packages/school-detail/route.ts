import { NextRequest } from "next/server";
import { adminPackageService } from "../service/package-service";

// ✨ GET /api/v1/admin/packages/school-detail?school_id=xxx
export async function GET(req: NextRequest) {
  try {
    const schoolId = new URL(req.url).searchParams.get("school_id");
    if (!schoolId) {
      return Response.json({ status_code: 400, message_th: "กรุณาระบุ school_id", message_en: "school_id required", data: null }, { status: 400 });
    }
    const data = await adminPackageService.getSchoolDetail(schoolId);
    return Response.json({ status_code: 200, message_th: "ดึงข้อมูลสำเร็จ", message_en: "Success", data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "SCHOOL_NOT_FOUND") return Response.json({ status_code: 404, message_th: "ไม่พบโรงเรียน", message_en: "Not found", data: null }, { status: 404 });
    console.error("❌ [school-detail]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาด", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
