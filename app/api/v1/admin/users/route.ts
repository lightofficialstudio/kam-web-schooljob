import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 🔍 [ดึงข้อมูล User ทั้งหมด (Admin เท่านั้น)]
export async function GET() {
  try {
    console.log("📊 [ADMIN] Fetching all users...");

    // ✨ [ดึง Profile ทั้งหมด]
    const profiles = await prisma.profile.findMany({
      select: {
        id: true,
        userId: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`✅ [ADMIN] Found ${profiles.length} users`);

    return NextResponse.json(
      {
        status_code: 200,
        message_th: "ดึงข้อมูล User สำเร็จ",
        message_en: "Fetched users successfully",
        data: {
          total: profiles.length,
          users: profiles,
        },
      },
      { status: 200 },
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
      { status: 500 },
    );
  }
}
