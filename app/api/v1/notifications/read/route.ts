import {
  getNotificationsService,
  markReadService,
} from "../service/notification-service";

// ✨ GET /api/v1/notifications/read?user_id=xxx — ดึง notifications + unread count
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    if (!userId) {
      return Response.json({ status_code: 400, message_th: "กรุณาระบุ user_id", message_en: "user_id is required", data: null }, { status: 400 });
    }

    const data = await getNotificationsService(userId);
    return Response.json({ status_code: 200, message_th: "ดึงข้อมูลสำเร็จ", message_en: "OK", data });
  } catch (err) {
    console.error("❌ [notifications/read GET]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}

// ✨ PATCH /api/v1/notifications/read?user_id=xxx&id=xxx — mark อ่านแล้ว
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId         = searchParams.get("user_id");
    const notificationId = searchParams.get("id");
    if (!userId || !notificationId) {
      return Response.json({ status_code: 400, message_th: "กรุณาระบุ user_id และ id", message_en: "Required params missing", data: null }, { status: 400 });
    }

    await markReadService(userId, notificationId);
    return Response.json({ status_code: 200, message_th: "อัปเดตสำเร็จ", message_en: "Marked as read", data: null });
  } catch (err) {
    console.error("❌ [notifications/read PATCH]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
