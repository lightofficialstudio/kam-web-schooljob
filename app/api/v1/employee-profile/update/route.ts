import { updateEmployeeProfileSchema } from "../validation/employee-profile-schema";
import { updateEmployeeProfileService } from "../service/employee-profile-service";

// ✨ PATCH /api/v1/employee-profile/update?user_id=xxx — อัปเดต Employee Profile และ relations
export async function PATCH(request: Request) {
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
        { status: 400 }
      );
    }

    const body = await request.json();

    // 📝 Validate request body ด้วย Zod Schema
    const parsed = updateEmployeeProfileSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          status_code: 400,
          message_th: "ข้อมูลไม่ถูกต้อง",
          message_en: "Invalid request body",
          data: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await updateEmployeeProfileService(userId, parsed.data);

    return Response.json(
      {
        status_code: 200,
        message_th: "อัปเดตโปรไฟล์สำเร็จ",
        message_en: "Profile updated successfully",
        data: result,
      },
      { status: 200 }
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

    console.error("❌ [employee-profile/update]:", error);
    return Response.json(
      {
        status_code: 500,
        message_th: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        message_en: "Internal server error",
        data: null,
      },
      { status: 500 }
    );
  }
}
