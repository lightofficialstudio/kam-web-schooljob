import { create } from "zustand";

import { requestUpdateSchoolProfile } from "../_api/school-profile.api";

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
  // Actions
  setProfile: (profile: SchoolProfile) => void;
  setIsDrawerOpen: (open: boolean) => void;
  saveProfile: (data: SchoolProfile) => Promise<void>;
}

// ============================
// Mock Data
// ============================
const MOCK_PROFILE: SchoolProfile = {
  id: "mock-001",
  name: "โรงเรียนนานาชาติคัมสคูล (Kam School International)",
  type: "โรงเรียนเอกชน (นานาชาติ)",
  location: "กรุงเทพมหานคร",
  address: "123/45 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900",
  website: "www.kamschool.ac.th",
  email: "hr@kamschool.ac.th",
  phone: "02-123-4567",
  established: "2545",
  size: "500 - 1,000 คน",
  description:
    "โรงเรียนนานาชาติคัมสคูล มุ่งเน้นการพัฒนาศักยภาพผู้เรียนสู่ความเป็นเลิศในระดับสากล ผ่านนวัตกรรมการเรียนรู้ที่ทันสมัยและสภาพแวดล้อมที่เอื้อต่อการสร้างสรรค์ เรากำลังมองหาบุคลากรทางการศึกษาที่มีความมุ่งมั่นเพื่อมาร่วมเป็นส่วนหนึ่งของครอบครัวเรา",
  vision: "สร้างผู้นำแห่งอนาคต ด้วยคุณธรรมและนวัตกรรม",
  curriculum: "British Curriculum (IGCSE & A-Level)",
  levels: ["อนุบาล", "ประถมศึกษา", "มัธยมศึกษา"],
  benefits: [
    "ประกันสุขภาพกลุ่ม",
    "โบนัสประจำปี",
    "คอร์สพัฒนาศักยภาพครู",
    "อาหารกลางวันฟรี",
    "ค่าเดินทาง",
    "วันหยุดพิเศษตามปฏิทินวิชาการ",
  ],
  gallery: [
    "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523050335392-9bf5675f42ec?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
  ],
};

// ============================
// Store
// ============================
export const useSchoolProfileState = create<SchoolProfileState>((set) => ({
  profile: MOCK_PROFILE,
  isDrawerOpen: false,
  isSaving: false,

  setProfile: (profile) => set({ profile }),
  setIsDrawerOpen: (open) => set({ isDrawerOpen: open }),

  // บันทึกโปรไฟล์ผ่าน API แล้ว update state ทันที
  saveProfile: async (data: SchoolProfile) => {
    set({ isSaving: true });
    try {
      if (data.id) {
        await requestUpdateSchoolProfile(data.id, data);
      }
      set({ profile: data, isSaving: false });
    } catch {
      // Fallback: update local state หาก API ยังไม่พร้อม
      set({ profile: data, isSaving: false });
    }
  },
}));

// ============================
// Backward-compat re-export (for _stores/ consumers)
// ============================
export { useSchoolProfileState as useSchoolProfileStore };
export type { SchoolProfileState as SchoolProfileStore };
