"use client";

import type { ModalType } from "@/app/components/modal/modal.component";
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

// ✨ Modal state สำหรับรายงานสถานะ Success / Error / Warning
interface ModalState {
  open: boolean;
  type: ModalType;
  title: string;
  description?: string;
  errorDetails?: unknown;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

const DEFAULT_MODAL: ModalState = { open: false, type: "success", title: "" };

interface AdminJobStore {
  jobs: AdminJob[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  filters: Filters;
  modal: ModalState;

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

  showModal: (opts: Omit<ModalState, "open">) => void;
  hideModal: () => void;
  setFilters: (f: Partial<Filters>) => void;
  setPage: (p: number) => void;
  fetchJobs: (adminUserId: string) => Promise<void>;
  openDrawer: (job: AdminJob, adminUserId: string) => void;
  closeDrawer: () => void;
  updateStatus: (
    adminUserId: string,
    jobId: string,
    status: "OPEN" | "CLOSED" | "DRAFT",
    note?: string,
  ) => Promise<void>;
  deleteJob: (
    adminUserId: string,
    jobId: string,
    note?: string,
  ) => Promise<void>;
  fetchApplicants: (adminUserId: string, jobId: string) => Promise<void>;
  fetchJobAuditLogs: (jobId: string) => Promise<void>;
  openAuditDrawer: () => void;
  closeAuditDrawer: () => void;
  setAuditFilterAction: (action: string) => void;
  fetchAuditLogs: (
    adminUserId: string,
    page?: number,
    action?: string,
  ) => Promise<void>;
}

export const useAdminJobStore = create<AdminJobStore>((set, get) => ({
  jobs: [],
  total: 0,
  totalPages: 1,
  page: 1,
  pageSize: 20,
  isLoading: false,
  filters: { keyword: "", status: "", province: "", schoolProfileId: "" },
  modal: DEFAULT_MODAL,

  // ✨ เปิด/ปิด modal
  showModal: (opts) => set({ modal: { ...opts, open: true } }),
  hideModal: () => set({ modal: DEFAULT_MODAL }),

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

  // ✨ ดึงรายการงาน — error แสดงผ่าน modal
  // Bug #3 fix: อ่าน page จาก state หลัง set เสร็จแล้ว ป้องกัน race condition
  fetchJobs: async (adminUserId) => {
    const { filters, pageSize } = get();
    const page = get().page; // ✨ อ่านใหม่ทุกครั้งเพื่อป้องกัน stale closure
    set({ isLoading: true });
    try {
      const res = await fetchAdminJobs({
        adminUserId,
        keyword: filters.keyword || undefined,
        status: filters.status || undefined,
        province: filters.province || undefined,
        schoolProfileId: filters.schoolProfileId || undefined,
        page,
        pageSize,
      });
      set({ jobs: res.jobs, total: res.total, totalPages: res.totalPages });
    } catch (err: unknown) {
      get().showModal({
        type: "error",
        title: "โหลดรายการงานไม่สำเร็จ",
        description: "ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่หรือแจ้ง Admin",
        errorDetails: err,
      });
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
  closeDrawer: () =>
    set({
      drawerOpen: false,
      drawerJob: null,
      applicants: [],
      jobAuditLogs: [],
    }),

  updateStatus: async (adminUserId, jobId, status, note) => {
    try {
      await fetchUpdateJobStatus(adminUserId, jobId, status, note);
      set((s) => ({
        jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, status } : j)),
        drawerJob:
          s.drawerJob?.id === jobId ? { ...s.drawerJob, status } : s.drawerJob,
      }));
      if (get().drawerJob?.id === jobId) get().fetchJobAuditLogs(jobId);
      const statusTh =
        status === "OPEN"
          ? "เปิดรับสมัคร"
          : status === "CLOSED"
            ? "ปิดรับสมัคร"
            : "ฉบับร่าง";
      get().showModal({
        type: "success",
        title: "อัปเดตสถานะสำเร็จ",
        description: `เปลี่ยนสถานะเป็น "${statusTh}" เรียบร้อยแล้ว`,
      });
    } catch (err: unknown) {
      get().showModal({
        type: "error",
        title: "อัปเดตสถานะไม่สำเร็จ",
        description: "กรุณาลองใหม่อีกครั้ง หรือตรวจสอบสิทธิ์ของคุณ",
        errorDetails: err,
      });
      throw err;
    }
  },

  deleteJob: async (adminUserId, jobId, note) => {
    try {
      await fetchDeleteJob(adminUserId, jobId, note);
      set((s) => ({
        jobs: s.jobs.filter((j) => j.id !== jobId),
        total: s.total - 1,
        drawerOpen: false,
        drawerJob: null,
        applicants: [],
        jobAuditLogs: [],
      }));
      get().showModal({
        type: "success",
        title: "ลบประกาศงานสำเร็จ",
        description: "ประกาศงานถูกลบออกจากระบบเรียบร้อยแล้ว",
      });
    } catch (err: unknown) {
      get().showModal({
        type: "error",
        title: "ลบประกาศงานไม่สำเร็จ",
        description: "กรุณาลองใหม่อีกครั้ง",
        errorDetails: err,
      });
      throw err;
    }
  },

  // ✨ ดึงผู้สมัครของ post — error ไม่ต้อง interrupt UX (silent)
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
    } catch {
      // ✨ silent — audit log ไม่ critical
    } finally {
      set({ isLoadingJobAudit: false });
    }
  },

  openAuditDrawer: () => set({ auditDrawerOpen: true }),
  closeAuditDrawer: () => set({ auditDrawerOpen: false }),
  setAuditFilterAction: (action) => set({ auditFilterAction: action }),

  fetchAuditLogs: async (adminUserId, page = 1, action) => {
    const { auditFilterAction } = get();
    const effectiveAction = action ?? auditFilterAction;
    set({ isLoadingAudit: true, auditPage: page });
    try {
      // ✨ Bug #4 fix: ส่ง adminUserId เข้า API เพื่อให้ endpoint auth ได้ถูกต้อง
      const res = await fetchAuditLogs({
        adminUserId: adminUserId || undefined,
        targetType: "job",
        action: effectiveAction || undefined,
        page,
        pageSize: 20,
      });
      set({
        auditLogs: res.logs,
        auditTotal: res.total,
        auditTotalPages: res.totalPages,
      });
    } catch (err: unknown) {
      get().showModal({
        type: "error",
        title: "โหลด Audit Log ไม่สำเร็จ",
        description: "ไม่สามารถดึงประวัติการดำเนินการได้",
        errorDetails: err,
      });
    } finally {
      set({ isLoadingAudit: false });
    }
  },
}));
