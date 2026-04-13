import { prisma } from "@/lib/prisma";
import { z } from "zod";

const querySchema = z.object({
  keyword: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  page_size: z.coerce.number().min(1).max(50).default(12),
});

// ✨ GET /api/v1/blogs/read — ดึงรายการบทความ PUBLISHED พร้อม filter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      keyword: searchParams.get("keyword") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      page_size: searchParams.get("page_size") ?? undefined,
    });

    if (!parsed.success) {
      return Response.json({ status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid params", data: null }, { status: 400 });
    }

    const { keyword, category, page, page_size } = parsed.data;
    const skip = (page - 1) * page_size;

    const where = {
      status: "PUBLISHED" as const,
      ...(category && { category }),
      ...(keyword && {
        OR: [
          { title: { contains: keyword, mode: "insensitive" as const } },
          { excerpt: { contains: keyword, mode: "insensitive" as const } },
        ],
      }),
    };

    const [total, blogs] = await Promise.all([
      prisma.blog.count({ where }),
      prisma.blog.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          category: true,
          coverImageUrl: true,
          publishedAt: true,
          tags: true,
          author: {
            select: { firstName: true, lastName: true, profileImageUrl: true },
          },
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip,
        take: page_size,
      }),
    ]);

    // ✨ ประมาณเวลาอ่านจากความยาว content (fallback ใช้ excerpt)
    const formatted = blogs.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt ?? "",
      category: b.category ?? "ทั่วไป",
      coverImageUrl: b.coverImageUrl,
      publishedAt: b.publishedAt?.toISOString() ?? null,
      tags: b.tags ? JSON.parse(b.tags) : [],
      author: b.author
        ? `${b.author.firstName ?? ""} ${b.author.lastName ?? ""}`.trim() || "ทีมงาน KAM"
        : "ทีมงาน KAM",
      authorImageUrl: b.author?.profileImageUrl ?? null,
    }));

    return Response.json({
      status_code: 200,
      message_th: "ดึงบทความสำเร็จ",
      message_en: "Blogs fetched",
      data: { blogs: formatted, total, page, page_size, total_pages: Math.ceil(total / page_size) },
    });
  } catch (error) {
    console.error("❌ [GET /api/v1/blogs/read]", error);
    return Response.json({ status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null }, { status: 500 });
  }
}
