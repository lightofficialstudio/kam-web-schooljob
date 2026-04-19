import { createResumeSchema } from "./validation/resume-schema";
import { createResumeService } from "./service/resume-service";

// ✨ POST /api/v1/employee/resumes?user_id=... — บันทึก Resume หลังอัปโหลดไฟล์
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
    const parsed = createResumeSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid request", data: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await createResumeService(userId, parsed.data);

    return Response.json(
      { status_code: 201, message_th: "เพิ่มเรซูเม่สำเร็จ", message_en: "Resume created", data: result },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "PROFILE_NOT_FOUND") {
      return Response.json(
        { status_code: 404, message_th: "ไม่พบข้อมูลผู้ใช้", message_en: "Profile not found", data: null },
        { status: 404 },
      );
    }
    console.error("❌ [POST /api/v1/employee/resumes]", error);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 },
    );
  }
}
