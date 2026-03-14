import { create } from "zustand";

interface School {
  id: string;
  name: string;
  logo: string;
  province: string;
  type: string;
  jobCount: number;
}

interface SchoolState {
  searchQuery: string;
  provinceFilter: string | null;
  typeFilter: string | null;
  schools: School[];
  setSearchQuery: (query: string) => void;
  setProvinceFilter: (province: string | null) => void;
  setTypeFilter: (type: string | null) => void;
}

export const useSchoolStore = create<SchoolState>((set) => ({
  searchQuery: "",
  provinceFilter: null,
  typeFilter: null,
  schools: [
    {
      id: "1",
      name: "โรงเรียนนานาชาติเซนต์แอนดรูว์ส",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=SA",
      province: "กรุงเทพมหานคร",
      type: "โรงเรียนนานาชาติ",
      jobCount: 5,
    },
    {
      id: "2",
      name: "สถาบันกวดวิชาออนดีมานด์",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=OD",
      province: "นนทบุรี",
      type: "กวดวิชา",
      jobCount: 3,
    },
    {
      id: "3",
      name: "โรงเรียนสาธิตมหาวิทยาลัยเชียงใหม่",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=CMU",
      province: "เชียงใหม่",
      type: "โรงเรียน",
      jobCount: 2,
    },
  ],
  setSearchQuery: (query) => set({ searchQuery: query }),
  setProvinceFilter: (province) => set({ provinceFilter: province }),
  setTypeFilter: (type) => set({ typeFilter: type }),
}));
