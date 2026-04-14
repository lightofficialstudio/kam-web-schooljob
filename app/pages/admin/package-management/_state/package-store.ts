"use client";

import { create } from "zustand";
import {
  requestListSchools,
  requestPackageSummary,
  requestUpdateSchoolPlan,
} from "../_api/package-api";

export interface SchoolPackageItem {
  id: string;
  schoolName: string;
  schoolType: string | null;
  province: string;
  logoUrl: string | null;
  accountPlan: "basic" | "premium" | "enterprise";
  jobQuotaMax: number;
  activeJobCount: number;
  quotaUsagePercent: number;
  createdAt: string;
  updatedAt: string;
  owner: {
    profileId: string;
    email: string;
    name: string;
    phoneNumber: string | null;
  };
}

export interface PackageSummary {
  basic: number;
  premium: number;
  enterprise: number;
  total: number;
}

interface PackageStore {
  schools: SchoolPackageItem[];
  total: number;
  summary: PackageSummary;
  isLoading: boolean;
  isUpdating: string | null; // school id ที่กำลัง update
  filterPlan: "basic" | "premium" | "enterprise" | "all";
  filterKeyword: string;
  page: number;
  setFilterPlan: (p: "basic" | "premium" | "enterprise" | "all") => void;
  setFilterKeyword: (k: string) => void;
  setPage: (p: number) => void;
  fetchSummary: () => Promise<void>;
  fetchSchools: () => Promise<void>;
  updatePlan: (schoolId: string, plan: "basic" | "premium" | "enterprise", jobQuotaMax?: number) => Promise<void>;
}

export const usePackageStore = create<PackageStore>((set, get) => ({
  schools: [],
  total: 0,
  summary: { basic: 0, premium: 0, enterprise: 0, total: 0 },
  isLoading: false,
  isUpdating: null,
  filterPlan: "all",
  filterKeyword: "",
  page: 1,

  setFilterPlan: (p) => set({ filterPlan: p, page: 1 }),
  setFilterKeyword: (k) => set({ filterKeyword: k, page: 1 }),
  setPage: (p) => set({ page: p }),

  // ✨ ดึงสถิติ summary
  fetchSummary: async () => {
    try {
      const res = await requestPackageSummary();
      if (res.data.status_code === 200) set({ summary: res.data.data });
    } catch { /* silent */ }
  },

  // ✨ ดึงรายการโรงเรียนตาม filter
  fetchSchools: async () => {
    const { filterPlan, filterKeyword, page } = get();
    set({ isLoading: true });
    try {
      const res = await requestListSchools({
        plan: filterPlan,
        keyword: filterKeyword || undefined,
        page,
        page_size: 20,
      });
      if (res.data.status_code === 200) {
        set({ schools: res.data.data.schools, total: res.data.data.total });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  // ✨ อัปเดต plan แล้ว refresh ข้อมูลทันที (Admin กด หรือ Payment Gateway trigger)
  updatePlan: async (schoolId, plan, jobQuotaMax) => {
    set({ isUpdating: schoolId });
    try {
      await requestUpdateSchoolPlan({ school_profile_id: schoolId, plan, job_quota_max: jobQuotaMax });
      // ✨ อัปเดต local state ทันที ไม่ต้อง refetch ทั้งหมด
      set((s) => ({
        schools: s.schools.map((sc) =>
          sc.id === schoolId
            ? { ...sc, accountPlan: plan, jobQuotaMax: jobQuotaMax ?? sc.jobQuotaMax }
            : sc,
        ),
      }));
      // ✨ refresh summary
      await get().fetchSummary();
    } finally {
      set({ isUpdating: null });
    }
  },
}));
