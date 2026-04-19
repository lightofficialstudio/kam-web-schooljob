"use client";

import { create } from "zustand";

interface AccountSettingState {
  // ✨ loading แยกต่างหากต่อ action
  isPasswordLoading: boolean;
  setPasswordLoading: (v: boolean) => void;
}

export const useAccountSettingStore = create<AccountSettingState>((set) => ({
  isPasswordLoading: false,
  setPasswordLoading: (v) => set({ isPasswordLoading: v }),
}));
