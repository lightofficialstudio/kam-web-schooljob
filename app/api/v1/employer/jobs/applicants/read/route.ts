import {
  getApplicantsByJobService,
  getNewApplicantsService,
} from "../../service/job-service";

// ✨ GET /api/v1/employer/jobs/applicants/read?user_id=xxx&job_id=xxx — ผู้สมัครของตำแหน่งงาน
// ✨ GET /api/v1/employer/jobs/applicants/read?user_id=xxx&mode=new  — ผู้สมัครใหม่ทุกตำแหน่ง
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    const jobId = searchParams.get("job_id");
    const mode = searchParams.get("mode");

    if (!userId) {
      return Response.json(
        {
          status_code: 400,
          message_th: "กรุณาระบุ user_id",
          message_en: "user_id is required",
          data: null,
        },
        { status: 400 },
      );
    }

    // โหมดผู้สมัครใหม่ทุกตำแหน่ง
    if (mode === "new") {
      const applicants = await getNewApplicantsService(userId);
      return Response.json({
        status_code: 200,
        message_th: "ดึงผู้สมัครใหม่สำเร็จ",
        message_en: "New applicants fetched successfully",
        data: applicants,
      });
    }

    if (!jobId) {
      return Response.json(
        {
          status_code: 400,
          message_th: "กรุณาระบุ job_id",
          message_en: "job_id is required",
          data: null,
        },
        { status: 400 },
      );
    }

    const applicants = await getApplicantsByJobService(userId, jobId);
    return Response.json({
      status_code: 200,
      message_th: "ดึงรายชื่อผู้สมัครสำเร็จ",
      message_en: "Applicants fetched successfully",
      data: applicants,
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

    console.error("❌ [applicants/read]", error);
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
