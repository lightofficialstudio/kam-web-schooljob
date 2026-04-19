import { searchSchoolsService } from "../service/school-service";
import { schoolSearchQuerySchema } from "../validation/school-search-schema";

// ✨ GET /api/v1/employee/schools/read — ดึงรายชื่อโรงเรียนที่มีงานเปิดรับสมัคร
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const rawQuery = {
      keyword: searchParams.get("keyword") ?? undefined,
      province: searchParams.get("province") ?? undefined,
      school_type: searchParams.get("school_type") ?? undefined,
      sort_by: searchParams.get("sort_by") ?? undefined,
    };

    const parsed = schoolSearchQuerySchema.safeParse(rawQuery);
    if (!parsed.success) {
      return Response.json(
        {
          status_code: 400,
          message_th: "ข้อมูลไม่ถูกต้อง",
          message_en: "Invalid query params",
          data: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const schools = await searchSchoolsService(parsed.data);

    return Response.json({
      status_code: 200,
      message_th: "ดึงข้อมูลโรงเรียนสำเร็จ",
      message_en: "Schools fetched successfully",
      data: schools,
    });
  } catch (error) {
    console.error("❌ [GET /api/v1/employee/schools/read]", error);
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
