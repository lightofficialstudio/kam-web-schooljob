"use client";

import { create } from "zustand";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface AccountSettingStore {
  personalInfo: PersonalInfo;
  isLoadingPersonal: boolean;
  isLoadingPassword: boolean;
  setPersonalInfo: (info: Partial<PersonalInfo>) => void;
  setIsLoadingPersonal: (v: boolean) => void;
  setIsLoadingPassword: (v: boolean) => void;
}

export const useAccountSettingStore = create<AccountSettingStore>((set) => ({
  personalInfo: { firstName: "", lastName: "", phoneNumber: "" },
  isLoadingPersonal: false,
  isLoadingPassword: false,
  setPersonalInfo: (info) =>
    set((s) => ({ personalInfo: { ...s.personalInfo, ...info } })),
  setIsLoadingPersonal: (v) => set({ isLoadingPersonal: v }),
  setIsLoadingPassword: (v) => set({ isLoadingPassword: v }),
}));
