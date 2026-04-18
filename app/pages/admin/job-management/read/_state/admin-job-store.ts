"use client";

import { create } from "zustand";
import {
  AdminJob,
  AuditLog,
  fetchAdminJobs,
  fetchAuditLogs,
  fetchAuditLogsByJob,
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

  // drawer งาน (รายละเอียด + per-post audit)
  drawerOpen: boolean;
  drawerJob: AdminJob | null;
  jobAuditLogs: AuditLog[];
  isLoadingJobAudit: boolean;

  // audit log รวมระบบ
  auditLogs: AuditLog[];
  auditTotal: number;
  auditPage: number;
  auditTotalPages: number;
  auditFilterAction: string;
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
  fetchJobAuditLogs: (jobId: string) => Promise<void>;
  openAuditDrawer: () => void;
  closeAuditDrawer: () => void;
  setAuditFilterAction: (action: string) => void;
  fetchAuditLogs: (adminUserId: string, page?: number, action?: string) => Promise<void>;
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
  jobAuditLogs: [],
  isLoadingJobAudit: false,

  auditLogs: [],
  auditTotal: 0,
  auditPage: 1,
  auditTotalPages: 1,
  auditFilterAction: "",
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
        keyword:         filters.keyword || undefined,
        status:          filters.status || undefined,
        province:        filters.province || undefined,
        schoolProfileId: filters.schoolProfileId || undefined,
        page,
        pageSize,
      });
      set({ jobs: res.jobs, total: res.total, totalPages: res.totalPages });
    } finally {
      set({ isLoading: false });
    }
  },

  // ✨ เปิด drawer + โหลด per-post audit logs พร้อมกัน
  openDrawer: (job) => {
    set({ drawerOpen: true, drawerJob: job, jobAuditLogs: [] });
    get().fetchJobAuditLogs(job.id);
  },
  closeDrawer: () => set({ drawerOpen: false, drawerJob: null, jobAuditLogs: [] }),

  // ✨ อัปเดตสถานะงาน + sync state + refresh per-post audit
  updateStatus: async (adminUserId, jobId, status, note) => {
    await fetchUpdateJobStatus(adminUserId, jobId, status, note);
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, status } : j)),
      drawerJob: s.drawerJob?.id === jobId ? { ...s.drawerJob, status } : s.drawerJob,
    }));
    // refresh per-post audit ถ้า drawer กำลังเปิด
    if (get().drawerJob?.id === jobId) {
      get().fetchJobAuditLogs(jobId);
    }
  },

  // ✨ ลบงาน + sync state
  deleteJob: async (adminUserId, jobId, note) => {
    await fetchDeleteJob(adminUserId, jobId, note);
    set((s) => ({
      jobs: s.jobs.filter((j) => j.id !== jobId),
      total: s.total - 1,
      drawerOpen: false,
      drawerJob: null,
      jobAuditLogs: [],
    }));
  },

  // ✨ ดึง Audit Logs เฉพาะ Post (per-post timeline)
  fetchJobAuditLogs: async (jobId) => {
    set({ isLoadingJobAudit: true });
    try {
      const res = await fetchAuditLogsByJob(jobId);
      set({ jobAuditLogs: res.logs });
    } finally {
      set({ isLoadingJobAudit: false });
    }
  },

  openAuditDrawer:  () => set({ auditDrawerOpen: true }),
  closeAuditDrawer: () => set({ auditDrawerOpen: false }),
  setAuditFilterAction: (action) => set({ auditFilterAction: action }),

  // ✨ ดึง Audit Logs รวมระบบ พร้อม filter + pagination
  fetchAuditLogs: async (adminUserId, page = 1, action) => {
    const { auditFilterAction } = get();
    const effectiveAction = action ?? auditFilterAction;
    set({ isLoadingAudit: true, auditPage: page });
    try {
      const res = await fetchAuditLogs({
        targetType: "job",
        action:     effectiveAction || undefined,
        page,
        pageSize:   20,
      });
      set({ auditLogs: res.logs, auditTotal: res.total, auditTotalPages: res.totalPages });
    } finally {
      set({ isLoadingAudit: false });
    }
  },
}));
