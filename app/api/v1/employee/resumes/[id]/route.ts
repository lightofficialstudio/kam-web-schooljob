import { updateResumeSchema } from "../validation/resume-schema";
import { updateResumeService, deleteResumeService } from "../service/resume-service";
import { prisma } from "@/lib/prisma";

// ✨ ตรวจ ownership — ว่า resume เป็นของ userId นี้จริง
const verifyOwnership = async (id: string, userId: string): Promise<boolean> => {
  const record = await prisma.resume.findFirst({
    where: { id, isDeleted: false, profile: { userId } },
    select: { id: true },
  });
  return !!record;
};

// ✨ PUT /api/v1/employee/resumes/[id] — อัปเดต Resume (set active / เปลี่ยนชื่อ)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const parsed = updateResumeSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid request", data: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await updateResumeService(id, parsed.data);

    return Response.json(
      { status_code: 200, message_th: "อัปเดตเรซูเม่สำเร็จ", message_en: "Resume updated", data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [PUT /api/v1/employee/resumes/[id]]", error);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 }
    );
  }
}

// ✨ DELETE /api/v1/employee/resumes/[id] — Soft-delete Resume
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    await deleteResumeService(id);

    return Response.json(
      { status_code: 200, message_th: "ลบเรซูเม่สำเร็จ", message_en: "Resume deleted", data: null },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [DELETE /api/v1/employee/resumes/[id]]", error);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
