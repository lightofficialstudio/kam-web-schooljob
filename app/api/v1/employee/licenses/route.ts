import { createLicenseSchema } from "./validation/license-schema";
import { createLicenseService } from "./service/license-service";

// ✨ POST /api/v1/employee/licenses?user_id=... — เพิ่มใบอนุญาต/ใบประกอบวิชาชีพใหม่
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id") ?? "";

    if (!userId) {
      return Response.json(
        { status_code: 400, message_th: "กรุณาระบุ user_id", message_en: "Missing user_id", data: null },
        { status: 400 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const parsed = createLicenseSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid request", data: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await createLicenseService(userId, parsed.data);

    return Response.json(
      { status_code: 201, message_th: "เพิ่มใบอนุญาตสำเร็จ", message_en: "License created", data: result },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "PROFILE_NOT_FOUND") {
      return Response.json(
        { status_code: 404, message_th: "ไม่พบข้อมูลผู้ใช้", message_en: "Profile not found", data: null },
        { status: 404 },
      );
    }
    console.error("❌ [POST /api/v1/employee/licenses]", error);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 },
    );
  }
}
