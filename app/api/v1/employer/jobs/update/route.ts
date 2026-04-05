import { updateJobService } from "../service/job-service";
import { updateJobSchema } from "../validation/job-schema";

// ✨ PATCH /api/v1/jobs/update?user_id=xxx&job_id=xxx — อัปเดตประกาศงาน
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

    const body = await request.json();
    const parsed = updateJobSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          status_code: 400,
          message_th: "ข้อมูลไม่ถูกต้อง",
          message_en: "Invalid request body",
          data: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const job = await updateJobService(userId, jobId, parsed.data);

    return Response.json({
      status_code: 200,
      message_th: "อัปเดตประกาศงานสำเร็จ",
      message_en: "Job updated successfully",
      data: job,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
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
    if (message === "JOB_NOT_FOUND") {
      return Response.json(
        {
          status_code: 404,
          message_th: "ไม่พบประกาศงาน หรือไม่มีสิทธิ์แก้ไข",
          message_en: "Job not found or unauthorized",
          data: null,
        },
        { status: 404 },
      );
    }
    console.error("❌ [jobs/update]", err);
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
