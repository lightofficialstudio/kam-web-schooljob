import { markAllReadService } from "../service/notification-service";

// ✨ PATCH /api/v1/notifications/read-all?user_id=xxx — mark ทั้งหมดว่าอ่านแล้ว
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    if (!userId) {
      return Response.json({ status_code: 400, message_th: "กรุณาระบุ user_id", message_en: "user_id is required", data: null }, { status: 400 });
    }

    await markAllReadService(userId);
    return Response.json({ status_code: 200, message_th: "อ่านทั้งหมดแล้ว", message_en: "All marked as read", data: null });
  } catch (err) {
    console.error("❌ [notifications/read-all PATCH]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
