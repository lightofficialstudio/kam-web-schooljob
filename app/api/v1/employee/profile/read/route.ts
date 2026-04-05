import { getProfileQuerySchema } from "../validation/employee-profile-schema";
import {
  getEmployeeProfileService,
  ensureEmployeeProfileService,
} from "../service/employee-profile-service";

// ✨ GET /api/v1/employee-profile/read?user_id=xxx&email=xxx
// ดึงข้อมูล Employee Profile ครบทุก relation
// ถ้าไม่พบ profile และมี email → auto-create profile ใหม่ (กรณี user สมัครก่อนระบบ sync)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = { user_id: searchParams.get("user_id") ?? "" };
    const email = searchParams.get("email") ?? "";

    // 📝 Validate query param
    const parsed = getProfileQuerySchema.safeParse(query);
    if (!parsed.success) {
      return Response.json(
        {
          status_code: 400,
          message_th: "ข้อมูลไม่ถูกต้อง",
          message_en: "Invalid query params",
          data: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    let profile = await getEmployeeProfileService(parsed.data.user_id);

    // ✨ ถ้าไม่พบ profile และมี email → auto-create profile ว่างให้ user
    if (!profile && email) {
      console.log(`✨ [employee-profile/read] Auto-creating profile for userId: ${parsed.data.user_id}`);
      profile = await ensureEmployeeProfileService(parsed.data.user_id, email);
    }

    if (!profile) {
      return Response.json(
        {
          status_code: 404,
          message_th: "ไม่พบข้อมูลโปรไฟล์ กรุณาส่ง email มาด้วยเพื่อสร้างโปรไฟล์",
          message_en: "Profile not found. Send email param to auto-create.",
          data: null,
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        status_code: 200,
        message_th: "ดึงข้อมูลโปรไฟล์สำเร็จ",
        message_en: "Profile fetched successfully",
        data: profile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [employee-profile/read]:", error);
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
