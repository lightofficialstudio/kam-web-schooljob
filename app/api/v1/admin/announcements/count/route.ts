import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

const VALID_ROLES = ["ALL", "EMPLOYEE", "EMPLOYER"] as const;
type TargetRole = (typeof VALID_ROLES)[number];

// ✨ GET /api/v1/admin/announcements/count?target_role=ALL|EMPLOYEE|EMPLOYER
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawRole = searchParams.get("target_role") ?? "ALL";

    // ✨ validate enum ก่อน — ป้องกัน unsafe cast ที่ทำให้ Prisma error 500
    if (!(VALID_ROLES as readonly string[]).includes(rawRole)) {
      return Response.json(
        { status_code: 400, message_th: "target_role ไม่ถูกต้อง", message_en: "Invalid target_role", data: null },
        { status: 400 }
      );
    }

    const targetRole = rawRole as TargetRole;
    const whereRole = targetRole === "ALL" ? {} : { role: targetRole as UserRole };
    const count = await prisma.profile.count({ where: whereRole });

    return Response.json(
      { status_code: 200, message_th: "สำเร็จ", message_en: "OK", data: { count } },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาด", message_en: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
