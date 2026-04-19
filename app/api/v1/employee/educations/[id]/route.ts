import { updateEducationSchema } from "../validation/education-schema";
import { updateEducationService, deleteEducationService } from "../service/education-service";

// ✨ PUT /api/v1/employee/educations/[id] — อัปเดตประวัติการศึกษา
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json().catch(() => ({}));

    // 📝 Validate request body
    const parsed = updateEducationSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          status_code: 400,
          message_th: "ข้อมูลไม่ถูกต้อง",
          message_en: "Invalid input",
          data: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await updateEducationService(id, parsed.data);

    return Response.json(
      {
        status_code: 200,
        message_th: "อัปเดตประวัติการศึกษาสำเร็จ",
        message_en: "Education updated",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    // ❌ จัดการกรณี record ไม่พบ (Prisma P2025)
    if (
      error instanceof Error &&
      "code" in (error as { code?: string }) &&
      (error as { code?: string }).code === "P2025"
    ) {
      return Response.json(
        {
          status_code: 404,
          message_th: "ไม่พบข้อมูลประวัติการศึกษา",
          message_en: "Education not found",
          data: null,
        },
        { status: 404 }
      );
    }

    console.error("❌ [PUT /api/v1/employee/educations/[id]]:", error);
    return Response.json(
      {
        status_code: 500,
        message_th: "เกิดข้อผิดพลาดภายในระบบ",
        message_en: "Internal server error",
        data: null,
      },
      { status: 500 }
    );
  }
}

// ✨ DELETE /api/v1/employee/educations/[id] — ลบประวัติการศึกษา (soft-delete)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await deleteEducationService(id);

    return Response.json(
      {
        status_code: 200,
        message_th: "ลบประวัติการศึกษาสำเร็จ",
        message_en: "Education deleted",
        data: null,
      },
      { status: 200 }
    );
  } catch (error) {
    // ❌ จัดการกรณี record ไม่พบ (Prisma P2025)
    if (
      error instanceof Error &&
      "code" in (error as { code?: string }) &&
      (error as { code?: string }).code === "P2025"
    ) {
      return Response.json(
        {
          status_code: 404,
          message_th: "ไม่พบข้อมูลประวัติการศึกษา",
          message_en: "Education not found",
          data: null,
        },
        { status: 404 }
      );
    }

    console.error("❌ [DELETE /api/v1/employee/educations/[id]]:", error);
    return Response.json(
      {
        status_code: 500,
        message_th: "เกิดข้อผิดพลาดภายในระบบ",
        message_en: "Internal server error",
        data: null,
      },
      { status: 500 }
    );
  }
}
