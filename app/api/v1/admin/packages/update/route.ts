import { NextRequest } from "next/server";
import { adminPackageService } from "../service/package-service";
import { updateSchoolPlanSchema } from "../validation/package-schema";

// ✨ PUT /api/v1/admin/packages/update — อัปเดต plan โรงเรียน (Admin manual / Payment webhook)
// 🔌 PAYMENT GATEWAY HOOK: เมื่อลูกค้าชำระเงินสำเร็จ → Payment gateway เรียก endpoint นี้ทันที
//    Body: { school_profile_id, plan, job_quota_max? }
//    ลูกค้าได้รับ Package ทันทีโดยไม่ต้องรอ Admin
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateSchoolPlanSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid input", data: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updated = await adminPackageService.updateSchoolPlan(parsed.data);

    return Response.json({
      status_code: 200,
      message_th: `อัปเดต Package เป็น ${parsed.data.plan.toUpperCase()} สำเร็จ`,
      message_en: "Package updated successfully",
      data: updated,
    });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return Response.json({ status_code: 404, message_th: "ไม่พบโรงเรียน", message_en: "School not found", data: null }, { status: 404 });
    }
    console.error("❌ [PUT /api/v1/admin/packages/update]", error);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
