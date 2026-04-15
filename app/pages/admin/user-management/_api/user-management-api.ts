import axios from "axios";

// ✨ UserRecord — ข้อมูลที่ merge จาก Supabase + Prisma (list view)
export interface UserRecord {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  role: "EMPLOYEE" | "EMPLOYER" | "ADMIN";
  phoneNumber: string | null;
  profileImageUrl: string | null;
  profileVisibility: string | null;
  licenseStatus: string | null;
  // ✨ Supabase Auth fields
  isEmailVerified: boolean;
  isBanned: boolean;
  provider: string;
  lastSignInAt: string | null;
  createdAt: string;
  updatedAt: string;
  // ✨ Prisma stats
  hasPrismaProfile: boolean;
  prismaProfileId: string | null;
  applicationCount: number;
  blogCount: number;
  // ✨ EMPLOYER
  schoolName: string | null;
  accountPlan: string | null;
  jobCount: number;
  orgMemberCount: number;
  province: string | null;
}

// ✨ Summary ที่ API ส่งกลับ
export interface UserSummary {
  total: number;
  byRole: { EMPLOYEE: number; EMPLOYER: number; ADMIN: number };
  byStatus: { active: number; unverified: number; banned: number; no_profile: number };
  providers: Record<string, number>;
  newLast30Days: number;
  newLast7Days: number;
}

// ✨ รายละเอียด User เต็ม (drawer)
export interface UserDetail {
  id: string;
  email: string;
  phone: string | null;
  isEmailVerified: boolean;
  emailConfirmedAt: string | null;
  isBanned: boolean;
  bannedUntil: string | null;
  provider: string;
  providers: string[];
  lastSignInAt: string | null;
  createdAt: string;
  updatedAt: string;
  supabaseMetadata: Record<string, unknown>;
  hasPrismaProfile: boolean;
  profile: {
    id: string;
    role: string;
    firstName: string | null;
    lastName: string | null;
    fullName: string | null;
    phoneNumber: string | null;
    profileImageUrl: string | null;
    profileVisibility: string | null;
    licenseStatus: string | null;
    teachingExperience: string | null;
    canRelocate: boolean | null;
    gender: string | null;
    dateOfBirth: string | null;
    nationality: string | null;
    recentSchool: string | null;
    specialActivities: string | null;
    specializations: string[];
    gradeCanTeaches: string[];
    preferredProvinces: string[];
    languages: { language: string; level: string }[];
    skills: { skill: string; level: string }[];
    workExperienceCount: number;
    educationCount: number;
  } | null;
  stats: {
    applicationCount: number;
    blogCount: number;
    jobCount: number;
    orgMemberCount: number;
  };
  schoolProfile: {
    id: string;
    schoolName: string;
    accountPlan: string;
    jobQuotaMax: number;
    province: string;
    recentJobs: {
      id: string;
      title: string;
      status: string;
      createdAt: string;
      deadline: string | null;
      _count: { applications: number };
    }[];
    orgMembers: { email: string; name: string; role: string; status: string }[];
    orgRoles: { name: string; permissions: string[] }[];
  } | null;
  recentApplications: {
    id: string;
    jobTitle: string;
    schoolName: string;
    status: string;
    appliedAt: string;
  }[];
  recentBlogs: { id: string; title: string; status: string; createdAt: string }[];
  auditTimeline: {
    timestamp: string;
    event: string;
    detail: string;
    type: "auth" | "profile" | "activity" | "system";
  }[];
}

const BASE = "/api/v1/admin/users";

// ✨ ดึงรายการ User ทั้งหมด (พร้อม filter)
export const requestUserList = (params?: {
  role?: string;
  status?: string;
  keyword?: string;
  page?: number;
  page_size?: number;
}) =>
  axios.get<{
    status_code: number;
    data: {
      users: UserRecord[];
      total: number;
      page: number;
      page_size: number;
      total_pages: number;
      summary: UserSummary;
    };
  }>(BASE, { params });

// ✨ ดึงรายละเอียด User เดี่ยว
export const requestUserDetail = (userId: string) =>
  axios.get<{ status_code: number; data: UserDetail }>(`${BASE}/${userId}`);

// ✨ อัปเดต role หรือ ban/unban
export const requestUpdateUser = (
  userId: string,
  data: { role?: string; ban?: boolean },
) => axios.put(`${BASE}/${userId}`, data);

// ✨ ลบ User
export const requestDeleteUser = (userId: string) =>
  axios.delete(`${BASE}/${userId}`);
