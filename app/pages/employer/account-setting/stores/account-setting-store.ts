"use client";

import { create } from "zustand";

interface AccountSettingState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAccountSettingStore = create<AccountSettingState>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
}));
