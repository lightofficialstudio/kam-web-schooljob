import { prisma } from "@/lib/prisma";
import { CreateBlogInput, ListBlogQueryInput, UpdateBlogInput } from "../validation/blog-schema";

export class AdminBlogService {
  // ✨ ดึงรายการบทความทั้งหมด (รวม DRAFT) สำหรับ admin
  async listBlogs(input: ListBlogQueryInput) {
    const { keyword, category, status, page, page_size } = input;
    const skip = (page - 1) * page_size;

    const where = {
      ...(status !== "all" && { status: status as "DRAFT" | "PUBLISHED" }),
      ...(category && { category }),
      ...(keyword && {
        OR: [
          { title: { contains: keyword, mode: "insensitive" as const } },
          { excerpt: { contains: keyword, mode: "insensitive" as const } },
          { slug: { contains: keyword, mode: "insensitive" as const } },
        ],
      }),
    };

    const [total, blogs] = await Promise.all([
      prisma.blog.count({ where }),
      prisma.blog.findMany({
        where,
        // ✨ ใช้ include แทน select เพื่อให้ _count ทำงานได้
        include: {
          author: {
            select: { id: true, firstName: true, lastName: true, profileImageUrl: true },
          },
          _count: { select: { blogViews: true } },
        },
        orderBy: [{ updatedAt: "desc" }],
        skip,
        take: page_size,
      }),
    ]);

    const formatted = blogs.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt ?? "",
      category: b.category ?? "",
      coverImageUrl: b.coverImageUrl ?? null,
      status: b.status,
      publishedAt: b.publishedAt?.toISOString() ?? null,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
      tags: b.tags ? JSON.parse(b.tags) : [],
      viewCount: b._count.blogViews,
      author: b.author
        ? {
            id: b.author.id,
            name: `${b.author.firstName ?? ""} ${b.author.lastName ?? ""}`.trim() || "ทีมงาน KAM",
            imageUrl: b.author.profileImageUrl ?? null,
          }
        : { id: null, name: "ทีมงาน KAM", imageUrl: null },
    }));

    return { blogs: formatted, total, page, page_size, total_pages: Math.ceil(total / page_size) };
  }

  // ✨ ดึงบทความ 1 ชิ้นโดย id สำหรับแก้ไข
  async getBlogById(id: string) {
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    if (!blog) throw new Error("ไม่พบบทความ");
    return {
      ...blog,
      tags: blog.tags ? JSON.parse(blog.tags) : [],
    };
  }

  // ✨ สร้างบทความใหม่
  async createBlog(input: CreateBlogInput) {
    // ✨ ตรวจ slug ซ้ำ
    const existing = await prisma.blog.findUnique({ where: { slug: input.slug } });
    if (existing) throw new Error("slug นี้ถูกใช้แล้ว");

    // ✨ แปลง author_id (Supabase UID) → Profile.id (Prisma UUID)
    // เนื่องจาก auth store เก็บ Supabase UID แต่ Blog.authorId อ้างอิง Profile.id
    let resolvedAuthorId: string | null = null;
    if (input.author_id) {
      const profile = await prisma.profile.findUnique({
        where: { userId: input.author_id },
        select: { id: true },
      });
      resolvedAuthorId = profile?.id ?? null;
    }

    const blog = await prisma.blog.create({
      data: {
        title: input.title,
        slug: input.slug,
        content: input.content,
        excerpt: input.excerpt ?? null,
        coverImageUrl: input.cover_image_url || null,
        category: input.category ?? null,
        tags: input.tags ? JSON.stringify(input.tags) : null,
        status: input.status,
        authorId: resolvedAuthorId,
        publishedAt: input.status === "PUBLISHED" ? new Date() : null,
      },
    });
    return blog;
  }

  // ✨ แก้ไขบทความ
  async updateBlog(input: UpdateBlogInput) {
    const { id, ...data } = input;

    // ✨ ตรวจ slug ซ้ำ (ยกเว้นตัวเอง)
    if (data.slug) {
      const existing = await prisma.blog.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });
      if (existing) throw new Error("slug นี้ถูกใช้แล้ว");
    }

    // ✨ ถ้าเปลี่ยน status เป็น PUBLISHED และยังไม่มี publishedAt → set ตอนนี้
    const current = await prisma.blog.findUnique({ where: { id }, select: { status: true, publishedAt: true } });
    const isPublishing = data.status === "PUBLISHED" && current?.status !== "PUBLISHED";

    // ✨ แปลง author_id (Supabase UID) → Profile.id ถ้ามีการส่งมา
    let resolvedAuthorId: string | null | undefined = undefined;
    if (data.author_id !== undefined) {
      if (data.author_id) {
        const profile = await prisma.profile.findUnique({
          where: { userId: data.author_id },
          select: { id: true },
        });
        resolvedAuthorId = profile?.id ?? null;
      } else {
        resolvedAuthorId = null;
      }
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.slug && { slug: data.slug }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
        ...(data.cover_image_url !== undefined && { coverImageUrl: data.cover_image_url || null }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.tags !== undefined && { tags: JSON.stringify(data.tags) }),
        ...(data.status && { status: data.status }),
        ...(resolvedAuthorId !== undefined && { authorId: resolvedAuthorId }),
        ...(isPublishing && !current?.publishedAt && { publishedAt: new Date() }),
      },
    });
    return blog;
  }

  // ✨ ลบบทความ
  async deleteBlog(id: string) {
    await prisma.blog.delete({ where: { id } });
  }
}

export const adminBlogService = new AdminBlogService();
