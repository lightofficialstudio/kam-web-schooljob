import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ✨ GET /api/v1/admin/blogs/stats — สถิติการดูบทความสำหรับ Admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blog_id"); // ถ้าระบุ → stats รายบทความ

    const now = new Date();
    const start7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const start30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (blogId) {
      // ─── Stats รายบทความ ───
      const [totalViews, views7d, views30d, dailyRaw, referrerRaw] = await Promise.all([
        // ยอดรวมทั้งหมด
        prisma.blogView.count({ where: { blogId } }),
        // 7 วันล่าสุด
        prisma.blogView.count({ where: { blogId, viewedAt: { gte: start7d } } }),
        // 30 วันล่าสุด
        prisma.blogView.count({ where: { blogId, viewedAt: { gte: start30d } } }),
        // รายวัน 14 วันย้อนหลัง
        prisma.$queryRaw<{ day: string; count: bigint }[]>`
          SELECT
            TO_CHAR(viewed_at, 'YYYY-MM-DD') AS day,
            COUNT(*) AS count
          FROM blog_views
          WHERE blog_id = ${blogId}
            AND viewed_at >= NOW() - INTERVAL '14 days'
          GROUP BY day
          ORDER BY day ASC
        `,
        // top referrers
        prisma.$queryRaw<{ referrer: string | null; count: bigint }[]>`
          SELECT referrer, COUNT(*) AS count
          FROM blog_views
          WHERE blog_id = ${blogId}
            AND viewed_at >= NOW() - INTERVAL '30 days'
          GROUP BY referrer
          ORDER BY count DESC
          LIMIT 10
        `,
      ]);

      // ✨ สร้าง 14 วันครบ
      const days14: { day: string; views: number }[] = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().slice(0, 10);
        const found = dailyRaw.find((r) => r.day === key);
        days14.push({ day: key, views: Number(found?.count ?? 0) });
      }

      return NextResponse.json({
        status_code: 200,
        message_th: "ดึงสถิติบทความสำเร็จ",
        message_en: "Blog stats fetched",
        data: {
          blogId,
          totalViews,
          views7d,
          views30d,
          dailyChart: days14,
          topReferrers: referrerRaw.map((r) => ({
            referrer: r.referrer ?? "Direct",
            count: Number(r.count),
          })),
        },
      });
    }

    // ─── Overview stats (ทุกบทความ) ───
    const [
      totalViews,
      views7d,
      topBlogsRaw,
      dailyRaw,
      categoryRaw,
    ] = await Promise.all([
      // ยอดรวม
      prisma.blogView.count(),
      // 7 วัน
      prisma.blogView.count({ where: { viewedAt: { gte: start7d } } }),
      // Top 10 บทความ (30 วัน)
      prisma.$queryRaw<{ blog_id: string; title: string; count: bigint }[]>`
        SELECT bv.blog_id, b.title, COUNT(*) AS count
        FROM blog_views bv
        JOIN blogs b ON b.id = bv.blog_id
        WHERE bv.viewed_at >= NOW() - INTERVAL '30 days'
        GROUP BY bv.blog_id, b.title
        ORDER BY count DESC
        LIMIT 10
      `,
      // รายวัน 30 วัน
      prisma.$queryRaw<{ day: string; count: bigint }[]>`
        SELECT
          TO_CHAR(viewed_at, 'YYYY-MM-DD') AS day,
          COUNT(*) AS count
        FROM blog_views
        WHERE viewed_at >= NOW() - INTERVAL '30 days'
        GROUP BY day
        ORDER BY day ASC
      `,
      // views by category (30 วัน)
      prisma.$queryRaw<{ category: string | null; count: bigint }[]>`
        SELECT b.category, COUNT(*) AS count
        FROM blog_views bv
        JOIN blogs b ON b.id = bv.blog_id
        WHERE bv.viewed_at >= NOW() - INTERVAL '30 days'
        GROUP BY b.category
        ORDER BY count DESC
      `,
    ]);

    // ✨ สร้าง 30 วันครบ
    const days30: { day: string; views: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      const found = dailyRaw.find((r) => r.day === key);
      days30.push({ day: key, views: Number(found?.count ?? 0) });
    }

    return NextResponse.json({
      status_code: 200,
      message_th: "ดึงสถิติบทความสำเร็จ",
      message_en: "Blog stats fetched",
      data: {
        totalViews,
        views7d,
        views30d: Number(dailyRaw.reduce((s, r) => s + Number(r.count), 0)),
        dailyChart: days30,
        topBlogs: topBlogsRaw.map((r) => ({
          blogId: r.blog_id,
          title: r.title,
          views: Number(r.count),
        })),
        byCategory: categoryRaw.map((r) => ({
          category: r.category ?? "ไม่มีหมวดหมู่",
          views: Number(r.count),
        })),
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ [GET /api/v1/admin/blogs/stats]", msg);
    return NextResponse.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาด", message_en: msg, data: null },
      { status: 500 },
    );
  }
}
