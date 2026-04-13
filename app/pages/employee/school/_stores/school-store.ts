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

type SortBy = "latest" | "most_jobs";

interface SchoolState {
  schools: School[];
  isLoading: boolean;
  searchQuery: string;
  provinceFilter: string | null;
  typeFilter: string | null;
  gradeFilter: string | null;
  contractFilter: string | null;
  sortBy: SortBy;
  selectedSchool: School | null;
  isDrawerOpen: boolean;
  fetchSchoolList: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setProvinceFilter: (province: string | null) => void;
  setTypeFilter: (type: string | null) => void;
  setGradeFilter: (grade: string | null) => void;
  setContractFilter: (contract: string | null) => void;
  setSortBy: (sortBy: SortBy) => void;
  setSelectedSchool: (school: School | null) => void;
  setIsDrawerOpen: (isOpen: boolean) => void;
}

export const useSchoolStore = create<SchoolState>((set, get) => ({
  schools: [],
  isLoading: false,
  searchQuery: "",
  provinceFilter: null,
  typeFilter: null,
  gradeFilter: null,
  contractFilter: null,
  sortBy: "latest",
  selectedSchool: null,
  isDrawerOpen: false,

  // ✨ ดึงโรงเรียนจาก API
  fetchSchoolList: async () => {
    const { searchQuery, provinceFilter, typeFilter } = get();
    set({ isLoading: true });
    try {
      const response = await fetchSchools({
        ...(searchQuery && { keyword: searchQuery }),
        ...(provinceFilter && { province: provinceFilter }),
        ...(typeFilter && { school_type: typeFilter }),
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
  setGradeFilter: (gradeFilter) => set({ gradeFilter }),
  setContractFilter: (contractFilter) => set({ contractFilter }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSelectedSchool: (selectedSchool) => set({ selectedSchool }),
  setIsDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),
}));
