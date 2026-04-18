"use client";

import { create } from "zustand";
import {
  AdminJob,
  AuditLog,
  fetchAdminJobs,
  fetchAuditLogs,
  fetchDeleteJob,
  fetchUpdateJobStatus,
} from "../_api/admin-job-api";

interface Filters {
  keyword: string;
  status: string;
  province: string;
  schoolProfileId: string;
}

interface AdminJobStore {
  // รายการงาน
  jobs: AdminJob[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  isLoading: boolean;

  // filters
  filters: Filters;

  // drawer งาน
  drawerOpen: boolean;
  drawerJob: AdminJob | null;

  // audit log
  auditLogs: AuditLog[];
  auditTotal: number;
  auditPage: number;
  auditTotalPages: number;
  isLoadingAudit: boolean;
  auditDrawerOpen: boolean;

  // actions
  setFilters: (f: Partial<Filters>) => void;
  setPage: (p: number) => void;
  fetchJobs: (adminUserId: string) => Promise<void>;
  openDrawer: (job: AdminJob) => void;
  closeDrawer: () => void;
  updateStatus: (adminUserId: string, jobId: string, status: "OPEN" | "CLOSED" | "DRAFT", note?: string) => Promise<void>;
  deleteJob: (adminUserId: string, jobId: string, note?: string) => Promise<void>;
  openAuditDrawer: () => void;
  closeAuditDrawer: () => void;
  fetchAuditLogs: (adminUserId: string, page?: number) => Promise<void>;
}

export const useAdminJobStore = create<AdminJobStore>((set, get) => ({
  jobs: [],
  total: 0,
  totalPages: 1,
  page: 1,
  pageSize: 20,
  isLoading: false,
  filters: { keyword: "", status: "", province: "", schoolProfileId: "" },
  drawerOpen: false,
  drawerJob: null,
  auditLogs: [],
  auditTotal: 0,
  auditPage: 1,
  auditTotalPages: 1,
  isLoadingAudit: false,
  auditDrawerOpen: false,

  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f }, page: 1 })),
  setPage: (p) => set({ page: p }),

  // ✨ ดึงรายการงานทั้งระบบ
  fetchJobs: async (adminUserId) => {
    const { filters, page, pageSize } = get();
    set({ isLoading: true });
    try {
      const res = await fetchAdminJobs({
        adminUserId,
        keyword:          filters.keyword || undefined,
        status:           filters.status || undefined,
        province:         filters.province || undefined,
        schoolProfileId:  filters.schoolProfileId || undefined,
        page,
        pageSize,
      });
      set({ jobs: res.jobs, total: res.total, totalPages: res.totalPages });
    } finally {
      set({ isLoading: false });
    }
  },

  openDrawer:  (job) => set({ drawerOpen: true, drawerJob: job }),
  closeDrawer: () => set({ drawerOpen: false, drawerJob: null }),

  // ✨ อัปเดตสถานะงาน + sync state
  updateStatus: async (adminUserId, jobId, status, note) => {
    await fetchUpdateJobStatus(adminUserId, jobId, status, note);
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, status } : j)),
      drawerJob: s.drawerJob?.id === jobId ? { ...s.drawerJob, status } : s.drawerJob,
    }));
  },

  // ✨ ลบงาน + sync state
  deleteJob: async (adminUserId, jobId, note) => {
    await fetchDeleteJob(adminUserId, jobId, note);
    set((s) => ({
      jobs: s.jobs.filter((j) => j.id !== jobId),
      total: s.total - 1,
      drawerOpen: false,
      drawerJob: null,
    }));
  },

  openAuditDrawer:  () => set({ auditDrawerOpen: true }),
  closeAuditDrawer: () => set({ auditDrawerOpen: false }),

  // ✨ ดึง Audit Logs
  fetchAuditLogs: async (adminUserId, page = 1) => {
    set({ isLoadingAudit: true, auditPage: page });
    try {
      const res = await fetchAuditLogs({ adminUserId, targetType: "job", page, pageSize: 20 });
      set({ auditLogs: res.logs, auditTotal: res.total, auditTotalPages: res.totalPages });
    } finally {
      set({ isLoadingAudit: false });
    }
  },
}));
