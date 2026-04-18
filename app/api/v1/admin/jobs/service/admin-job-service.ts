import { prisma } from "@/lib/prisma";
import { JobStatus } from "@prisma/client";

// ✨ บันทึก Audit Log ของ Admin
export const createAuditLog = async (input: {
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  targetLabel?: string;
  note?: string;
  metadata?: object;
}) => {
  return prisma.adminAuditLog.create({
    data: {
      adminId:     input.adminId,
      action:      input.action,
      targetType:  input.targetType,
      targetId:    input.targetId,
      targetLabel: input.targetLabel,
      note:        input.note,
      metadata:    input.metadata ? JSON.stringify(input.metadata) : null,
    },
  });
};

// ✨ ดึง profileId ของ Admin จาก userId
const getAdminProfileId = async (userId: string): Promise<string> => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { id: true, role: true },
  });
  if (!profile || profile.role !== "ADMIN") throw new Error("UNAUTHORIZED");
  return profile.id;
};

// ✨ ดึงประกาศงานทั้งระบบ (Admin) พร้อม filter + pagination
export const adminGetAllJobsService = async (params: {
  adminUserId: string;
  keyword?: string;
  status?: string;
  province?: string;
  schoolProfileId?: string;
  page: number;
  pageSize: number;
}) => {
  const { keyword, status, province, schoolProfileId, page, pageSize } = params;

  const where: Parameters<typeof prisma.job.findMany>[0]["where"] = {};
  if (status && ["OPEN", "CLOSED", "DRAFT"].includes(status)) {
    where.status = status as JobStatus;
  }
  if (province) where.province = { contains: province, mode: "insensitive" };
  if (schoolProfileId) where.schoolProfileId = schoolProfileId;
  if (keyword) {
    where.OR = [
      { title:       { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const [total, jobs] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        schoolProfile: {
          select: { id: true, schoolName: true, province: true, logoUrl: true },
        },
        jobSubjects: { select: { subject: true } },
        jobGrades:   { select: { grade: true } },
        _count:      { select: { applications: true } },
      },
    }),
  ]);

  return { jobs, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
};

// ✨ เปลี่ยนสถานะประกาศงาน (OPEN/CLOSED/DRAFT) โดย Admin
export const adminUpdateJobStatusService = async (
  adminUserId: string,
  jobId: string,
  status: JobStatus,
  note?: string,
) => {
  const adminProfileId = await getAdminProfileId(adminUserId);

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, title: true, status: true },
  });
  if (!job) throw new Error("JOB_NOT_FOUND");

  const updated = await prisma.job.update({
    where: { id: jobId },
    data:  { status },
    select: { id: true, title: true, status: true },
  });

  await createAuditLog({
    adminId:     adminProfileId,
    action:      "UPDATE_JOB_STATUS",
    targetType:  "job",
    targetId:    jobId,
    targetLabel: job.title,
    note:        note ?? `เปลี่ยนสถานะจาก ${job.status} → ${status}`,
    metadata:    { before: job.status, after: status },
  });

  return updated;
};

// ✨ ลบประกาศงาน (hard delete) โดย Admin
export const adminDeleteJobService = async (
  adminUserId: string,
  jobId: string,
  note?: string,
) => {
  const adminProfileId = await getAdminProfileId(adminUserId);

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, title: true, schoolProfileId: true },
  });
  if (!job) throw new Error("JOB_NOT_FOUND");

  await prisma.job.delete({ where: { id: jobId } });

  await createAuditLog({
    adminId:     adminProfileId,
    action:      "DELETE_JOB",
    targetType:  "job",
    targetId:    jobId,
    targetLabel: job.title,
    note:        note ?? "ลบโดย Admin",
  });

  return { id: jobId };
};

// ✨ ดึง Audit Logs ทั้งหมด (Admin) พร้อม filter + pagination
export const adminGetAuditLogsService = async (params: {
  adminUserId?: string;
  targetType?: string;
  targetId?: string;
  action?: string;
  page: number;
  pageSize: number;
}) => {
  const { adminUserId, targetType, targetId, action, page, pageSize } = params;

  const where: Parameters<typeof prisma.adminAuditLog.findMany>[0]["where"] = {};

  if (action)     where.action     = { contains: action, mode: "insensitive" };
  if (targetType) where.targetType = targetType;
  if (targetId)   where.targetId   = targetId;

  if (adminUserId) {
    const profile = await prisma.profile.findUnique({
      where: { userId: adminUserId },
      select: { id: true },
    });
    if (profile) where.adminId = profile.id;
  }

  const [total, logs] = await Promise.all([
    prisma.adminAuditLog.count({ where }),
    prisma.adminAuditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip:    (page - 1) * pageSize,
      take:    pageSize,
      include: {
        admin: { select: { id: true, firstName: true, lastName: true, email: true, profileImageUrl: true } },
      },
    }),
  ]);

  return { logs, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
};
