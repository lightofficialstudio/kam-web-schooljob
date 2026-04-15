"use client";

import { create } from "zustand";
import { DashboardData, requestDashboard } from "../_api/dashboard-api";

interface DashboardStore {
  data: DashboardData | null;
  isLoading: boolean;
  lastFetchedAt: string | null;
  fetchDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  data: null,
  isLoading: false,
  lastFetchedAt: null,

  // ✨ ดึงข้อมูล Dashboard จาก API
  fetchDashboard: async () => {
    set({ isLoading: true });
    try {
      const res = await requestDashboard();
      if (res.data.status_code === 200) {
        set({ data: res.data.data, lastFetchedAt: new Date().toISOString() });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
