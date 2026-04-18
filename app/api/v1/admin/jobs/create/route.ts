import { prisma } from "@/lib/prisma";
import { JobStatus } from "@prisma/client";
import { createJobSchema } from "@/app/api/v1/employer/jobs/validation/job-schema";

// ✨ POST /api/v1/admin/jobs/create?admin_user_id=xxx&school_profile_id=xxx
// Admin สร้างประกาศงานแทนโรงเรียนใดก็ได้ในระบบ
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUserId = searchParams.get("admin_user_id");
    const schoolProfileId = searchParams.get("school_profile_id");

    // ✨ ตรวจสอบ query params ครบถ้วน
    if (!adminUserId) {
      return Response.json(
        {
          status_code: 400,
          message_th: "กรุณาระบุ admin_user_id",
          message_en: "admin_user_id is required",
          data: null,
        },
        { status: 400 },
      );
    }

    if (!schoolProfileId) {
      return Response.json(
        {
          status_code: 400,
          message_th: "กรุณาระบุ school_profile_id",
          message_en: "school_profile_id is required",
          data: null,
        },
        { status: 400 },
      );
    }

    // ✨ ตรวจสอบ role ว่าเป็น ADMIN จริง
    const adminProfile = await prisma.profile.findUnique({
      where: { userId: adminUserId },
      select: { role: true },
    });

    if (!adminProfile) {
      return Response.json(
        {
          status_code: 404,
          message_th: "ไม่พบผู้ใช้งาน",
          message_en: "User not found",
          data: null,
        },
        { status: 404 },
      );
    }

    if (adminProfile.role !== "ADMIN") {
      return Response.json(
        {
          status_code: 403,
          message_th: "คุณไม่มีสิทธิ์ดำเนินการนี้ (ต้องเป็น ADMIN เท่านั้น)",
          message_en: "Not authorized — ADMIN role required",
          data: null,
        },
        { status: 403 },
      );
    }

    // ✨ ตรวจสอบ body payload ด้วย Zod schema เดียวกับ employer
    const body = await request.json();
    const parsed = createJobSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          status_code: 400,
          message_th: "ข้อมูลไม่ถูกต้อง",
          message_en: "Invalid request body",
          data: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const payload = parsed.data;

    // ✨ สร้างประกาศงานพร้อม subjects, grades, benefits ใน Transaction เดียว
    const job = await prisma.$transaction(async (tx) => {
      // คำนวณ deadline จาก deadline_days
      const deadline = payload.deadline_days
        ? new Date(Date.now() + payload.deadline_days * 24 * 60 * 60 * 1000)
        : null;

      const newJob = await tx.job.create({
        data: {
          schoolProfileId,
          title: payload.title,
          jobType: payload.employment_type ?? null,
          positionsAvailable: payload.vacancy_count ?? 1,
          salaryMin: payload.salary_min ?? null,
          salaryMax: payload.salary_max ?? null,
          salaryNegotiable: payload.salary_negotiable ?? false,
          description: payload.description ?? null,
          educationLevel: payload.education_level ?? null,
          experience: payload.experience ?? null,
          qualifications: payload.qualifications ?? null,
          gender: payload.gender ?? null,
          province: payload.province,
          district: payload.area ?? null,
          deadline,
          status: payload.is_published ? JobStatus.OPEN : JobStatus.DRAFT,
          // ✨ แปลง license field เป็น enum
          licenseRequired:
            payload.license === "จำเป็นต้องมี"
              ? "required"
              : payload.license === "ไม่จำเป็น"
                ? "not_required"
                : "not_required",
        },
      });

      // ✨ สร้าง subjects
      if (payload.subjects && payload.subjects.length > 0) {
        await tx.jobSubject.createMany({
          data: payload.subjects.map((subject) => ({
            jobId: newJob.id,
            subject,
          })),
        });
      }

      // ✨ สร้าง grades
      if (payload.grades && payload.grades.length > 0) {
        await tx.jobGrade.createMany({
          data: payload.grades.map((grade) => ({ jobId: newJob.id, grade })),
        });
      }

      // ✨ สร้าง benefits
      if (payload.benefits && payload.benefits.length > 0) {
        await tx.jobBenefit.createMany({
          data: payload.benefits.map((benefit) => ({
            jobId: newJob.id,
            benefit,
          })),
        });
      }

      return await tx.job.findUnique({
        where: { id: newJob.id },
        include: { jobSubjects: true, jobGrades: true, jobBenefits: true },
      });
    });

    return Response.json(
      {
        status_code: 201,
        message_th: "สร้างประกาศงานสำเร็จ",
        message_en: "Job created successfully",
        data: job,
      },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ [admin/jobs/create]", err);

    if (message === "NOT_ADMIN") {
      return Response.json(
        {
          status_code: 403,
          message_th: "คุณไม่มีสิทธิ์ดำเนินการนี้",
          message_en: "Not authorized",
          data: null,
        },
        { status: 403 },
      );
    }

    return Response.json(
      {
        status_code: 500,
        message_th: "เกิดข้อผิดพลาดภายในระบบ",
        message_en: "Internal server error",
        data: null,
      },
      { status: 500 },
    );
  }
}
