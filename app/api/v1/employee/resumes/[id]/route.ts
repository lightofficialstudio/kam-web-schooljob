import { updateResumeSchema } from "../validation/resume-schema";
import { updateResumeService, deleteResumeService } from "../service/resume-service";

// ✨ PUT /api/v1/employee/resumes/[id] — อัปเดต Resume (set active / เปลี่ยนชื่อ)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const parsed = updateResumeSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid request", data: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await updateResumeService(id, parsed.data);

    return Response.json(
      { status_code: 200, message_th: "อัปเดตเรซูเม่สำเร็จ", message_en: "Resume updated", data: result },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ [PUT /api/v1/employee/resumes/[id]]", error);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 },
    );
  }
}

// ✨ DELETE /api/v1/employee/resumes/[id] — Soft-delete Resume
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteResumeService(id);

    return Response.json(
      { status_code: 200, message_th: "ลบเรซูเม่สำเร็จ", message_en: "Resume deleted", data: null },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ [DELETE /api/v1/employee/resumes/[id]]", error);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 },
    );
  }
}
