"use client";

import axios from "axios";

export interface AdminJob {
  id: string;
  title: string;
  status: "OPEN" | "CLOSED" | "DRAFT";
  province: string;
  jobType: string | null;
  positionsAvailable: number;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryNegotiable: boolean;
  deadline: string | null;
  createdAt: string;
  schoolProfile: {
    id: string;
    schoolName: string;
    province: string;
    logoUrl: string | null;
  };
  jobSubjects: { subject: string }[];
  jobGrades: { grade: string }[];
  _count: { applications: number };
}

export interface Applicant {
  id: string;
  status: "PENDING" | "INTERVIEW" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
  coverLetter: string | null;
  resume: { fileName: string; fileUrl: string } | null;
  applicant: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phoneNumber: string | null;
    profileImageUrl: string | null;
    teachingExperience: string | null;
    specialActivities: string | null;
    licenseStatus: string | null;
    canRelocate: boolean | null;
    specializations: { subject: string }[];
    gradeCanTeaches: { grade: string }[];
    educations: { level: string; institution: string; major: string | null; graduationYear: number | null }[];
    workExperiences: { jobTitle: string; companyName: string; startDate: string; endDate: string | null; inPresent: boolean }[];
    preferredProvinces: { province: string }[];
  };
}

export interface AuditLog {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  targetLabel: string | null;
  note: string | null;
  createdAt: string;
  admin: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    profileImageUrl: string | null;
  };
}

// ✨ ดึงประกาศงานทั้งระบบ
export const fetchAdminJobs = async (params: {
  adminUserId: string;
  keyword?: string;
  status?: string;
  province?: string;
  schoolProfileId?: string;
  page?: number;
  pageSize?: number;
}) => {
  const { data } = await axios.get("/api/v1/admin/jobs/read", {
    params: {
      admin_user_id:    params.adminUserId,
      keyword:          params.keyword || undefined,
      status:           params.status || undefined,
      province:         params.province || undefined,
      school_profile_id: params.schoolProfileId || undefined,
      page:             params.page ?? 1,
      page_size:        params.pageSize ?? 20,
    },
  });
  return data.data as {
    jobs: AdminJob[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

// ✨ เปลี่ยนสถานะประกาศงาน
export const fetchUpdateJobStatus = async (
  adminUserId: string,
  jobId: string,
  status: "OPEN" | "CLOSED" | "DRAFT",
  note?: string,
) => {
  const { data } = await axios.patch(
    `/api/v1/admin/jobs/update-status?admin_user_id=${adminUserId}`,
    { job_id: jobId, status, note },
  );
  return data;
};

// ✨ ลบประกาศงาน
export const fetchDeleteJob = async (adminUserId: string, jobId: string, note?: string) => {
  const { data } = await axios.delete("/api/v1/admin/jobs/delete", {
    params: { admin_user_id: adminUserId, job_id: jobId, note },
  });
  return data;
};

// ✨ ดึงผู้สมัครของ job (Admin — ไม่ต้องผ่าน ownership)
export const fetchAdminApplicants = async (adminUserId: string, jobId: string) => {
  const { data } = await axios.get("/api/v1/admin/jobs/applicants", {
    params: { admin_user_id: adminUserId, job_id: jobId },
  });
  return data.data as { job: { id: string; title: string }; applicants: Applicant[] };
};

// ✨ ดึง Audit Logs (รวมระบบ หรือ per-post ถ้าใส่ targetId)
export const fetchAuditLogs = async (params: {
  adminUserId?: string;
  targetType?: string;
  targetId?: string;
  action?: string;
  page?: number;
  pageSize?: number;
}) => {
  const { data } = await axios.get("/api/v1/admin/audit-logs", {
    params: {
      admin_user_id: params.adminUserId || undefined,
      target_type:   params.targetType || undefined,
      target_id:     params.targetId || undefined,
      action:        params.action || undefined,
      page:          params.page ?? 1,
      page_size:     params.pageSize ?? 20,
    },
  });
  return data.data as {
    logs: AuditLog[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

// ✨ ดึง Audit Logs เฉพาะ Post นั้น ๆ (per-post timeline)
export const fetchAuditLogsByJob = async (jobId: string, page = 1) => {
  return fetchAuditLogs({ targetType: "job", targetId: jobId, page, pageSize: 50 });
};
