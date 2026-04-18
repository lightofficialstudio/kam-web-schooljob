import { adminDeleteJobService } from "../service/admin-job-service";

// ✨ DELETE /api/v1/admin/jobs/delete — ลบประกาศงาน (Admin hard delete)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUserId = searchParams.get("admin_user_id");
    const jobId       = searchParams.get("job_id");
    const note        = searchParams.get("note") ?? undefined;

    if (!adminUserId || !jobId) {
      return Response.json({ status_code: 400, message_th: "กรุณาระบุ admin_user_id และ job_id", message_en: "admin_user_id and job_id are required", data: null }, { status: 400 });
    }

    const data = await adminDeleteJobService(adminUserId, jobId, note);
    return Response.json({ status_code: 200, message_th: "ลบประกาศงานสำเร็จ", message_en: "Job deleted", data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown";
    if (msg === "UNAUTHORIZED") return Response.json({ status_code: 403, message_th: "ไม่มีสิทธิ์เข้าถึง", message_en: "Forbidden", data: null }, { status: 403 });
    if (msg === "JOB_NOT_FOUND") return Response.json({ status_code: 404, message_th: "ไม่พบประกาศงาน", message_en: "Job not found", data: null }, { status: 404 });
    console.error("❌ [admin/jobs/delete]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
