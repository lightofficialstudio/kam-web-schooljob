import { prisma } from "@/lib/prisma";

// ✨ GET /api/v1/system/maintenance — ตรวจสถานะ maintenance mode (public, no auth)
// ใช้โดย middleware และ client-side check
export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: ["maintenance_mode", "maintenance_title", "maintenance_message"] } },
    });
    const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return Response.json({
      status_code: 200,
      message_th: "OK",
      message_en: "OK",
      data: {
        isMaintenanceMode: settings["maintenance_mode"] === "true",
        title: settings["maintenance_title"] ?? "ระบบกำลังปรับปรุง",
        message: settings["maintenance_message"] ?? "กรุณากลับมาใหม่ในภายหลัง",
      },
    });
  } catch {
    // ✨ ถ้า DB ไม่ตอบสนอง → ให้ผ่านได้ (ป้องกัน lock ตัวเอง)
    return Response.json({
      status_code: 200,
      message_th: "OK",
      message_en: "OK",
      data: { isMaintenanceMode: false, title: "", message: "" },
    });
  }
}
