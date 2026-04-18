import { create } from "zustand";
import {
  fetchSchoolProfile,
  type SchoolProfileDetail,
} from "../_api/school-profile-api";

interface SchoolProfileStore {
  school: SchoolProfileDetail | null;
  isLoading: boolean;
  error: string | null;
  fetchSchool: (schoolId: string) => Promise<void>;
  reset: () => void;
}

export const useSchoolProfileStore = create<SchoolProfileStore>((set) => ({
  school: null,
  isLoading: false,
  error: null,

  // ✨ ดึงข้อมูลโรงเรียนจาก API
  fetchSchool: async (schoolId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetchSchoolProfile(schoolId);
      if (res.status_code === 200 && res.data) {
        set({ school: res.data, isLoading: false });
      } else {
        set({ error: "ไม่พบข้อมูลโรงเรียน", isLoading: false });
      }
    } catch (err) {
      console.error("❌ fetchSchool:", err);
      set({ error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", isLoading: false });
    }
  },

  reset: () => set({ school: null, isLoading: false, error: null }),
}));
