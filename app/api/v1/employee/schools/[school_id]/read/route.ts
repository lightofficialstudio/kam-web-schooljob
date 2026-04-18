import { schoolProfileParamSchema } from "../validation/school-profile-schema";
import { getSchoolProfileService } from "../service/school-profile-service";

// ✨ GET /api/v1/employee/schools/[school_id]/read — ดึง School Profile ครบถ้วนพร้อมงาน OPEN
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ school_id: string }> },
) {
  try {
    const resolvedParams = await params;

    const parsed = schoolProfileParamSchema.safeParse(resolvedParams);
    if (!parsed.success) {
      return Response.json(
        {
          status_code: 400,
          message_th: "school_id ไม่ถูกต้อง",
          message_en: "Invalid school_id",
          data: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const school = await getSchoolProfileService(parsed.data.school_id);

    if (!school) {
      return Response.json(
        {
          status_code: 404,
          message_th: "ไม่พบข้อมูลโรงเรียน",
          message_en: "School not found",
          data: null,
        },
        { status: 404 },
      );
    }

    return Response.json({
      status_code: 200,
      message_th: "ดึงข้อมูลโรงเรียนสำเร็จ",
      message_en: "School profile fetched successfully",
      data: school,
    });
  } catch (error) {
    console.error("❌ [GET /api/v1/employee/schools/[school_id]/read]", error);
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
