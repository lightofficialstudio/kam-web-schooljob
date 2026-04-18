import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

// ✨ GET /api/v1/admin/announcements/count?target_role=ALL|EMPLOYEE|EMPLOYER
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetRole = searchParams.get("target_role") ?? "ALL";

    const whereRole =
      targetRole === "ALL"
        ? {}
        : { role: targetRole as UserRole };

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
