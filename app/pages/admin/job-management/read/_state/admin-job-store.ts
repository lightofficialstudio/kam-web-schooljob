"use client";

import { create } from "zustand";
import {
  AdminJob,
  Applicant,
  AuditLog,
  fetchAdminApplicants,
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
  jobs: AdminJob[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  filters: Filters;

  // drawer งาน — 3 tabs: info / applicants / audit
  drawerOpen: boolean;
  drawerJob: AdminJob | null;

  // tab: ผู้สมัคร
  applicants: Applicant[];
  isLoadingApplicants: boolean;

  // tab: ประวัติ audit
  jobAuditLogs: AuditLog[];
  isLoadingJobAudit: boolean;

  // audit drawer รวม
  auditLogs: AuditLog[];
  auditTotal: number;
  auditPage: number;
  auditTotalPages: number;
  auditFilterAction: string;
  isLoadingAudit: boolean;
  auditDrawerOpen: boolean;

  setFilters: (f: Partial<Filters>) => void;
  setPage: (p: number) => void;
  fetchJobs: (adminUserId: string) => Promise<void>;
  openDrawer: (job: AdminJob, adminUserId: string) => void;
  closeDrawer: () => void;
  updateStatus: (adminUserId: string, jobId: string, status: "OPEN" | "CLOSED" | "DRAFT", note?: string) => Promise<void>;
  deleteJob: (adminUserId: string, jobId: string, note?: string) => Promise<void>;
  fetchApplicants: (adminUserId: string, jobId: string) => Promise<void>;
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

  applicants: [],
  isLoadingApplicants: false,

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

  // ✨ เปิด drawer + โหลด applicants + audit พร้อมกัน
  openDrawer: (job, adminUserId) => {
    set({ drawerOpen: true, drawerJob: job, applicants: [], jobAuditLogs: [] });
    get().fetchApplicants(adminUserId, job.id);
    get().fetchJobAuditLogs(job.id);
  },
  closeDrawer: () => set({ drawerOpen: false, drawerJob: null, applicants: [], jobAuditLogs: [] }),

  updateStatus: async (adminUserId, jobId, status, note) => {
    await fetchUpdateJobStatus(adminUserId, jobId, status, note);
    set((s) => ({
      jobs:      s.jobs.map((j) => (j.id === jobId ? { ...j, status } : j)),
      drawerJob: s.drawerJob?.id === jobId ? { ...s.drawerJob, status } : s.drawerJob,
    }));
    if (get().drawerJob?.id === jobId) get().fetchJobAuditLogs(jobId);
  },

  deleteJob: async (adminUserId, jobId, note) => {
    await fetchDeleteJob(adminUserId, jobId, note);
    set((s) => ({
      jobs:        s.jobs.filter((j) => j.id !== jobId),
      total:       s.total - 1,
      drawerOpen:  false,
      drawerJob:   null,
      applicants:  [],
      jobAuditLogs: [],
    }));
  },

  // ✨ ดึงผู้สมัครของ post
  fetchApplicants: async (adminUserId, jobId) => {
    set({ isLoadingApplicants: true });
    try {
      const res = await fetchAdminApplicants(adminUserId, jobId);
      set({ applicants: res.applicants });
    } catch {
      set({ applicants: [] });
    } finally {
      set({ isLoadingApplicants: false });
    }
  },

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
