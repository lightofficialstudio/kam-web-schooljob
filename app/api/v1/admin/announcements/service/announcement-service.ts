import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { BroadcastInput } from "../validation/announcement-schema";

const PAGE_SIZE = 20;

// ✨ ส่ง Notification ไปยัง profiles ทุกคนตาม role ที่เลือก
export const broadcastAnnouncementService = async (data: BroadcastInput) => {
  // ✨ ดึง profile ids ตาม role target
  const whereRole =
    data.target_role === "ALL"
      ? {}
      : { role: data.target_role as UserRole };

  const profiles = await prisma.profile.findMany({
    where: whereRole,
    select: { id: true },
  });

  if (profiles.length === 0) {
    return { sentCount: 0 };
  }

  // ✨ createMany ใน batch เพื่อ performance
  const BATCH = 500;
  let sentCount = 0;

  for (let i = 0; i < profiles.length; i += BATCH) {
    const batch = profiles.slice(i, i + BATCH);
    const result = await prisma.notification.createMany({
      data: batch.map((p) => ({
        profileId: p.id,
        type: data.type,
        title: data.title,
        message: data.message,
        referenceId: data.reference_id ?? null,
        // ✨ เก็บ target_role ใน referenceType เพื่อแสดงใน History
        referenceType: data.target_role,
      })),
      skipDuplicates: true,
    });
    sentCount += result.count;
  }

  return { sentCount };
};

// ✨ ดึงประวัติ Announcement (system type, เรียงล่าสุด, แบบ pagination)
export const getAnnouncementHistoryService = async (page: number) => {
  const skip = (page - 1) * PAGE_SIZE;

  // ✨ ดึง distinct title+message+createdAt+referenceType โดยใช้ groupBy
  const groups = await prisma.notification.groupBy({
    by: ["title", "message", "type", "referenceType", "createdAt"],
    where: { type: "system" },
    _count: { id: true },
    orderBy: { createdAt: "desc" },
    skip,
    take: PAGE_SIZE,
  });

  const total = await prisma.notification.groupBy({
    by: ["title", "message", "type", "referenceType", "createdAt"],
    where: { type: "system" },
    _count: { id: true },
  }).then((r) => r.length);

  return {
    items: groups.map((g) => ({
      title: g.title,
      message: g.message ?? "",
      type: g.type,
      // ✨ referenceType เก็บ target_role ไว้ตอน broadcast
      targetRole: (g.referenceType ?? "ALL") as "ALL" | "EMPLOYEE" | "EMPLOYER",
      sentCount: g._count.id,
      createdAt: g.createdAt,
    })),
    total,
    page,
    pageSize: PAGE_SIZE,
  };
};
