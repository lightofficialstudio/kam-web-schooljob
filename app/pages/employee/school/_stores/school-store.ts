import { create } from "zustand";

interface Job {
  id: string;
  title: string;
  salary: string;
  type: string; // Full-time | Part-time
  gradeLevels: string[]; // ระดับชั้นที่รับสอน
}

interface School {
  id: string;
  name: string;
  logo: string;
  province: string;
  type: string;
  jobCount: number;
  jobs: Job[];
}

type SortBy = "latest" | "most_jobs";

interface SchoolState {
  searchQuery: string;
  provinceFilter: string | null;
  typeFilter: string | null;
  gradeFilter: string | null;    // ระดับชั้นที่สอน
  contractFilter: string | null; // ประเภทสัญญา
  sortBy: SortBy;
  selectedSchool: School | null;
  isDrawerOpen: boolean;
  schools: School[];
  setSearchQuery: (query: string) => void;
  setProvinceFilter: (province: string | null) => void;
  setTypeFilter: (type: string | null) => void;
  setGradeFilter: (grade: string | null) => void;
  setContractFilter: (contract: string | null) => void;
  setSortBy: (sortBy: SortBy) => void;
  setSelectedSchool: (school: School | null) => void;
  setIsDrawerOpen: (isOpen: boolean) => void;
}

export const useSchoolStore = create<SchoolState>((set) => ({
  searchQuery: "",
  provinceFilter: null,
  typeFilter: null,
  gradeFilter: null,
  contractFilter: null,
  sortBy: "latest",
  selectedSchool: null,
  isDrawerOpen: false,
  schools: [
    {
      id: "1",
      name: "โรงเรียนนานาชาติเซนต์แอนดรูว์ส",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=SA",
      province: "กรุงเทพมหานคร",
      type: "โรงเรียนนานาชาติ",
      jobCount: 5,
      jobs: [
        {
          id: "j1",
          title: "ครูสอนภาษาอังกฤษ (Primary)",
          salary: "45,000 - 60,000",
          type: "Full-time",
          gradeLevels: ["ประถมศึกษา"],
        },
        {
          id: "j2",
          title: "ครูสอนคณิตศาสตร์ (Secondary)",
          salary: "50,000 - 70,000",
          type: "Full-time",
          gradeLevels: ["มัธยมศึกษาตอนต้น", "มัธยมศึกษาตอนปลาย"],
        },
        {
          id: "j3",
          title: "ครูช่วยสอน (TA)",
          salary: "25,000 - 30,000",
          type: "Full-time",
          gradeLevels: ["ประถมศึกษา"],
        },
        {
          id: "j4",
          title: "ครูสอนพละศึกษา",
          salary: "35,000 - 45,000",
          type: "Full-time",
          gradeLevels: ["มัธยมศึกษาตอนต้น", "มัธยมศึกษาตอนปลาย"],
        },
        {
          id: "j5",
          title: "ครูสอนดนตรี",
          salary: "40,000 - 55,000",
          type: "Full-time",
          gradeLevels: ["ประถมศึกษา", "มัธยมศึกษาตอนต้น"],
        },
      ],
    },
    {
      id: "2",
      name: "สถาบันกวดวิชาออนดีมานด์",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=OD",
      province: "นนทบุรี",
      type: "สถาบันกวดวิชา",
      jobCount: 3,
      jobs: [
        {
          id: "j6",
          title: "ครูสอนฟิสิกส์ (TCAS)",
          salary: "40,000 - 80,000",
          type: "Part-time",
          gradeLevels: ["มัธยมศึกษาตอนปลาย"],
        },
        {
          id: "j7",
          title: "ครูสอนเคมี",
          salary: "35,000 - 70,000",
          type: "Part-time",
          gradeLevels: ["มัธยมศึกษาตอนปลาย"],
        },
        {
          id: "j8",
          title: "ผู้ช่วยสอนวิทย์-คณิต",
          salary: "18,000 - 25,000",
          type: "Full-time",
          gradeLevels: ["มัธยมศึกษาตอนต้น"],
        },
      ],
    },
    {
      id: "3",
      name: "โรงเรียนสาธิตมหาวิทยาลัยเชียงใหม่",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=CMU",
      province: "เชียงใหม่",
      type: "โรงเรียนรัฐบาล",
      jobCount: 2,
      jobs: [
        {
          id: "j9",
          title: "ครูประจำชั้นประถมศึกษา",
          salary: "20,000 - 35,000",
          type: "Full-time",
          gradeLevels: ["ประถมศึกษา"],
        },
        {
          id: "j10",
          title: "ครูสอนศิลปะ",
          salary: "18,000 - 30,000",
          type: "Full-time",
          gradeLevels: ["ประถมศึกษา", "มัธยมศึกษาตอนต้น"],
        },
      ],
    },
    {
      id: "4",
      name: "โรงเรียนกรุงเทพคริสเตียนวิทยาลัย",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=BCC",
      province: "กรุงเทพมหานคร",
      type: "โรงเรียนเอกชน",
      jobCount: 4,
      jobs: [
        {
          id: "j11",
          title: "ครูสอนสังคมศึกษา",
          salary: "25,000 - 40,000",
          type: "Full-time",
          gradeLevels: ["มัธยมศึกษาตอนต้น"],
        },
        {
          id: "j12",
          title: "ครูสอนภาษาไทย",
          salary: "22,000 - 35,000",
          type: "Full-time",
          gradeLevels: ["ประถมศึกษา", "มัธยมศึกษาตอนต้น"],
        },
        {
          id: "j13",
          title: "ครูสอนวิทยาศาสตร์",
          salary: "28,000 - 45,000",
          type: "Full-time",
          gradeLevels: ["มัธยมศึกษาตอนปลาย"],
        },
        {
          id: "j14",
          title: "หัวหน้าฝ่ายวิชาการ",
          salary: "50,000 - 80,000",
          type: "Full-time",
          gradeLevels: ["มัธยมศึกษาตอนต้น", "มัธยมศึกษาตอนปลาย"],
        },
      ],
    },
    {
      id: "5",
      name: "โรงเรียนร่วมฤดีวิทยาส่วนภูมิภาค",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=RIS",
      province: "ระยอง",
      type: "โรงเรียนนานาชาติ",
      jobCount: 2,
      jobs: [
        {
          id: "j15",
          title: "English Native Speaker",
          salary: "70,000 - 90,000",
          type: "Full-time",
          gradeLevels: ["มัธยมศึกษาตอนต้น", "มัธยมศึกษาตอนปลาย"],
        },
        {
          id: "j16",
          title: "Science Teacher (AP Curriculum)",
          salary: "65,000 - 85,000",
          type: "Full-time",
          gradeLevels: ["มัธยมศึกษาตอนปลาย"],
        },
      ],
    },
  ],
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setProvinceFilter: (provinceFilter) => set({ provinceFilter }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setGradeFilter: (gradeFilter) => set({ gradeFilter }),
  setContractFilter: (contractFilter) => set({ contractFilter }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSelectedSchool: (selectedSchool) => set({ selectedSchool }),
  setIsDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),
}));
