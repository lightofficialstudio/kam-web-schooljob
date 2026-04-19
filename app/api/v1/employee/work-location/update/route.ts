import { updateWorkLocationService } from "./service/work-location-service";
import { updateWorkLocationSchema } from "./validation/work-location-schema";

// ✨ PATCH /api/v1/employee/work-location/update?user_id=xxx — อัปเดตสถานที่ทำงานที่ต้องการ
export async function PATCH(request: Request) {
  try {
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
        { status: 400 },
      );
    }

    const body = await request.json().catch(() => ({}));

    // 📝 Validate ด้วย Zod
    const parsed = updateWorkLocationSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          status_code: 400,
          message_th: "ข้อมูลไม่ถูกต้อง กรุณาเลือกจังหวัดและระบุการย้ายที่อยู่",
          message_en: "Invalid request body",
          data: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await updateWorkLocationService(userId, parsed.data);

    return Response.json(
      {
        status_code: 200,
        message_th: "อัปเดตสถานที่ทำงานสำเร็จ",
        message_en: "Work location updated successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "PROFILE_NOT_FOUND") {
      return Response.json(
        {
          status_code: 404,
          message_th: "ไม่พบข้อมูลโปรไฟล์",
          message_en: "Profile not found",
          data: null,
        },
        { status: 404 },
      );
    }

    console.error("❌ [PATCH /work-location/update]", error);
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
