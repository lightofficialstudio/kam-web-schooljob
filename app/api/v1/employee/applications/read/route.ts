import { getEmployeeApplicationsService } from "../service/application-service";
import { getApplicationsQuerySchema } from "../validation/application-schema";

// ✨ GET /api/v1/employee/applications/read?user_id=xxx — ดึงใบสมัครของ Employee
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = { user_id: searchParams.get("user_id") ?? "" };

    const parsed = getApplicationsQuerySchema.safeParse(query);
    if (!parsed.success) {
      return Response.json(
        {
          status_code: 400,
          message_th: "กรุณาระบุ user_id",
          message_en: "user_id is required",
          data: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const applications = await getEmployeeApplicationsService(parsed.data.user_id);

    return Response.json({
      status_code: 200,
      message_th: "ดึงข้อมูลใบสมัครสำเร็จ",
      message_en: "Applications fetched successfully",
      data: applications,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message === "PROFILE_NOT_FOUND") {
      return Response.json(
        {
          status_code: 404,
          message_th: "ไม่พบข้อมูลผู้ใช้",
          message_en: "Profile not found",
          data: null,
        },
        { status: 404 },
      );
    }

    console.error("❌ [GET /api/v1/employee/applications/read]", error);
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
