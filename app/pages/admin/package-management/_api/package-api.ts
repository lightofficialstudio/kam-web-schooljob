import axios from "axios";

const BASE = "/api/v1/admin/packages";

// ✨ ดึงสถิติภาพรวม package
export const requestPackageSummary = () =>
  axios.get(`${BASE}/read`, { params: { summary: true } });

// ✨ ดึงรายการโรงเรียนพร้อม plan
export const requestListSchools = (params: {
  plan?: "basic" | "premium" | "enterprise" | "all";
  keyword?: string;
  page?: number;
  page_size?: number;
}) => axios.get(`${BASE}/read`, { params });

// ✨ อัปเดต package ของโรงเรียน (Admin กด หรือ Payment webhook)
export const requestUpdateSchoolPlan = (data: {
  school_profile_id: string;
  plan: "basic" | "premium" | "enterprise";
  job_quota_max?: number;
}) => axios.put(`${BASE}/update`, data);

// ✨ ดึงราคา Package ทั้งหมดจาก DB
export const requestGetPackagePlans = () =>
  axios.get<{
    status_code: number;
    data: { id: string; plan: string; price: number; updatedAt: string }[];
  }>(`${BASE}/plans`);

// ✨ อัปเดตราคา Package (Admin เท่านั้น)
export const requestUpdatePackagePrice = (data: {
  plan: string;
  price: number;
}) => axios.patch(`${BASE}/plans`, data);
