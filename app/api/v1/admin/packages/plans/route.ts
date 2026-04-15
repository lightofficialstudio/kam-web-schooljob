import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { z } from "zod";
import { PLAN_LIST } from "../validation/package-schema";

// ✨ GET /api/v1/admin/packages/plans — ดึงราคา Package ทั้งหมด
export async function GET() {
  try {
    const plans = await prisma.packagePlan.findMany({
      orderBy: { plan: "asc" },
    });

    return Response.json({
      status_code: 200,
      message_th: "ดึงราคา Package สำเร็จ",
      message_en: "Fetched package plans successfully",
      data: plans,
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

const updatePriceSchema = z.object({
  plan: z.enum(PLAN_LIST),
  price: z.number().int().min(0),
});

// ✨ PATCH /api/v1/admin/packages/plans — อัปเดตราคา Package (Admin เท่านั้น)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updatePriceSchema.safeParse(body);

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

    const { plan, price } = parsed.data;

    // ✨ upsert — สร้างถ้ายังไม่มี, แก้ไขถ้ามีแล้ว
    const updated = await prisma.packagePlan.upsert({
      where: { plan },
      update: { price },
      create: { plan, price },
    });

    return Response.json({
      status_code: 200,
      message_th: `อัปเดตราคา ${plan} สำเร็จ`,
      message_en: "Package price updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("❌ [PATCH /api/v1/admin/packages/plans]", error);
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
