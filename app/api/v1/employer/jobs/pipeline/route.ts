import { getPipelineService } from "../service/job-service";

// ✨ GET /api/v1/employer/jobs/pipeline?user_id=xxx — สรุป Pipeline การรับสมัครทั้งหมด
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

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

    const pipeline = await getPipelineService(userId);

    return Response.json({
      status_code: 200,
      message_th: "ดึงข้อมูล Pipeline สำเร็จ",
      message_en: "Pipeline fetched successfully",
      data: pipeline,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

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

    console.error("❌ [pipeline/route] เกิดข้อผิดพลาด:", error);
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
