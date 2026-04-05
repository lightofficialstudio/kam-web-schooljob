import { prisma } from "@/lib/prisma";
import { JobStatus } from "@prisma/client";
import { CreateJobInput, UpdateJobInput } from "../validation/job-schema";

// ✨ ค้นหา SchoolProfile จาก userId เพื่อเอา schoolProfileId
const getSchoolProfileId = async (userId: string): Promise<string> => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { schoolProfile: { select: { id: true } } },
  });
  if (!profile?.schoolProfile) {
    throw new Error("SCHOOL_PROFILE_NOT_FOUND");
  }
  return profile.schoolProfile.id;
};

// ✨ ดึงข้อมูลประกาศงานทั้งหมดของโรงเรียน โดยใช้ userId
export const getJobsByUserService = async (userId: string) => {
  const schoolProfileId = await getSchoolProfileId(userId);
  return await prisma.job.findMany({
    where: { schoolProfileId },
    include: {
      jobSubjects: true,
      jobGrades: true,
      jobBenefits: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// ✨ ดึงข้อมูลประกาศงานตาม ID (ตรวจสอบ ownership ด้วย userId)
export const getJobByIdService = async (userId: string, jobId: string) => {
  const schoolProfileId = await getSchoolProfileId(userId);
  return await prisma.job.findFirst({
    where: { id: jobId, schoolProfileId },
    include: {
      jobSubjects: true,
      jobGrades: true,
      jobBenefits: true,
    },
  });
};

// ✨ สร้างประกาศงานใหม่พร้อม subjects, grades, benefits ใน Transaction เดียว
export const createJobService = async (
  userId: string,
  payload: CreateJobInput,
) => {
  const schoolProfileId = await getSchoolProfileId(userId);

  return await prisma.$transaction(async (tx) => {
    // คำนวณ deadline จาก deadline_days
    const deadline = payload.deadline_days
      ? new Date(Date.now() + payload.deadline_days * 24 * 60 * 60 * 1000)
      : null;

    const job = await tx.job.create({
      data: {
        schoolProfileId,
        title: payload.title,
        jobType: payload.employment_type ?? null,
        positionsAvailable: payload.vacancy_count ?? 1,
        salaryMin: payload.salary_min ?? null,
        salaryMax: payload.salary_max ?? null,
        salaryNegotiable: payload.salary_negotiable ?? false,
        description: payload.description ?? null,
        province: payload.province,
        district: payload.area ?? null,
        deadline,
        status: payload.is_published ? JobStatus.OPEN : JobStatus.DRAFT,
        // licenseRequired จาก license field
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
        data: payload.subjects.map((subject) => ({ jobId: job.id, subject })),
      });
    }

    // ✨ สร้าง grades
    if (payload.grades && payload.grades.length > 0) {
      await tx.jobGrade.createMany({
        data: payload.grades.map((grade) => ({ jobId: job.id, grade })),
      });
    }

    // ✨ สร้าง benefits
    if (payload.benefits && payload.benefits.length > 0) {
      await tx.jobBenefit.createMany({
        data: payload.benefits.map((benefit) => ({ jobId: job.id, benefit })),
      });
    }

    return await tx.job.findUnique({
      where: { id: job.id },
      include: { jobSubjects: true, jobGrades: true, jobBenefits: true },
    });
  });
};

// ✨ อัปเดตประกาศงาน (replace strategy สำหรับ subjects/grades/benefits)
export const updateJobService = async (
  userId: string,
  jobId: string,
  payload: UpdateJobInput,
) => {
  const schoolProfileId = await getSchoolProfileId(userId);

  // ตรวจสอบว่า job เป็นของโรงเรียนนี้
  const existing = await prisma.job.findFirst({
    where: { id: jobId, schoolProfileId },
  });
  if (!existing) throw new Error("JOB_NOT_FOUND");

  return await prisma.$transaction(async (tx) => {
    const deadline =
      payload.deadline_days !== undefined
        ? payload.deadline_days
          ? new Date(Date.now() + payload.deadline_days * 24 * 60 * 60 * 1000)
          : null
        : existing.deadline;

    await tx.job.update({
      where: { id: jobId },
      data: {
        ...(payload.title !== undefined && { title: payload.title }),
        ...(payload.employment_type !== undefined && {
          jobType: payload.employment_type ?? null,
        }),
        ...(payload.vacancy_count !== undefined && {
          positionsAvailable: payload.vacancy_count,
        }),
        ...(payload.salary_min !== undefined && {
          salaryMin: payload.salary_min ?? null,
        }),
        ...(payload.salary_max !== undefined && {
          salaryMax: payload.salary_max ?? null,
        }),
        ...(payload.salary_negotiable !== undefined && {
          salaryNegotiable: payload.salary_negotiable,
        }),
        ...(payload.description !== undefined && {
          description: payload.description ?? null,
        }),
        ...(payload.province !== undefined && { province: payload.province }),
        ...(payload.area !== undefined && { district: payload.area ?? null }),
        ...(payload.is_published !== undefined && {
          status: payload.is_published ? JobStatus.OPEN : JobStatus.DRAFT,
        }),
        ...(payload.license !== undefined && {
          licenseRequired:
            payload.license === "จำเป็นต้องมี" ? "required" : "not_required",
        }),
        deadline,
      },
    });

    // ✨ Replace subjects
    if (payload.subjects !== undefined) {
      await tx.jobSubject.deleteMany({ where: { jobId } });
      if (payload.subjects.length > 0) {
        await tx.jobSubject.createMany({
          data: payload.subjects.map((subject) => ({ jobId, subject })),
        });
      }
    }

    // ✨ Replace grades
    if (payload.grades !== undefined) {
      await tx.jobGrade.deleteMany({ where: { jobId } });
      if (payload.grades.length > 0) {
        await tx.jobGrade.createMany({
          data: payload.grades.map((grade) => ({ jobId, grade })),
        });
      }
    }

    // ✨ Replace benefits
    if (payload.benefits !== undefined) {
      await tx.jobBenefit.deleteMany({ where: { jobId } });
      if (payload.benefits.length > 0) {
        await tx.jobBenefit.createMany({
          data: payload.benefits.map((benefit) => ({ jobId, benefit })),
        });
      }
    }

    return await tx.job.findUnique({
      where: { id: jobId },
      include: { jobSubjects: true, jobGrades: true, jobBenefits: true },
    });
  });
};
