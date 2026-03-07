import { supabase } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// 🔍 [DEBUG ONLY - เช็ก email confirmation status]
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    console.log("🔍 [DEBUG] Checking email confirmation status for:", email);

    // ⚠️ ต้องใช้ Admin API (ต้อง admin key)
    // ส่วนนี้จะ fail เพราะ client ไม่มี admin access
    // แต่จะแสดง error message ที่ helpful

    // Alternative: ลองเข้าสแบบ normal user
    const { data, error } = await supabase.auth.signUp({
      email,
      password: "temp",
      options: {
        data: { debug: true },
      },
    });

    if (error?.message.includes("already registered")) {
      console.log("✅ User exists in database");
      return NextResponse.json(
        {
          status_code: 200,
          message: "User exists but may need email confirmation",
          debug_info: {
            user_exists: true,
            email: email,
            next_step: "Try signin - if fails, email may need confirmation",
          },
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        status_code: 400,
        message: error?.message || "Unable to check user status",
      },
      { status: 400 },
    );
  } catch (error: any) {
    console.error("❌ [DEBUG] Error:", error);
    return NextResponse.json(
      {
        status_code: 500,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
