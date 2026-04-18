import { prisma } from "@/lib/prisma";
import { getAnnouncementHistoryService } from "../service/announcement-service";

// ✨ GET /api/v1/admin/announcements/history?admin_user_id=xxx&page=1
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUserId = searchParams.get("admin_user_id") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

    // ✨ ตรวจสิทธิ์ Admin
    const admin = await prisma.profile.findFirst({
      where: { OR: [{ userId: adminUserId }, { id: adminUserId }], role: "ADMIN" },
      select: { id: true },
    });
    if (!admin) {
      return Response.json(
        { status_code: 403, message_th: "ไม่มีสิทธิ์เข้าถึง", message_en: "Forbidden", data: null },
        { status: 403 }
      );
    }

    const result = await getAnnouncementHistoryService(page);

    return Response.json(
      { status_code: 200, message_th: "สำเร็จ", message_en: "OK", data: result },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาด", message_en: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
