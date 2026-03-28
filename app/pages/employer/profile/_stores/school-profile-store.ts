import { create } from "zustand";

export interface SchoolProfile {
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

interface SchoolProfileStore {
  profile: SchoolProfile;
  isDrawerOpen: boolean;
  setProfile: (profile: SchoolProfile) => void;
  setIsDrawerOpen: (open: boolean) => void;
}

const INITIAL_MOCK_DATA: SchoolProfile = {
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
  ],
  gallery: [
    "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523050335392-9bf5675f42ec?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
  ],
};

export const useSchoolProfileStore = create<SchoolProfileStore>((set) => ({
  profile: INITIAL_MOCK_DATA,
  isDrawerOpen: false,
  setProfile: (profile) => set({ profile }),
  setIsDrawerOpen: (open) => set({ isDrawerOpen: open }),
}));
