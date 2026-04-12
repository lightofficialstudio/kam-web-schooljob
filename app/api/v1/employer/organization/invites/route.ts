import {
  getPendingInvitesService,
  revokeInviteService,
} from "../service/org-service";

// ✨ GET /api/v1/employer/organization/invites?user_id=xxx — ดึงคำเชิญที่รอ
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    if (!userId) {
      return Response.json({ status_code: 400, message_th: "กรุณาระบุ user_id", message_en: "user_id is required", data: null }, { status: 400 });
    }
    const invites = await getPendingInvitesService(userId);
    return Response.json({ status_code: 200, message_th: "ดึงข้อมูลสำเร็จ", message_en: "OK", data: invites });
  } catch (err) {
    console.error("❌ [org/invites GET]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}

// ✨ DELETE /api/v1/employer/organization/invites?user_id=xxx&invite_id=xxx — ยกเลิกคำเชิญ
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId   = searchParams.get("user_id");
    const inviteId = searchParams.get("invite_id");
    if (!userId || !inviteId) {
      return Response.json({ status_code: 400, message_th: "กรุณาระบุ user_id และ invite_id", message_en: "Required params missing", data: null }, { status: 400 });
    }
    await revokeInviteService(userId, inviteId);
    return Response.json({ status_code: 200, message_th: "ยกเลิกคำเชิญสำเร็จ", message_en: "Revoked", data: null });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown";
    if (msg === "INVITE_NOT_FOUND") {
      return Response.json({ status_code: 404, message_th: "ไม่พบคำเชิญ", message_en: msg, data: null }, { status: 404 });
    }
    console.error("❌ [org/invites DELETE]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
