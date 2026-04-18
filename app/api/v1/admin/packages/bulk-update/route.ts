import { NextRequest } from "next/server";
import { z } from "zod";
import { adminPackageService } from "../service/package-service";

const bulkSchema = z.object({
  school_ids: z.array(z.string().min(1)).min(1),
  plan: z.string().min(1),
  job_quota_max: z.number().int().min(0).optional(),
});

// ✨ PUT /api/v1/admin/packages/bulk-update — เปลี่ยน plan หลายโรงเรียนพร้อมกัน
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bulkSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid input", data: parsed.error.flatten() }, { status: 400 });
    }
    const result = await adminPackageService.bulkUpdatePlan(parsed.data);
    return Response.json({ status_code: 200, message_th: `อัปเดต ${result.updated} โรงเรียนสำเร็จ`, message_en: "Bulk update success", data: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "NO_SCHOOLS") return Response.json({ status_code: 400, message_th: "กรุณาเลือกโรงเรียน", message_en: "No schools selected", data: null }, { status: 400 });
    console.error("❌ [bulk-update]", err);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาด", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
