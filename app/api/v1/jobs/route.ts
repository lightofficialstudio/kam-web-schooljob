import { searchJobsService } from "./service/job-search-service";
import { jobSearchQuerySchema } from "./validation/job-search-schema";

// ✨ GET /api/v1/jobs — ค้นหางานสำหรับ Employee (Public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const rawQuery = {
      keyword: searchParams.get("keyword") ?? undefined,
      province: searchParams.get("province") ?? undefined,
      school_type: searchParams.get("school_type") ?? undefined,
      license: searchParams.get("license") ?? undefined,
      salary_min: searchParams.get("salary_min") ?? undefined,
      salary_max: searchParams.get("salary_max") ?? undefined,
      grade_level: searchParams.get("grade_level") ?? undefined,
      job_type: searchParams.get("job_type") ?? undefined,
      posted_at: searchParams.get("posted_at") ?? undefined,
      cursor: searchParams.get("cursor") ?? undefined,
      page_size: searchParams.get("page_size") ?? undefined,
    };

    const parsed = jobSearchQuerySchema.safeParse(rawQuery);
    if (!parsed.success) {
      return Response.json(
        {
          status_code: 400,
          message_th: "ข้อมูลค้นหาไม่ถูกต้อง",
          message_en: "Invalid search params",
          data: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await searchJobsService(parsed.data);

    return Response.json({
      status_code: 200,
      message_th: "ดึงรายการงานสำเร็จ",
      message_en: "Jobs fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ [GET /api/v1/jobs]", error);
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
