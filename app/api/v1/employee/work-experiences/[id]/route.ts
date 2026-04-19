import { updateWorkExperienceSchema } from "../validation/work-experience-schema";
import { updateWorkExperienceService, deleteWorkExperienceService } from "../service/work-experience-service";

// ✨ PUT /api/v1/employee/work-experiences/[id] — อัปเดตประวัติการทำงาน
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json().catch(() => ({}));

    // 📝 Validate request body
    const parsed = updateWorkExperienceSchema.safeParse(body);
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

    const result = await updateWorkExperienceService(id, parsed.data);

    return Response.json(
      {
        status_code: 200,
        message_th: "อัปเดตประวัติการทำงานสำเร็จ",
        message_en: "Work experience updated",
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
          message_th: "ไม่พบข้อมูลประวัติการทำงาน",
          message_en: "Work experience not found",
          data: null,
        },
        { status: 404 }
      );
    }

    console.error("❌ [PUT /api/v1/employee/work-experiences/[id]]:", error);
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

// ✨ DELETE /api/v1/employee/work-experiences/[id] — ลบประวัติการทำงาน (soft-delete)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await deleteWorkExperienceService(id);

    return Response.json(
      {
        status_code: 200,
        message_th: "ลบประวัติการทำงานสำเร็จ",
        message_en: "Work experience deleted",
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
          message_th: "ไม่พบข้อมูลประวัติการทำงาน",
          message_en: "Work experience not found",
          data: null,
        },
        { status: 404 }
      );
    }

    console.error("❌ [DELETE /api/v1/employee/work-experiences/[id]]:", error);
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
