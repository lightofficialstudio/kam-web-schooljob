"use client";

import { ModalType } from "@/app/components/modal/modal.component";
import { create } from "zustand";
import {
  requestDeleteUser,
  requestUpdateUser,
  requestUserDetail,
  requestUserList,
  UserDetail,
  UserRecord,
  UserSummary,
} from "../_api/user-management-api";

interface UserManagementStore {
  // ─── Modal state ───
  modal: {
    open: boolean;
    type: ModalType;
    title: string;
    description: string;
    errorDetails?: unknown;
    onConfirm?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    loading: boolean;
  };
  showModal: (opts: {
    type: ModalType;
    title: string;
    description?: string;
    errorDetails?: unknown;
    onConfirm?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
  }) => void;
  hideModal: () => void;
  setModalLoading: (loading: boolean) => void;

  // ─── List state ───
  users: UserRecord[];
  total: number;
  totalPages: number;
  summary: UserSummary | null;
  isLoading: boolean;

  // ─── Filter state ───
  filterRole: "all" | "EMPLOYEE" | "EMPLOYER" | "ADMIN";
  filterStatus: "all" | "active" | "unverified" | "banned" | "no_profile";
  filterKeyword: string;
  page: number;
  pageSize: number;
  selectedRowKeys: string[];

  // ─── Detail Drawer state ───
  drawerOpen: boolean;
  drawerUserId: string | null;
  drawerDetail: UserDetail | null;
  isLoadingDetail: boolean;
  isUpdatingUser: boolean;

  // ─── Actions: filter ───
  setFilterRole: (r: UserManagementStore["filterRole"]) => void;
  setFilterStatus: (s: UserManagementStore["filterStatus"]) => void;
  setFilterKeyword: (k: string) => void;
  setPage: (p: number) => void;
  setSelectedRowKeys: (keys: string[]) => void;

  // ─── Actions: data ───
  fetchUsers: () => Promise<void>;
  openDrawer: (userId: string) => Promise<void>;
  closeDrawer: () => void;
  updateUserRole: (userId: string, role: string) => Promise<void>;
  banUser: (userId: string, ban: boolean) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

export const useUserManagementStore = create<UserManagementStore>(
  (set, get) => ({
    // ✨ Modal state เริ่มต้น
    modal: {
      open: false,
      type: "success" as ModalType,
      title: "",
      description: "",
      loading: false,
    },
    showModal: (opts) =>
      set({
        modal: {
          open: true,
          type: opts.type,
          title: opts.title,
          description: opts.description ?? "",
          errorDetails: opts.errorDetails,
          onConfirm: opts.onConfirm,
          confirmLabel: opts.confirmLabel,
          cancelLabel: opts.cancelLabel,
          loading: false,
        },
      }),
    hideModal: () =>
      set((s) => ({
        modal: { ...s.modal, open: false, onConfirm: undefined },
      })),
    setModalLoading: (loading) =>
      set((s) => ({ modal: { ...s.modal, loading } })),

    users: [],
    total: 0,
    totalPages: 0,
    summary: null,
    isLoading: false,
    filterRole: "all",
    filterStatus: "all",
    filterKeyword: "",
    page: 1,
    pageSize: 50,
    selectedRowKeys: [],
    drawerOpen: false,
    drawerUserId: null,
    drawerDetail: null,
    isLoadingDetail: false,
    isUpdatingUser: false,

    setFilterRole: (r) => set({ filterRole: r, page: 1 }),
    setFilterStatus: (s) => set({ filterStatus: s, page: 1 }),
    setFilterKeyword: (k) => set({ filterKeyword: k, page: 1 }),
    setPage: (p) => set({ page: p }),
    setSelectedRowKeys: (keys) => set({ selectedRowKeys: keys }),

    // ✨ ดึงรายการ User ตาม filter ปัจจุบัน
    fetchUsers: async () => {
      const { filterRole, filterStatus, filterKeyword, page, pageSize } = get();
      set({ isLoading: true });
      try {
        const res = await requestUserList({
          role: filterRole === "all" ? undefined : filterRole,
          status: filterStatus === "all" ? undefined : filterStatus,
          keyword: filterKeyword || undefined,
          page,
          page_size: pageSize,
        });
        if (res.data.status_code === 200) {
          const d = res.data.data;
          set({
            users: d.users,
            total: d.total,
            totalPages: d.total_pages,
            summary: d.summary,
          });
        }
      } finally {
        set({ isLoading: false });
      }
    },

    // ✨ เปิด Drawer พร้อมโหลด detail
    openDrawer: async (userId) => {
      set({
        drawerOpen: true,
        drawerUserId: userId,
        drawerDetail: null,
        isLoadingDetail: true,
      });
      try {
        const res = await requestUserDetail(userId);
        if (res.data.status_code === 200) {
          set({ drawerDetail: res.data.data });
        }
      } finally {
        set({ isLoadingDetail: false });
      }
    },

    closeDrawer: () =>
      set({ drawerOpen: false, drawerUserId: null, drawerDetail: null }),

    // ✨ อัปเดต role แล้ว sync local state
    updateUserRole: async (userId, role) => {
      set({ isUpdatingUser: true });
      try {
        await requestUpdateUser(userId, { role });
        set((s) => ({
          users: s.users.map((u) =>
            u.id === userId ? { ...u, role: role as UserRecord["role"] } : u,
          ),
          drawerDetail:
            s.drawerDetail?.id === userId
              ? {
                  ...s.drawerDetail,
                  profile: s.drawerDetail.profile
                    ? { ...s.drawerDetail.profile, role }
                    : null,
                }
              : s.drawerDetail,
        }));
      } finally {
        set({ isUpdatingUser: false });
      }
    },

    // ✨ Ban/Unban
    banUser: async (userId, ban) => {
      set({ isUpdatingUser: true });
      try {
        await requestUpdateUser(userId, { ban });
        set((s) => ({
          users: s.users.map((u) =>
            u.id === userId ? { ...u, isBanned: ban } : u,
          ),
          drawerDetail:
            s.drawerDetail?.id === userId
              ? { ...s.drawerDetail, isBanned: ban }
              : s.drawerDetail,
        }));
      } finally {
        set({ isUpdatingUser: false });
      }
    },

    // ✨ ลบ User แล้วลบออกจาก local state
    deleteUser: async (userId) => {
      set({ isUpdatingUser: true });
      try {
        await requestDeleteUser(userId);
        set((s) => ({
          users: s.users.filter((u) => u.id !== userId),
          total: s.total - 1,
          drawerOpen: s.drawerUserId === userId ? false : s.drawerOpen,
        }));
        await get().fetchUsers();
      } finally {
        set({ isUpdatingUser: false });
      }
    },
  }),
);
