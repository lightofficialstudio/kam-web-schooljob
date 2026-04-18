import { adminGetAllJobsService } from "../service/admin-job-service";

// ✨ GET /api/v1/admin/jobs/read — ดึงประกาศงานทั้งระบบ (Admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUserId    = searchParams.get("admin_user_id");
    const keyword        = searchParams.get("keyword") ?? undefined;
    const status         = searchParams.get("status") ?? undefined;
    const province       = searchParams.get("province") ?? undefined;
    const schoolProfileId = searchParams.get("school_profile_id") ?? undefined;
    const page           = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const pageSize       = Math.min(50, Math.max(1, parseInt(searchParams.get("page_size") ?? "20")));

    if (!adminUserId) {
      return Response.json({ status_code: 400, message_th: "กรุณาระบุ admin_user_id", message_en: "admin_user_id is required", data: null }, { status: 400 });
    }

    const data = await adminGetAllJobsService({ adminUserId, keyword, status, province, schoolProfileId, page, pageSize });
    return Response.json({ status_code: 200, message_th: "ดึงข้อมูลสำเร็จ", message_en: "Success", data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown";
    if (msg === "UNAUTHORIZED") return Response.json({ status_code: 403, message_th: "ไม่มีสิทธิ์เข้าถึง", message_en: "Forbidden", data: null }, { status: 403 });
    console.error("❌ [admin/jobs/read]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
