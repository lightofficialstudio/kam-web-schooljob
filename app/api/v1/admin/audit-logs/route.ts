import { adminGetAuditLogsService } from "../jobs/service/admin-job-service";

// ✨ GET /api/v1/admin/audit-logs — ดึง Audit Logs ทั้งหมด
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUserId = searchParams.get("admin_user_id") ?? undefined;
    const targetType  = searchParams.get("target_type") ?? undefined;
    const targetId    = searchParams.get("target_id") ?? undefined;
    const action      = searchParams.get("action") ?? undefined;
    const page        = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const pageSize    = Math.min(50, Math.max(1, parseInt(searchParams.get("page_size") ?? "20")));

    const data = await adminGetAuditLogsService({ adminUserId, targetType, targetId, action, page, pageSize });
    return Response.json({ status_code: 200, message_th: "ดึงข้อมูลสำเร็จ", message_en: "Success", data });
  } catch (err) {
    console.error("❌ [admin/audit-logs]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
