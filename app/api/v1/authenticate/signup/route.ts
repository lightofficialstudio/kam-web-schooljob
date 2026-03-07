import { NextRequest, NextResponse } from "next/server";
import { authService } from "../../service/authenticate-service";
import { signupSchema } from "../../validation/authenticate-schema";

// ✨ [API สำหรับการสมัครสมาชิก (Signup)]
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. ✨ [ตรวจสอบข้อมูลตาม Schema]
    const validatedData = signupSchema.parse(body);

    // 2. ✨ [เรียกใช้ Service เพื่อสมัครสมาชิก]
    const user = await authService.signup(validatedData);

    return NextResponse.json(
      {
        status_code: 201,
        message_th: "สมัครสมาชิกสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน",
        message_en:
          "Registration successful. Please check your email for verification.",
        data: {
          user_id: user?.id,
          email: user?.email,
          full_name: validatedData.full_name,
          role: validatedData.role,
        },
      },
      { status: 201 },
    );
  } catch (err: any) {
    // ✨ [จัดการกรณี validation error หรือ supabase error]
    return NextResponse.json(
      {
        status_code: 400,
        message_th: err.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก",
        message_en: err.message || "An error occurred during registration",
        data: null,
      },
      { status: 400 },
    );
  }
}
