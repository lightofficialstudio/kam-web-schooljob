import { createEducationSchema } from "./validation/education-schema";
import { createEducationService } from "./service/education-service";

// ✨ POST /api/v1/employee/educations?user_id=xxx — เพิ่มประวัติการศึกษาใหม่
export async function POST(request: Request) {
  try {
    // 📝 ดึง user_id จาก query string
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id") ?? "";

    if (!userId) {
      return Response.json(
        {
          status_code: 400,
          message_th: "กรุณาระบุ user_id",
          message_en: "user_id is required",
          data: null,
        },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));

    // 📝 Validate request body
    const parsed = createEducationSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          status_code: 400,
          message_th: "ข้อมูลไม่ถูกต้อง",
          message_en: "Invalid input",
          data: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await createEducationService(userId, parsed.data);

    return Response.json(
      {
        status_code: 201,
        message_th: "เพิ่มประวัติการศึกษาสำเร็จ",
        message_en: "Education created",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    // ❌ จัดการกรณี profile ไม่พบ
    if (error instanceof Error && error.message === "PROFILE_NOT_FOUND") {
      return Response.json(
        {
          status_code: 404,
          message_th: "ไม่พบข้อมูลโปรไฟล์",
          message_en: "Profile not found",
          data: null,
        },
        { status: 404 }
      );
    }

    console.error("❌ [POST /api/v1/employee/educations]:", error);
    return Response.json(
      {
        status_code: 500,
        message_th: "เกิดข้อผิดพลาดภายในระบบ",
        message_en: "Internal server error",
        data: null,
      },
      { status: 500 }
    );
  }
}
