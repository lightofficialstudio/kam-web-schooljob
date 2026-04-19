import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { BroadcastInput } from "../validation/announcement-schema";

const PAGE_SIZE = 20;

// ✨ prefix สำหรับแยก broadcast target_role ออกจาก entity reference อื่น
const BROADCAST_PREFIX = "broadcast:";

// ✨ ส่ง Notification ไปยัง profiles ทุกคนตาม role ที่เลือก
export const broadcastAnnouncementService = async (data: BroadcastInput) => {
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

  // ✨ timestamp ร่วมกันทุก batch เพื่อให้ groupBy รวมเป็น 1 announcement เสมอ
  const broadcastAt = new Date();

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
        imageUrl: data.image_url ?? null,
        referenceId: data.reference_id ?? null,
        // ✨ ใช้ prefix "broadcast:" เพื่อไม่ชน entity reference อื่น ('job', 'blog', ฯลฯ)
        referenceType: `${BROADCAST_PREFIX}${data.target_role}`,
        createdAt: broadcastAt,
      })),
      skipDuplicates: true,
    });
    sentCount += result.count;
  }

  return { sentCount };
};

// ✨ parse target_role คืนจาก referenceType ที่มี prefix
const parseTargetRole = (referenceType: string | null): "ALL" | "EMPLOYEE" | "EMPLOYER" => {
  if (!referenceType?.startsWith(BROADCAST_PREFIX)) return "ALL";
  const role = referenceType.slice(BROADCAST_PREFIX.length);
  if (role === "EMPLOYEE" || role === "EMPLOYER") return role;
  return "ALL";
};

// ✨ ดึงประวัติ Announcement (system type) โดยนับ sentCount จาก referenceType+title+message+createdAt
export const getAnnouncementHistoryService = async (page: number) => {
  const skip = (page - 1) * PAGE_SIZE;

  // ✨ groupBy เพิ่ม imageUrl เข้า group key เพื่อให้ select ออกมาได้
  const groups = await prisma.notification.groupBy({
    by: ["title", "message", "imageUrl", "type", "referenceType", "createdAt"],
    where: { type: "system", referenceType: { startsWith: BROADCAST_PREFIX } },
    _count: { id: true },
    orderBy: { createdAt: "desc" },
    skip,
    take: PAGE_SIZE,
  });

  // ✨ นับ total: ถ้าหน้าแรกและได้น้อยกว่า PAGE_SIZE — ไม่ต้อง query ซ้ำ
  const total =
    skip === 0 && groups.length < PAGE_SIZE
      ? groups.length
      : await prisma.notification
          .groupBy({
            by: ["title", "message", "imageUrl", "type", "referenceType", "createdAt"],
            where: { type: "system", referenceType: { startsWith: BROADCAST_PREFIX } },
            _count: { id: true },
          })
          .then((r) => r.length);

  return {
    items: groups.map((g) => ({
      title: g.title,
      message: g.message ?? "",
      imageUrl: g.imageUrl ?? null,
      type: g.type,
      targetRole: parseTargetRole(g.referenceType),
      sentCount: g._count.id,
      createdAt: g.createdAt,
    })),
    total,
    page,
    pageSize: PAGE_SIZE,
  };
};
