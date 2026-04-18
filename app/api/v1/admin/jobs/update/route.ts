import { adminUpdateJobContentService } from "../service/admin-job-service";

// ✨ PATCH /api/v1/admin/jobs/update?admin_user_id=xxx&job_id=xxx — Admin แก้ไขเนื้อหา job
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUserId = searchParams.get("admin_user_id");
    const jobId       = searchParams.get("job_id");

    if (!adminUserId || !jobId) {
      return Response.json({ status_code: 400, message_th: "กรุณาระบุ admin_user_id และ job_id", message_en: "admin_user_id and job_id are required", data: null }, { status: 400 });
    }

    const body = await request.json();
    const result = await adminUpdateJobContentService(adminUserId, jobId, body);

    return Response.json({ status_code: 200, message_th: "แก้ไขประกาศงานสำเร็จ", message_en: "Job updated successfully", data: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "UNAUTHORIZED") return Response.json({ status_code: 403, message_th: "ไม่มีสิทธิ์เข้าถึง", message_en: "Forbidden", data: null }, { status: 403 });
    if (msg === "JOB_NOT_FOUND") return Response.json({ status_code: 404, message_th: "ไม่พบประกาศงาน", message_en: "Job not found", data: null }, { status: 404 });
    console.error("❌ [admin/jobs/update]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
