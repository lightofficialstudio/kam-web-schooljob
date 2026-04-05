import { closeJobService } from "../service/job-service";

// ✨ PATCH /api/v1/employer/jobs/close?user_id=xxx&job_id=xxx — ปิดรับสมัครประกาศงาน
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    const jobId = searchParams.get("job_id");

    if (!userId || !jobId) {
      return Response.json(
        {
          status_code: 400,
          message_th: "กรุณาระบุ user_id และ job_id",
          message_en: "user_id and job_id are required",
          data: null,
        },
        { status: 400 },
      );
    }

    const job = await closeJobService(userId, jobId);

    return Response.json({
      status_code: 200,
      message_th: "ปิดรับสมัครประกาศงานสำเร็จ",
      message_en: "Job closed successfully",
      data: job,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message === "JOB_NOT_FOUND") {
      return Response.json(
        {
          status_code: 404,
          message_th: "ไม่พบประกาศงานนี้",
          message_en: "Job not found",
          data: null,
        },
        { status: 404 },
      );
    }

    if (message === "SCHOOL_PROFILE_NOT_FOUND") {
      return Response.json(
        {
          status_code: 404,
          message_th: "ไม่พบโปรไฟล์โรงเรียน",
          message_en: "School profile not found",
          data: null,
        },
        { status: 404 },
      );
    }

    console.error("❌ [close/route] เกิดข้อผิดพลาด:", error);
    return Response.json(
      {
        status_code: 500,
        message_th: "เกิดข้อผิดพลาดภายในระบบ",
        message_en: "Internal server error",
        data: null,
      },
      { status: 500 },
    );
  }
}
