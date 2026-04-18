"use client";

import type { ModalType } from "@/app/components/modal/modal.component";
import { create } from "zustand";
import { DashboardData, requestDashboard } from "../_api/dashboard-api";

// ✨ Modal state สำหรับแสดงผล Success / Error / Warning
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

interface DashboardStore {
  data: DashboardData | null;
  isLoading: boolean;
  lastFetchedAt: string | null;
  modal: ModalState;
  fetchDashboard: () => Promise<void>;
  showModal: (opts: Omit<ModalState, "open">) => void;
  hideModal: () => void;
}

const DEFAULT_MODAL: ModalState = {
  open: false,
  type: "success",
  title: "",
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  data: null,
  isLoading: false,
  lastFetchedAt: null,
  modal: DEFAULT_MODAL,

  // ✨ เปิด modal พร้อมตั้งค่า
  showModal: (opts) => set({ modal: { ...opts, open: true } }),

  // ✨ ปิด modal และ reset state
  hideModal: () => set({ modal: DEFAULT_MODAL }),

  // ✨ ดึงข้อมูล Dashboard จาก API — error แสดงผ่าน Modal
  fetchDashboard: async () => {
    set({ isLoading: true });
    try {
      const res = await requestDashboard();
      if (res.data.status_code === 200) {
        set({ data: res.data.data, lastFetchedAt: new Date().toISOString() });
      } else {
        set((s) => ({
          modal: {
            open: true,
            type: "error",
            title: "โหลดข้อมูล Dashboard ไม่สำเร็จ",
            description: res.data.message_th ?? res.data.message_en,
            errorDetails: res.data,
          },
          isLoading: false,
        }));
        return;
      }
    } catch (err: unknown) {
      set((s) => ({
        modal: {
          open: true,
          type: "error",
          title: "เกิดข้อผิดพลาดขณะโหลด Dashboard",
          description:
            "ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง หรือแจ้ง Admin",
          errorDetails: err,
        },
        isLoading: false,
      }));
      return;
    } finally {
      set({ isLoading: false });
    }
  },
}));
