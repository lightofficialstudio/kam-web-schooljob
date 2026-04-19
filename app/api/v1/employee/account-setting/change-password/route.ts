import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// ✨ Schema ตรวจสอบรหัสผ่านใหม่
const changePasswordSchema = z.object({
  new_password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
});

// ✨ PUT /api/v1/employee/account-setting/change-password?user_id=xxx
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return Response.json(
        {
          status_code: 400,
          message_th: "กรุณาระบุ user_id",
          message_en: "user_id is required",
          data: null,
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          status_code: 400,
          message_th: parsed.error.errors[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
          message_en: "Invalid input",
          data: null,
        },
        { status: 400 },
      );
    }

    // ✨ ตรวจว่า profile ครูมีอยู่จริง
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) {
      return Response.json(
        {
          status_code: 404,
          message_th: "ไม่พบผู้ใช้",
          message_en: "User not found",
          data: null,
        },
        { status: 404 },
      );
    }

    // ✨ เปลี่ยนรหัสผ่านผ่าน Supabase Admin (service role)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: parsed.data.new_password,
    });

    if (error) {
      console.error(
        "❌ [employee/change-password] Supabase error:",
        error.message,
      );
      return Response.json(
        {
          status_code: 400,
          message_th: "เปลี่ยนรหัสผ่านไม่สำเร็จ",
          message_en: error.message,
          data: null,
        },
        { status: 400 },
      );
    }

    return Response.json({
      status_code: 200,
      message_th: "เปลี่ยนรหัสผ่านสำเร็จ",
      message_en: "Password changed successfully",
      data: null,
    });
  } catch (err) {
    console.error("❌ [employee/account-setting/change-password]:", err);
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
