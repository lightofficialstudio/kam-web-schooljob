import { create } from "zustand";
import { fetchSchools } from "../_api/school-api";

export interface SchoolJob {
  id: string;
  title: string;
  salary: string;
  type: string;
  gradeLevels: string[];
  subjects?: string[];
  licenseRequired?: string;
}

export interface School {
  id: string;
  name: string;
  logo: string;
  province: string;
  type: string;
  jobCount: number;
  jobs: SchoolJob[];
}

export type SortBy = "latest" | "most_jobs";

// ✨ โครงสร้าง node สำหรับ Cascader จังหวัด
export interface GeoOption {
  label: string;
  value: string;
}

// ✨ Quick Filter ประเภทโรงเรียนที่ใช้บ่อย — ใช้ร่วมกันระหว่าง page.tsx และ empty state
export const QUICK_FILTER_TYPES = [
  "โรงเรียนนานาชาติ",
  "โรงเรียนรัฐบาล",
  "โรงเรียนเอกชน",
  "สถาบันกวดวิชา",
];

// ✨ ข้อมูลจาก GitHub thai-province-data
const BASE_GEO =
  "https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest";

interface Province {
  id: number;
  name_th: string;
}

interface SchoolState {
  schools: School[];
  isLoading: boolean;
  isLoadingGeo: boolean;
  searchQuery: string;
  provinceFilter: string | null;
  typeFilter: string | null;
  sortBy: SortBy;
  selectedSchool: School | null;
  isDrawerOpen: boolean;
  // ✨ จังหวัดทั้งหมดดึงจาก GitHub API
  provinceOptions: GeoOption[];
  fetchSchoolList: () => Promise<void>;
  fetchProvinces: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setProvinceFilter: (province: string | null) => void;
  setTypeFilter: (type: string | null) => void;
  setSortBy: (sortBy: SortBy) => void;
  setSelectedSchool: (school: School | null) => void;
  setIsDrawerOpen: (isOpen: boolean) => void;
}

export const useSchoolStore = create<SchoolState>((set, get) => ({
  schools: [],
  isLoading: false,
  isLoadingGeo: false,
  searchQuery: "",
  provinceFilter: null,
  typeFilter: null,
  sortBy: "latest",
  selectedSchool: null,
  isDrawerOpen: false,
  provinceOptions: [],

  // ✨ ดึงรายชื่อจังหวัดจาก GitHub thai-province-data (ครั้งเดียวตอน mount)
  fetchProvinces: async () => {
    if (get().provinceOptions.length > 0) return;
    set({ isLoadingGeo: true });
    try {
      const res = await fetch(`${BASE_GEO}/province.json`);
      const provinces: Province[] = await res.json();
      const provinceOptions: GeoOption[] = provinces.map((p) => ({
        label: p.name_th,
        value: p.name_th,
      }));
      set({ provinceOptions, isLoadingGeo: false });
    } catch (err) {
      console.error("❌ fetchProvinces:", err);
      set({ isLoadingGeo: false });
    }
  },

  // ✨ ดึงโรงเรียนจาก API — filter และ sort ทำโดย API ทั้งหมด
  fetchSchoolList: async () => {
    const { searchQuery, provinceFilter, typeFilter, sortBy } = get();
    set({ isLoading: true });
    try {
      const response = await fetchSchools({
        ...(searchQuery && { keyword: searchQuery }),
        ...(provinceFilter && { province: provinceFilter }),
        ...(typeFilter && { school_type: typeFilter }),
        sort_by: sortBy,
      });
      if (response.status_code === 200 && response.data) {
        set({ schools: response.data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("❌ fetchSchoolList:", error);
      set({ isLoading: false });
    }
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setProvinceFilter: (provinceFilter) => set({ provinceFilter }),
  setTypeFilter: (typeFilter) => set({ typeFilter }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSelectedSchool: (selectedSchool) => set({ selectedSchool }),
  setIsDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),
}));
