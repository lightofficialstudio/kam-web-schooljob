import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

/**
 * 🔧 [PUT /api/v1/admin/users/[id]] - อัปเดต user role
 * ใช้สำหรับอัปเดต role ของ user ใน Supabase
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json(
        { message_th: "ต้องระบุ role" },
        { status: 400 },
      );
    }

    console.log(`🔧 [UPDATE USER] Updating user ${id} role to ${role}`);

    // ✨ [อัปเดต user metadata ใน Supabase]
    const { data, error } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: { role },
    });

    if (error) {
      console.error("❌ [UPDATE USER] Error:", error.message);
      return NextResponse.json(
        { message_th: error.message || "เกิดข้อผิดพลาดในการอัปเดต user" },
        { status: 500 },
      );
    }

    console.log(`✅ [UPDATE USER] User ${id} updated successfully`);

    return NextResponse.json(
      {
        status_code: 200,
        message_th: "อัปเดต role สำเร็จ",
        data: {
          user_id: data.user.id,
          email: data.user.email,
          role: data.user.user_metadata?.role,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error("❌ [UPDATE USER] Error:", errorMessage);
    return NextResponse.json({ message_th: errorMessage }, { status: 500 });
  }
}
