import { updateWorkExperienceSchema } from "../validation/work-experience-schema";
import { updateWorkExperienceService, deleteWorkExperienceService } from "../service/work-experience-service";
import { prisma } from "@/lib/prisma";

// ✨ ตรวจ ownership — ว่า workExperience เป็นของ userId นี้จริง
const verifyOwnership = async (id: string, userId: string): Promise<boolean> => {
  const record = await prisma.workExperience.findFirst({
    where: { id, isDeleted: false, profile: { userId } },
    select: { id: true },
  });
  return !!record;
};

// ✨ PUT /api/v1/employee/work-experiences/[id] — อัปเดตประวัติการทำงาน
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return Response.json(
        { status_code: 401, message_th: "กรุณาเข้าสู่ระบบ", message_en: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    if (!(await verifyOwnership(id, userId))) {
      return Response.json(
        { status_code: 403, message_th: "ไม่มีสิทธิ์แก้ไขข้อมูลนี้", message_en: "Forbidden", data: null },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const parsed = updateWorkExperienceSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid input", data: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await updateWorkExperienceService(id, parsed.data);

    return Response.json(
      { status_code: 200, message_th: "อัปเดตประวัติการทำงานสำเร็จ", message_en: "Work experience updated", data: result },
      { status: 200 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in (error as { code?: string }) &&
      (error as { code?: string }).code === "P2025"
    ) {
      return Response.json(
        { status_code: 404, message_th: "ไม่พบข้อมูลประวัติการทำงาน", message_en: "Work experience not found", data: null },
        { status: 404 }
      );
    }
    console.error("❌ [PUT /api/v1/employee/work-experiences/[id]]:", error);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 }
    );
  }
}

// ✨ DELETE /api/v1/employee/work-experiences/[id] — ลบประวัติการทำงาน (soft-delete)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return Response.json(
        { status_code: 401, message_th: "กรุณาเข้าสู่ระบบ", message_en: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    if (!(await verifyOwnership(id, userId))) {
      return Response.json(
        { status_code: 403, message_th: "ไม่มีสิทธิ์ลบข้อมูลนี้", message_en: "Forbidden", data: null },
        { status: 403 }
      );
    }

    await deleteWorkExperienceService(id);

    return Response.json(
      { status_code: 200, message_th: "ลบประวัติการทำงานสำเร็จ", message_en: "Work experience deleted", data: null },
      { status: 200 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in (error as { code?: string }) &&
      (error as { code?: string }).code === "P2025"
    ) {
      return Response.json(
        { status_code: 404, message_th: "ไม่พบข้อมูลประวัติการทำงาน", message_en: "Work experience not found", data: null },
        { status: 404 }
      );
    }
    console.error("❌ [DELETE /api/v1/employee/work-experiences/[id]]:", error);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
