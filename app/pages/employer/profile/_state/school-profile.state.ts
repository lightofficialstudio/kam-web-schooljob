import { create } from "zustand";

import {
  requestFetchSchoolProfile,
  requestUpdateSchoolProfile,
} from "../_api/school-profile.api";

// ============================
// Types
// ============================
export interface SchoolProfile {
  id?: string;
  name: string;
  type: string;
  location: string;
  address: string;
  website?: string;
  email: string;
  phone: string;
  established?: string;
  size?: string;
  description?: string;
  vision?: string;
  curriculum?: string;
  levels?: string[];
  benefits?: string[];
  gallery?: string[];
}

interface SchoolProfileState {
  profile: SchoolProfile;
  isDrawerOpen: boolean;
  isSaving: boolean;
  isLoading: boolean;
  // Actions
  setProfile: (profile: SchoolProfile) => void;
  setIsDrawerOpen: (open: boolean) => void;
  fetchProfile: (userId: string, email?: string) => Promise<void>;
  saveProfile: (data: SchoolProfile, userId: string) => Promise<void>;
}

// ============================
// Default Empty Profile
// ============================
const EMPTY_PROFILE: SchoolProfile = {
  name: "",
  type: "",
  location: "",
  address: "",
  email: "",
  phone: "",
};

// ============================
// Store
// ============================
export const useSchoolProfileState = create<SchoolProfileState>((set, get) => ({
  profile: EMPTY_PROFILE,
  isDrawerOpen: false,
  isSaving: false,
  isLoading: false,

  setProfile: (profile) => set({ profile }),
  setIsDrawerOpen: (open) => set({ isDrawerOpen: open }),

  // ✨ โหลดโปรไฟล์จาก API — auto-create ถ้ายังไม่มีใน DB
  fetchProfile: async (userId: string, email?: string) => {
    set({ isLoading: true });
    try {
      const data = await requestFetchSchoolProfile(userId, email);
      if (data) {
        set({ profile: data });
      }
    } catch (err) {
      console.error("❌ [SchoolProfileState] fetchProfile error:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  // ✨ บันทึกโปรไฟล์ผ่าน API แล้ว update state ทันที
  saveProfile: async (data: SchoolProfile, userId: string) => {
    set({ isSaving: true });
    try {
      await requestUpdateSchoolProfile(userId, data);
      set({ profile: data });
    } catch (err) {
      console.error("❌ [SchoolProfileState] saveProfile error:", err);
      // Fallback: อัปเดต local state เสมอแม้ API จะ fail
      set({ profile: data });
    } finally {
      set({ isSaving: false });
    }
  },
}));

// ============================
// Backward-compat re-export (for _stores/ consumers)
// ============================
export { useSchoolProfileState as useSchoolProfileStore };
export type { SchoolProfileState as SchoolProfileStore };
