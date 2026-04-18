import { prisma } from "@/lib/prisma";

// ─── Notification Types ────────────────────────────────────────────────────────
// ✨ ประเภท notification ที่ระบบรองรับ — เพิ่มเติมได้ในอนาคต
export type NotificationType =
  | "application_submitted"   // EMPLOYER ได้รับใบสมัครใหม่
  | "application_status"      // EMPLOYEE สถานะใบสมัครเปลี่ยน (INTERVIEW/ACCEPTED/REJECTED)
  | "invite_sent"             // EMPLOYEE ได้รับคำเชิญเข้าองค์กร
  | "invite_accepted"         // EMPLOYER สมาชิกยอมรับคำเชิญ
  | "job_posted"              // EMPLOYEE มีงานใหม่ตรงสาขา (reserved)
  | "admin_action"            // ADMIN กระทำกับ Post/User/Blog (audit trail)
  | "system"                  // ทุก role — ประกาศจากระบบ

// ─── สร้าง Notification ────────────────────────────────────────────────────────

interface CreateNotificationInput {
  profileId: string;
  type: NotificationType;
  title: string;
  message?: string;
  referenceId?: string;
  referenceType?: "application" | "job" | "invite" | "blog";
}

// ✨ helper กลาง — ทุก service ที่ต้องการส่ง notification เรียกผ่านนี้
export const createNotification = async (input: CreateNotificationInput) => {
  return prisma.notification.create({
    data: {
      profileId:     input.profileId,
      type:          input.type,
      title:         input.title,
      message:       input.message ?? null,
      referenceId:   input.referenceId ?? null,
      referenceType: input.referenceType ?? null,
      isRead:        false,
    },
  });
};

// ✨ ส่ง notification หลายคนพร้อมกัน (bulk)
export const createNotificationMany = async (
  inputs: CreateNotificationInput[],
) => {
  return prisma.notification.createMany({
    data: inputs.map((input) => ({
      profileId:     input.profileId,
      type:          input.type,
      title:         input.title,
      message:       input.message ?? null,
      referenceId:   input.referenceId ?? null,
      referenceType: input.referenceType ?? null,
      isRead:        false,
    })),
  });
};
