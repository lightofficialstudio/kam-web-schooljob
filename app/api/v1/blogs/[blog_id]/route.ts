import { prisma } from "@/lib/prisma";

// ✨ GET /api/v1/blogs/[blog_id] — ดึงบทความตาม ID หรือ slug
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ blog_id: string }> },
) {
  try {
    const { blog_id } = await params;

    // ✨ ลองหาด้วย id ก่อน ถ้าไม่พบให้ลอง slug
    const blog = await prisma.blog.findFirst({
      where: {
        OR: [{ id: blog_id }, { slug: blog_id }],
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            specialActivities: true,
          },
        },
      },
    });

    if (!blog) {
      return Response.json(
        { status_code: 404, message_th: "ไม่พบบทความ", message_en: "Blog not found", data: null },
        { status: 404 },
      );
    }

    // ✨ ดึงบทความที่เกี่ยวข้อง (category เดียวกัน ยกเว้นตัวเอง)
    const related = await prisma.blog.findMany({
      where: {
        status: "PUBLISHED",
        category: blog.category ?? undefined,
        NOT: { id: blog.id },
      },
      select: { id: true, title: true, slug: true, category: true, coverImageUrl: true },
      take: 3,
      orderBy: { publishedAt: "desc" },
    });

    return Response.json({
      status_code: 200,
      message_th: "ดึงบทความสำเร็จ",
      message_en: "Blog fetched",
      data: {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt ?? "",
        content: blog.content,
        category: blog.category ?? "ทั่วไป",
        coverImageUrl: blog.coverImageUrl,
        publishedAt: blog.publishedAt?.toISOString() ?? null,
        tags: blog.tags ? JSON.parse(blog.tags) : [],
        author: blog.author
          ? `${blog.author.firstName ?? ""} ${blog.author.lastName ?? ""}`.trim() || "ทีมงาน KAM"
          : "ทีมงาน KAM",
        authorRole: blog.author?.specialActivities ?? "นักเขียน",
        authorImageUrl: blog.author?.profileImageUrl ?? null,
        related,
      },
    });
  } catch (error) {
    console.error("❌ [GET /api/v1/blogs/:id]", error);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 },
    );
  }
}
