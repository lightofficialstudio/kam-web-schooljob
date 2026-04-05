import {
  ensureEmployerProfileService,
  getEmployerProfileService,
} from "../service/employer-profile-service";
import { getEmployerProfileQuerySchema } from "../validation/employer-profile-schema";

// ✨ GET /api/v1/employer-profile/read?user_id=xxx&email=xxx
// ดึงข้อมูล SchoolProfile ครบทุก relation
// ถ้าไม่พบ Profile และมี email → auto-create ใหม่ให้
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = { user_id: searchParams.get("user_id") ?? "" };
    const email = searchParams.get("email") ?? "";

    const parsed = getEmployerProfileQuerySchema.safeParse(query);
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

    let profile = await getEmployerProfileService(parsed.data.user_id);

    // ✨ Auto-create ถ้ายังไม่มี Profile และมี email ส่งมา
    if (!profile && email) {
      console.log(
        `✨ [employer-profile/read] Auto-creating profile for userId: ${parsed.data.user_id}`,
      );
      profile = await ensureEmployerProfileService(parsed.data.user_id, email);
    }

    if (!profile) {
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

    return Response.json({
      status_code: 200,
      message_th: "ดึงข้อมูลสำเร็จ",
      message_en: "Fetched successfully",
      data: profile,
    });
  } catch (err) {
    console.error("❌ [employer-profile/read] Error:", err);
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
