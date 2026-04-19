import { authService } from "@/app/api/v1/authenticate/service/authenticate-service";
import { signupSchema } from "@/app/api/v1/authenticate/validation/authenticate-schema";
import { NextRequest, NextResponse } from "next/server";

// ✨ [API สำหรับการสมัครสมาชิก (Signup)]
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📝 Signup request body:", body);

    // 1. ✨ [ตรวจสอบข้อมูลตาม Schema]
    const validatedData = signupSchema.parse(body);
    console.log("✅ Validation passed:", validatedData);

    // 2. ✨ [เรียกใช้ Service เพื่อสมัครสมาชิก]
    const user = await authService.signup(validatedData);
    console.log("🎉 User created:", user?.id, user?.email);

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
          first_name: validatedData.first_name,
          last_name: validatedData.last_name,
        },
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    // ✨ [จัดการกรณี validation error หรือ supabase error]
    const errorMessage =
      err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการสมัครสมาชิก";

    console.error("❌ Signup error:", {
      message: errorMessage,
      fullError: err,
    });

    return NextResponse.json(
      {
        status_code: 400,
        message_th: errorMessage,
        message_en: errorMessage,
        data: null,
      },
      { status: 400 },
    );
  }
}
