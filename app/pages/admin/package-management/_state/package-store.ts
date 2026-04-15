"use client";

import { create } from "zustand";
import {
  requestCreatePlan,
  requestDeletePlan,
  requestGetPackagePlans,
  requestListSchools,
  requestPackageSummary,
  requestPatchPlan,
  requestSeedPlans,
  requestUpdateSchoolPlan,
} from "../_api/package-api";

// ✨ ข้อมูล Package Plan ที่โหลดจาก DB
export interface PackagePlanItem {
  id: string;
  plan: string;
  label: string;
  color: string;
  price: number;
  jobQuota: number;
  features: string[];
  quotaWarningThreshold: number;
  badgeIcon: "default" | "crown" | "thunder";
  upgradeTarget: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolPackageItem {
  id: string;
  schoolName: string;
  schoolType: string | null;
  province: string;
  logoUrl: string | null;
  accountPlan: string;
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
  total: number;
  [planKey: string]: number;
}

// ✨ Form data สำหรับสร้าง/แก้ไข Plan
export interface PlanFormData {
  plan: string;
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
}

interface PackageStore {
  // ─── Plan ───
  plans: PackagePlanItem[];
  isLoadingPlans: boolean;
  isSavingPlan: boolean;
  isDeletingPlan: string | null; // plan key ที่กำลัง delete
  fetchPlans: (includeInactive?: boolean) => Promise<void>;
  seedPlans: () => Promise<void>;
  createPlan: (data: PlanFormData) => Promise<void>;
  patchPlan: (planKey: string, data: Partial<PlanFormData>) => Promise<void>;
  deletePlan: (planKey: string) => Promise<void>;

  // ─── โรงเรียน ───
  schools: SchoolPackageItem[];
  total: number;
  summary: PackageSummary;
  isLoading: boolean;
  isUpdating: string | null;
  filterPlan: string;
  filterKeyword: string;
  page: number;
  setFilterPlan: (p: string) => void;
  setFilterKeyword: (k: string) => void;
  setPage: (p: number) => void;
  fetchSummary: () => Promise<void>;
  fetchSchools: () => Promise<void>;
  updatePlan: (schoolId: string, plan: string, jobQuotaMax?: number) => Promise<void>;
}

export const usePackageStore = create<PackageStore>((set, get) => ({
  // ─── Plan state ───
  plans: [],
  isLoadingPlans: false,
  isSavingPlan: false,
  isDeletingPlan: null,

  // ✨ โหลด plans จาก DB
  fetchPlans: async (includeInactive = true) => {
    set({ isLoadingPlans: true });
    try {
      const res = await requestGetPackagePlans(includeInactive);
      if (res.data.status_code === 200) {
        set({ plans: res.data.data });
      }
    } finally {
      set({ isLoadingPlans: false });
    }
  },

  // ✨ Seed ค่าเริ่มต้น (ใช้ครั้งแรก)
  seedPlans: async () => {
    await requestSeedPlans();
    await get().fetchPlans();
  },

  // ✨ สร้าง plan ใหม่
  createPlan: async (data) => {
    set({ isSavingPlan: true });
    try {
      await requestCreatePlan(data);
      await get().fetchPlans();
    } finally {
      set({ isSavingPlan: false });
    }
  },

  // ✨ แก้ไข plan
  patchPlan: async (planKey, data) => {
    set({ isSavingPlan: true });
    try {
      await requestPatchPlan(planKey, data);
      await get().fetchPlans();
    } finally {
      set({ isSavingPlan: false });
    }
  },

  // ✨ ลบ plan
  deletePlan: async (planKey) => {
    set({ isDeletingPlan: planKey });
    try {
      await requestDeletePlan(planKey);
      set((s) => ({ plans: s.plans.filter((p) => p.plan !== planKey) }));
    } finally {
      set({ isDeletingPlan: null });
    }
  },

  // ─── โรงเรียน state ───
  schools: [],
  total: 0,
  summary: { total: 0 },
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
    } catch {
      /* silent */
    }
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

  // ✨ อัปเดต plan แล้ว refresh ข้อมูลทันที
  updatePlan: async (schoolId, plan, jobQuotaMax) => {
    set({ isUpdating: schoolId });
    try {
      await requestUpdateSchoolPlan({
        school_profile_id: schoolId,
        plan,
        job_quota_max: jobQuotaMax,
      });
      set((s) => ({
        schools: s.schools.map((sc) =>
          sc.id === schoolId
            ? { ...sc, accountPlan: plan, jobQuotaMax: jobQuotaMax ?? sc.jobQuotaMax }
            : sc,
        ),
      }));
      await get().fetchSummary();
    } finally {
      set({ isUpdating: null });
    }
  },
}));
