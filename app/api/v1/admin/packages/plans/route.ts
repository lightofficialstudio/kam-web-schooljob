import { NextRequest } from "next/server";
import { adminPackageService } from "../service/package-service";
import { upsertPlanSchema } from "../validation/package-schema";

// ✨ GET /api/v1/admin/packages/plans — ดึง Package Plan ทั้งหมดจาก DB
// Query: ?include_inactive=true → รวม plan ที่ปิดใช้งาน
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("include_inactive") === "true";

    // ✨ ?seed=true → seed ค่าเริ่มต้นจาก PACKAGE_DEFINITIONS (ใช้ครั้งแรก)
    if (searchParams.get("seed") === "true") {
      const result = await adminPackageService.seedDefaultPlans();
      return Response.json({
        status_code: 200,
        message_th: result.message,
        message_en: result.message,
        data: result,
      });
    }

    const plans = await adminPackageService.listPlans(includeInactive);

    // ✨ parse features JSON string → array ก่อนส่งกลับ
    const formatted = plans.map((p) => ({
      ...p,
      features: (() => {
        try {
          return JSON.parse(p.features);
        } catch {
          return [];
        }
      })(),
    }));

    return Response.json({
      status_code: 200,
      message_th: "ดึงรายการ Package Plan สำเร็จ",
      message_en: "Package plans fetched successfully",
      data: formatted,
    });
  } catch (error) {
    console.error("❌ [GET /api/v1/admin/packages/plans]", error);
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

// ✨ POST /api/v1/admin/packages/plans — สร้าง Package Plan ใหม่ (Admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = upsertPlanSchema.safeParse(body);

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

    const created = await adminPackageService.createPlan(parsed.data);
    return Response.json(
      {
        status_code: 201,
        message_th: `สร้าง Package Plan "${created.label}" สำเร็จ`,
        message_en: "Package plan created successfully",
        data: { ...created, features: JSON.parse(created.features) },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err?.code === "P2002") {
      return Response.json(
        {
          status_code: 409,
          message_th: "Plan key นี้มีอยู่แล้ว",
          message_en: "Plan key already exists",
          data: null,
        },
        { status: 409 },
      );
    }
    console.error("❌ [POST /api/v1/admin/packages/plans]", error);
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
