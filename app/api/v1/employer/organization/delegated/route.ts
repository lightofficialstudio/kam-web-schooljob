import { getDelegatedAccessService } from "../service/org-service";

// ✨ GET /api/v1/employer/organization/delegated?user_id=xxx
// ดึงรายการโรงเรียนทั้งหมดที่ user นี้ถูก delegate ให้เข้าถึง
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    if (!userId) {
      return Response.json({ status_code: 400, message_th: "กรุณาระบุ user_id", message_en: "user_id is required", data: null }, { status: 400 });
    }
    const accesses = await getDelegatedAccessService(userId);
    return Response.json({ status_code: 200, message_th: "ดึงข้อมูลสำเร็จ", message_en: "OK", data: accesses });
  } catch (err) {
    console.error("❌ [org/delegated GET]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
