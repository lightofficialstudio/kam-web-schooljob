import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createApplicationSchema = z.object({
  user_id: z.string().min(1),
  job_id: z.string().min(1),
  cover_letter: z.string().optional(),
  resume_id: z.string().optional(),
});

// ✨ POST /api/v1/employee/applications/create — สมัครงาน
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { status_code: 400, message_th: "ข้อมูลไม่ถูกต้อง", message_en: "Invalid input", data: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { user_id, job_id, cover_letter, resume_id } = parsed.data;

    // ✨ ดึง profile id
    const profile = await prisma.profile.findUnique({
      where: { userId: user_id },
      select: { id: true, role: true },
    });

    if (!profile) {
      return Response.json(
        { status_code: 404, message_th: "ไม่พบข้อมูลผู้ใช้", message_en: "Profile not found", data: null },
        { status: 404 },
      );
    }

    if (profile.role !== "EMPLOYEE") {
      return Response.json(
        { status_code: 403, message_th: "เฉพาะครูเท่านั้นที่สมัครงานได้", message_en: "Only EMPLOYEE can apply", data: null },
        { status: 403 },
      );
    }

    // ✨ ตรวจสอบว่า job มีอยู่
    const job = await prisma.job.findFirst({
      where: { id: job_id, status: "OPEN" },
      select: { id: true },
    });

    if (!job) {
      return Response.json(
        { status_code: 404, message_th: "ไม่พบประกาศงานหรือปิดรับสมัครแล้ว", message_en: "Job not found or closed", data: null },
        { status: 404 },
      );
    }

    // ✨ ป้องกันสมัครซ้ำ
    const existing = await prisma.application.findFirst({
      where: { jobId: job_id, applicantId: profile.id },
    });

    if (existing) {
      return Response.json(
        { status_code: 409, message_th: "คุณสมัครงานนี้ไปแล้ว", message_en: "Already applied", data: null },
        { status: 409 },
      );
    }

    const application = await prisma.application.create({
      data: {
        jobId: job_id,
        applicantId: profile.id,
        coverLetter: cover_letter ?? null,
        resumeId: resume_id ?? null,
        status: "PENDING",
      },
      select: { id: true, status: true, appliedAt: true },
    });

    return Response.json(
      { status_code: 201, message_th: "ส่งใบสมัครสำเร็จ", message_en: "Application submitted", data: application },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ [POST /api/v1/employee/applications/create]", error);
    return Response.json(
      { status_code: 500, message_th: "เกิดข้อผิดพลาดภายในระบบ", message_en: "Internal server error", data: null },
      { status: 500 },
    );
  }
}
