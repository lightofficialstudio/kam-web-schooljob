import { prisma } from "@/lib/prisma";
import { broadcastAnnouncementService } from "../service/announcement-service";
import { broadcastSchema } from "../validation/announcement-schema";

// ✨ POST /api/v1/admin/announcements/broadcast — ส่ง Notification ถึง User ตาม role
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = broadcastSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid input", data: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // ✨ ตรวจสิทธิ์ Admin
    const adminProfile = await prisma.profile.findFirst({
      where: { OR: [{ userId: parsed.data.admin_user_id }, { id: parsed.data.admin_user_id }] },
      select: { id: true, role: true, userId: true },
    });
    console.log("🔐 [broadcast] admin_user_id:", parsed.data.admin_user_id, "found profile:", adminProfile);
    if (!adminProfile || adminProfile.role !== "ADMIN") {
      return Response.json(
        { status_code: 403, message_th: "ไม่มีสิทธิ์เข้าถึง", message_en: "Forbidden", data: null },
        { status: 403 }
      );
    }
    const admin = adminProfile;

    const result = await broadcastAnnouncementService(parsed.data);

    return Response.json(
      {
        status_code: 200,
        message_th: `ส่ง Notification สำเร็จ ${result.sentCount} คน`,
        message_en: `Broadcast sent to ${result.sentCount} users`,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาด", message_en: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
