import { prisma } from "@/lib/prisma";
import { z } from "zod";

// ✨ GET /api/v1/admin/site-settings — ดึงการตั้งค่าระบบทั้งหมด
export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany();
    // ✨ แปลงเป็น object key → value
    const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return Response.json({ status_code: 200, message_th: "ดึงข้อมูลสำเร็จ", message_en: "OK", data: settings });
  } catch (err) {
    console.error("❌ [GET /api/v1/admin/site-settings]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาด", message_en: "Internal server error", data: null }, { status: 500 });
  }
}

const patchSchema = z.object({
  admin_user_id: z.string().min(1),
  settings: z.record(z.string(), z.string()),
});

// ✨ PATCH /api/v1/admin/site-settings — อัปเดตการตั้งค่า (upsert)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid input", data: parsed.error.flatten() }, { status: 400 });
    }

    // ✨ ตรวจสิทธิ์ ADMIN
    const admin = await prisma.profile.findFirst({
      where: { OR: [{ userId: parsed.data.admin_user_id }, { id: parsed.data.admin_user_id }], role: "ADMIN" },
      select: { id: true },
    });
    if (!admin) {
      return Response.json({ status_code: 403, message_th: "ไม่มีสิทธิ์เข้าถึง", message_en: "Forbidden", data: null }, { status: 403 });
    }

    // ✨ upsert ทุก key ที่ส่งมา
    await Promise.all(
      Object.entries(parsed.data.settings).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value, updatedBy: parsed.data.admin_user_id },
          create: { key, value, updatedBy: parsed.data.admin_user_id },
        })
      )
    );

    return Response.json({ status_code: 200, message_th: "บันทึกสำเร็จ", message_en: "Updated", data: null });
  } catch (err) {
    console.error("❌ [PATCH /api/v1/admin/site-settings]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาด", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
