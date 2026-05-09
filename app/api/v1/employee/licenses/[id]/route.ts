import { updateLicenseSchema } from "../validation/license-schema";
import { updateLicenseService, deleteLicenseService } from "../service/license-service";

// ✨ PUT /api/v1/employee/licenses/[id] — อัปเดตใบอนุญาต
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const parsed = updateLicenseSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid request", data: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await updateLicenseService(id, parsed.data);

    return Response.json(
      { status_code: 200, message_th: "อัปเดตใบอนุญาตสำเร็จ", message_en: "License updated", data: result },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ [PUT /api/v1/employee/licenses/[id]]", error);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 },
    );
  }
}

// ✨ DELETE /api/v1/employee/licenses/[id] — Soft-delete ใบอนุญาต
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteLicenseService(id);

    return Response.json(
      { status_code: 200, message_th: "ลบใบอนุญาตสำเร็จ", message_en: "License deleted", data: null },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ [DELETE /api/v1/employee/licenses/[id]]", error);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 },
    );
  }
}
