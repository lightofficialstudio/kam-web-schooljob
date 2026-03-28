import { create } from "zustand";

interface Job {
  id: string;
  title: string;
  salary: string;
  type: string;
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

interface SchoolState {
  searchQuery: string;
  provinceFilter: string | null;
  typeFilter: string | null;
  selectedSchool: School | null;
  isDrawerOpen: boolean;
  schools: School[];
  setSearchQuery: (query: string) => void;
  setProvinceFilter: (province: string | null) => void;
  setTypeFilter: (type: string | null) => void;
  setSelectedSchool: (school: School | null) => void;
  setIsDrawerOpen: (isOpen: boolean) => void;
}

export const useSchoolStore = create<SchoolState>((set) => ({
  searchQuery: "",
  provinceFilter: null,
  typeFilter: null,
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
        },
        {
          id: "j2",
          title: "ครูสอนคณิตศาสตร์ (Secondary)",
          salary: "50,000 - 70,000",
          type: "Full-time",
        },
        {
          id: "j3",
          title: "ครูช่วยสอน (TA)",
          salary: "25,000 - 30,000",
          type: "Full-time",
        },
        {
          id: "j4",
          title: "ครูสอนพละศึกษา",
          salary: "35,000 - 45,000",
          type: "Full-time",
        },
        {
          id: "j5",
          title: "ครูสอนดนตรี",
          salary: "40,000 - 55,000",
          type: "Full-time",
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
        },
        {
          id: "j7",
          title: "ครูสอนเคมี",
          salary: "35,000 - 70,000",
          type: "Part-time",
        },
        {
          id: "j8",
          title: "ผู้ช่วยสอนวิทย์-คณิต",
          salary: "18,000 - 25,000",
          type: "Full-time",
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
        },
        {
          id: "j10",
          title: "ครูสอนศิลปะ",
          salary: "18,000 - 30,000",
          type: "Full-time",
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
        },
        {
          id: "j12",
          title: "ครูสอนภาษาไทย",
          salary: "22,000 - 35,000",
          type: "Full-time",
        },
        {
          id: "j13",
          title: "ครูสอนวิทยาศาสตร์",
          salary: "28,000 - 45,000",
          type: "Full-time",
        },
        {
          id: "j14",
          title: "หัวหน้าฝ่ายวิชาการ",
          salary: "50,000 - 80,000",
          type: "Full-time",
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
          title: "English Native Speaker (Employee)",
          salary: "70,000 - 90,000",
          type: "Full-time",
        },
        {
          id: "j16",
          title: "Science Teacher (AP Curriculum)",
          salary: "65,000 - 85,000",
          type: "Full-time",
        },
      ],
    },
  ],
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setProvinceFilter: (provinceFilter) => set({ provinceFilter }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setSelectedSchool: (selectedSchool) => set({ selectedSchool }),
  setIsDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),
}));
