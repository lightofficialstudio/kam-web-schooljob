import { authService } from "@/app/api/v1/authenticate/service/authenticate-service";
import { signinSchema } from "@/app/api/v1/authenticate/validation/authenticate-schema";
import { NextRequest, NextResponse } from "next/server";

// ✨ [API สำหรับการเข้าสู่ระบบ (Signin)]
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. ✨ [ตรวจสอบข้อมูลตาม Schema]
    const validatedData = signinSchema.parse(body);

    // 2. ✨ [เรียกใช้ Service เพื่อเข้าสู่ระบบ]
    const result = await authService.signin(validatedData);

    return NextResponse.json(
      {
        status_code: 200,
        message_th: "เข้าสู่ระบบสำเร็จ",
        message_en: "Login successful",
        data: {
          user_id: result.user?.id,
          email: result.user?.email,
          role: result.profile?.role || "EMPLOYEE",
          full_name: result.profile?.fullName || "",
          school_name: result.profile?.schoolName || null, // ✨ ชื่อโรงเรียน — เฉพาะ EMPLOYER
          profile_image_url: result.profile?.profileImageUrl || null,
        },
      },
      { status: 200 },
    );
  } catch (err: any) {
    // ✨ [DEBUG: Log all error details]
    console.error("❌ Signin Error:", {
      message: err.message,
      code: err.code,
      status: err.status,
      statusCode: err.statusCode,
      fullError: err,
    });

    // ✨ [จัดการกรณี validation error หรือ supabase auth error]
    const message = err.message || "Invalid login credentials";

    return NextResponse.json(
      {
        status_code: 401,
        message_th: message,
        message_en: "Invalid email or password",
        data: null,
      },
      { status: 401 },
    );
  }
}
