import { create } from "zustand";

// ประเภทของ Search Parameters
export interface SearchParams {
  keyword: string;
  category: string[][];
  location: string | null;
  employmentType: string | null;
  license: string | null;
  salaryRange: string | null;
  postedAt: string | null;
}

interface LandingStore {
  searchParams: SearchParams;
  // อัปเดต search param ทีละ field
  setSearchParam: <K extends keyof SearchParams>(
    key: K,
    value: SearchParams[K]
  ) => void;
  // รีเซ็ตทุก field กลับค่าเริ่มต้น
  resetSearchParams: () => void;
  // สร้าง URLSearchParams สำหรับ navigate ไป /pages/job
  buildQueryString: () => string;
}

const DEFAULT_PARAMS: SearchParams = {
  keyword: "",
  category: [],
  location: null,
  employmentType: null,
  license: null,
  salaryRange: null,
  postedAt: null,
};

export const useLandingStore = create<LandingStore>((set, get) => ({
  searchParams: { ...DEFAULT_PARAMS },

  setSearchParam: (key, value) =>
    set((state) => ({
      searchParams: { ...state.searchParams, [key]: value },
    })),

  resetSearchParams: () => set({ searchParams: { ...DEFAULT_PARAMS } }),

  buildQueryString: () => {
    const { searchParams } = get();
    const params = new URLSearchParams();
    if (searchParams.keyword) params.append("keyword", searchParams.keyword);
    if (searchParams.location) params.append("location", searchParams.location);
    if (searchParams.employmentType)
      params.append("employmentType", searchParams.employmentType);
    if (searchParams.license) params.append("license", searchParams.license);
    if (searchParams.salaryRange)
      params.append("salaryRange", searchParams.salaryRange);
    if (searchParams.postedAt) params.append("postedAt", searchParams.postedAt);
    if (searchParams.category.length > 0)
      params.append("category", JSON.stringify(searchParams.category));
    return params.toString();
  },
}));
