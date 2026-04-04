import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// ✨ [Supabase Admin Client — ใช้ SERVICE_ROLE_KEY เพื่อเข้าถึง auth.users]
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// 🔍 [ดึงข้อมูล User ทั้งหมดจาก auth.users (Admin เท่านั้น)]
export async function GET() {
  try {
    console.log("📊 [ADMIN] Fetching all users...");

    // ✨ [ดึง auth.users ทั้งหมดผ่าน Admin API]
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (error) throw new Error(error.message);

    // ✨ [Map ข้อมูลให้ตรงกับ UserRecord interface ของ page]
    const users = data.users.map((user) => ({
      id: user.id,
      userId: user.id,
      email: user.email ?? "",
      fullName:
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        null,
      role:
        (user.user_metadata?.role as "EMPLOYEE" | "EMPLOYER" | "ADMIN") ??
        "EMPLOYEE",
      createdAt: user.created_at,
      updatedAt: user.updated_at ?? user.created_at,
    }));

    console.log(`✅ [ADMIN] Found ${users.length} users`);

    return NextResponse.json(
      {
        status_code: 200,
        message_th: "ดึงข้อมูล User สำเร็จ",
        message_en: "Fetched users successfully",
        data: {
          total: users.length,
          users,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ [ADMIN] Error fetching users:", errorMessage);

    return NextResponse.json(
      {
        status_code: 500,
        message_th: "ไม่สามารถดึงข้อมูล User ได้",
        message_en: "Failed to fetch users",
        data: null,
      },
      { status: 500 }
    );
  }
}
