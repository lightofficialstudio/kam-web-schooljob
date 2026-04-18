import axios from "axios";
import { PackagePlanItem } from "../_state/package-store";

const BASE = "/api/v1/admin/packages";

// ✨ ดึงสถิติภาพรวม package
export const requestPackageSummary = () =>
  axios.get(`${BASE}/read`, { params: { summary: true } });

// ✨ ดึงรายการโรงเรียนพร้อม plan
export const requestListSchools = (params: {
  plan?: string;
  keyword?: string;
  page?: number;
  page_size?: number;
}) => axios.get(`${BASE}/read`, { params });

// ✨ อัปเดต package ของโรงเรียน (Admin กด หรือ Payment webhook)
export const requestUpdateSchoolPlan = (data: {
  school_profile_id: string;
  plan: string;
  job_quota_max?: number;
}) => axios.put(`${BASE}/update`, data);

// ✨ ดึงรายการ Package Plan ทั้งหมดจาก DB
export const requestGetPackagePlans = (includeInactive = false) =>
  axios.get<{
    status_code: number;
    data: PackagePlanItem[];
  }>(`${BASE}/plans`, {
    params: includeInactive ? { include_inactive: true } : undefined,
  });

// ✨ Seed ค่าเริ่มต้นจาก PACKAGE_DEFINITIONS (ใช้ครั้งแรก)
export const requestSeedPlans = () =>
  axios.get(`${BASE}/plans`, { params: { seed: true } });

// ✨ สร้าง Package Plan ใหม่ (Admin)
export const requestCreatePlan = (data: {
  plan: string;
  label: string;
  color: string;
  price: number;
  job_quota: number;
  features: string[];
  quota_warning_threshold?: number;
  badge_icon?: "default" | "crown" | "thunder";
  upgrade_target?: string | null;
  sort_order?: number;
  is_active?: boolean;
}) => axios.post(`${BASE}/plans`, data);

// ✨ แก้ไข Package Plan (PATCH — ส่งเฉพาะ field ที่ต้องการแก้)
export const requestPatchPlan = (
  planKey: string,
  data: Partial<{
    label: string;
    color: string;
    price: number;
    job_quota: number;
    features: string[];
    quota_warning_threshold: number;
    badge_icon: "default" | "crown" | "thunder";
    upgrade_target: string | null;
    sort_order: number;
    is_active: boolean;
  }>,
) => axios.patch(`${BASE}/plans/${planKey}`, data);

// ✨ ลบ Package Plan (Admin)
export const requestDeletePlan = (planKey: string) =>
  axios.delete(`${BASE}/plans/${planKey}`);

// ✨ ดึงรายละเอียดโรงเรียนเดี่ยว (School Detail Drawer)
export const requestSchoolDetail = (schoolId: string) =>
  axios.get<{ status_code: number; data: SchoolDetail }>(`${BASE}/school-detail`, {
    params: { school_id: schoolId },
  });

// ✨ Bulk เปลี่ยน Plan หลายโรงเรียนพร้อมกัน
export const requestBulkUpdatePlan = (data: {
  school_ids: string[];
  plan: string;
  job_quota_max?: number;
}) => axios.put(`${BASE}/bulk-update`, data);

export interface SchoolDetail {
  id: string;
  schoolName: string;
  schoolType: string | null;
  province: string;
  district: string | null;
  logoUrl: string | null;
  website: string | null;
  phone: string | null;
  studentCount: number | null;
  teacherCount: number | null;
  accountPlan: string;
  jobQuotaMax: number;
  createdAt: string;
  updatedAt: string;
  owner: {
    profileId: string;
    email: string;
    name: string;
    phoneNumber: string | null;
    profileImageUrl: string | null;
    joinedAt: string;
  };
  stats: {
    totalJobs: number;
    openJobs: number;
    totalApplications: number;
    activeJobCount: number;
    quotaUsagePercent: number;
  };
  recentJobs: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
    deadline: string | null;
    applicationCount: number;
  }[];
}
