import { NextRequest, NextResponse } from "next/server";
import { authService } from "../../service/authenticate-service";
import { signinSchema } from "../../validation/authenticate-schema";

// ✨ [API สำหรับการเข้าสู่ระบบ (Signin)]
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. ✨ [ตรวจสอบข้อมูลตาม Schema]
    const validatedData = signinSchema.parse(body);

    // 2. ✨ [เรียกใช้ Service เพื่อเข้าสู่ระบบ]
    const data = await authService.signin(validatedData);

    return NextResponse.json(
      {
        status_code: 200,
        message_th: "เข้าสู่ระบบสำเร็จ",
        message_en: "Login successful",
        data: {
          user_id: data.user?.id,
          email: data.user?.email,
          role: data.user?.user_metadata?.role,
          full_name: data.user?.user_metadata?.full_name,
        },
      },
      { status: 200 },
    );
  } catch (err: any) {
    // ✨ [จัดการกรณี validation error หรือ supabase auth error]
    return NextResponse.json(
      {
        status_code: 401,
        message_th: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        message_en: "Invalid email or password",
        data: null,
      },
      { status: 401 },
    );
  }
}
