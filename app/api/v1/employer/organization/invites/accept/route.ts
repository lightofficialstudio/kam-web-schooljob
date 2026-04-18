import { createNotification } from "@/lib/notification";
import { prisma } from "@/lib/prisma";
import { acceptInviteService } from "../../service/org-service";
import { acceptInviteSchema } from "../../validation/org-schema";

// ✨ POST /api/v1/employer/organization/invites/accept?user_id=xxx — ยอมรับคำเชิญ
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    if (!userId) {
      return Response.json({ status_code: 400, message_th: "กรุณาระบุ user_id", message_en: "user_id is required", data: null }, { status: 400 });
    }
    const body = await request.json();
    const parsed = acceptInviteSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Validation error", data: parsed.error.flatten() }, { status: 400 });
    }
    const member = await acceptInviteService(userId, parsed.data.token);

    // ✨ แจ้ง EMPLOYER ว่ามีสมาชิกยอมรับคำเชิญ
    try {
      const invite = await prisma.orgInvite.findFirst({
        where: { token: parsed.data.token },
        select: {
          invitedBy: true,
          schoolProfile: { select: { schoolName: true } },
        },
      });
      const accepterProfile = await prisma.profile.findUnique({
        where: { userId },
        select: { firstName: true, lastName: true, email: true },
      });
      if (invite?.invitedBy && invite.schoolProfile) {
        const accepterName = [accepterProfile?.firstName, accepterProfile?.lastName].filter(Boolean).join(" ") || accepterProfile?.email || "สมาชิกใหม่";
        await createNotification({
          profileId:     invite.invitedBy,
          type:          "invite_accepted",
          title:         `${accepterName} ยอมรับคำเชิญเข้าร่วม ${invite.schoolProfile.schoolName}`,
          message:       "สมาชิกใหม่พร้อมเข้าถึงระบบแล้ว",
          referenceId:   member.id,
          referenceType: "invite",
        });
      }
    } catch (e) {
      console.error("❌ [notification] invite_accepted:", e);
    }

    return Response.json({ status_code: 201, message_th: "ยอมรับคำเชิญสำเร็จ", message_en: "Accepted", data: member }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown";
    const map: Record<string, [number, string]> = {
      PROFILE_NOT_FOUND:           [404, "ไม่พบโปรไฟล์"],
      INVITE_NOT_FOUND_OR_EXPIRED: [404, "ไม่พบคำเชิญหรือหมดอายุแล้ว"],
      ALREADY_MEMBER:              [409, "คุณเป็นสมาชิกขององค์กรนี้อยู่แล้ว"],
    };
    if (map[msg]) return Response.json({ status_code: map[msg][0], message_th: map[msg][1], message_en: msg, data: null }, { status: map[msg][0] });
    console.error("❌ [org/invites/accept POST]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
