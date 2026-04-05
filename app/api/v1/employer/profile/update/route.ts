import { updateEmployerProfileService } from "../service/employer-profile-service";
import { updateEmployerProfileSchema } from "../validation/employer-profile-schema";

// ✨ PATCH /api/v1/employer-profile/update?user_id=xxx — อัปเดต SchoolProfile และ benefits
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
        { status: 400 },
      );
    }

    const body = await request.json();

    const parsed = updateEmployerProfileSchema.safeParse(body);
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

    const result = await updateEmployerProfileService(userId, parsed.data);

    return Response.json({
      status_code: 200,
      message_th: "อัปเดตข้อมูลสำเร็จ",
      message_en: "Updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("❌ [employer-profile/update] Error:", err);
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
