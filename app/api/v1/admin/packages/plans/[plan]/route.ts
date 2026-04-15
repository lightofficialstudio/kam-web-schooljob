import { NextRequest } from "next/server";
import { adminPackageService } from "../../service/package-service";
import { patchPlanSchema } from "../../validation/package-schema";

// ✨ PATCH /api/v1/admin/packages/plans/[plan] — แก้ไข Package Plan (Admin)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ plan: string }> },
) {
  try {
    const { plan } = await params;
    const body = await req.json();
    const parsed = patchPlanSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          status_code: 400,
          message_th: "ข้อมูลไม่ถูกต้อง",
          message_en: "Invalid input",
          data: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const updated = await adminPackageService.patchPlan(plan, parsed.data);

    return Response.json({
      status_code: 200,
      message_th: `อัปเดต Package Plan "${updated.label}" สำเร็จ`,
      message_en: "Package plan updated successfully",
      data: {
        ...updated,
        features: (() => {
          try {
            return JSON.parse(updated.features);
          } catch {
            return [];
          }
        })(),
      },
    });
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err?.code === "P2025") {
      return Response.json(
        {
          status_code: 404,
          message_th: "ไม่พบ Package Plan นี้",
          message_en: "Package plan not found",
          data: null,
        },
        { status: 404 },
      );
    }
    console.error("❌ [PATCH /api/v1/admin/packages/plans/[plan]]", error);
    return Response.json(
      {
        status_code: 500,
        message_th: "เกิดข้อผิดพลาดภายในระบบ",
        message_en: "Internal server error",
        data: null,
      },
      { status: 500 },
    );
  }
}

// ✨ DELETE /api/v1/admin/packages/plans/[plan] — ลบ Package Plan (Admin)
// ⚠️ จะ Error ถ้ายังมีโรงเรียนใช้ plan นี้อยู่
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ plan: string }> },
) {
  try {
    const { plan } = await params;
    await adminPackageService.deletePlan(plan);

    return Response.json({
      status_code: 200,
      message_th: `ลบ Package Plan "${plan}" สำเร็จ`,
      message_en: "Package plan deleted successfully",
      data: null,
    });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };

    if (err?.message?.startsWith("PLAN_IN_USE:")) {
      const count = err.message.split(":")[1];
      return Response.json(
        {
          status_code: 409,
          message_th: `ไม่สามารถลบได้ — มี ${count} โรงเรียนกำลังใช้ Plan นี้อยู่`,
          message_en: `Cannot delete — ${count} school(s) are using this plan`,
          data: null,
        },
        { status: 409 },
      );
    }
    if (err?.code === "P2025") {
      return Response.json(
        {
          status_code: 404,
          message_th: "ไม่พบ Package Plan นี้",
          message_en: "Package plan not found",
          data: null,
        },
        { status: 404 },
      );
    }
    console.error("❌ [DELETE /api/v1/admin/packages/plans/[plan]]", error);
    return Response.json(
      {
        status_code: 500,
        message_th: "เกิดข้อผิดพลาดภายในระบบ",
        message_en: "Internal server error",
        data: null,
      },
      { status: 500 },
    );
  }
}
