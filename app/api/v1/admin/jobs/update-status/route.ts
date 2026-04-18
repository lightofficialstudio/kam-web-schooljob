import { adminUpdateJobStatusService } from "../service/admin-job-service";
import { JobStatus } from "@prisma/client";

const VALID_STATUSES = Object.values(JobStatus);

// ✨ PATCH /api/v1/admin/jobs/update-status — เปลี่ยนสถานะประกาศงาน
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUserId = searchParams.get("admin_user_id");
    if (!adminUserId) {
      return Response.json({ status_code: 400, message_th: "กรุณาระบุ admin_user_id", message_en: "admin_user_id is required", data: null }, { status: 400 });
    }

    const body = await request.json();
    const { job_id, status, note } = body as { job_id?: string; status?: string; note?: string };

    if (!job_id || !status) {
      return Response.json({ status_code: 400, message_th: "กรุณาระบุ job_id และ status", message_en: "job_id and status are required", data: null }, { status: 400 });
    }
    if (!VALID_STATUSES.includes(status as JobStatus)) {
      return Response.json({ status_code: 400, message_th: "สถานะไม่ถูกต้อง ต้องเป็น OPEN, CLOSED หรือ DRAFT", message_en: "Invalid status", data: null }, { status: 400 });
    }

    const data = await adminUpdateJobStatusService(adminUserId, job_id, status as JobStatus, note);
    return Response.json({ status_code: 200, message_th: "อัปเดตสถานะสำเร็จ", message_en: "Status updated", data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown";
    if (msg === "UNAUTHORIZED") return Response.json({ status_code: 403, message_th: "ไม่มีสิทธิ์เข้าถึง", message_en: "Forbidden", data: null }, { status: 403 });
    if (msg === "JOB_NOT_FOUND") return Response.json({ status_code: 404, message_th: "ไม่พบประกาศงาน", message_en: "Job not found", data: null }, { status: 404 });
    console.error("❌ [admin/jobs/update-status]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
