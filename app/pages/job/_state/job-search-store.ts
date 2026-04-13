import { create } from "zustand";
import { fetchJobList } from "../_api/job-search-api";

export interface Job {
  id: string;
  title: string;
  subjects: string[];
  grades: string[];
  vacancyCount: number;
  salaryType: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  educationLevel: string;
  teachingExperience: string;
  licenseRequired: string;
  gender: string;
  jobType?: string;
  schoolName: string;
  schoolType: string;
  province: string;
  address: string;
  logoUrl?: string;
  benefits?: string[];
  applicantCount?: number;
  deadline?: string | null;
  postedAt: string;
  isNew: boolean;
}

export interface JobFilters {
  keyword: string;
  category: string[][];
  location: string | null;
  employmentType: string | null;
  license: string | null;
  salaryRange: [number, number];
  postedAt: string | null;
  schoolType: string | null;
  gradeLevel: string | null;
}

// แผนที่จังหวัดตาม Location Filter
const LOCATION_MAP: Record<string, string> = {
  bkk: "กรุงเทพมหานคร",
  center: "นนทบุรี",
  north: "เชียงใหม่",
  east: "ชลบุรี",
};

interface JobSearchState {
  jobs: Job[];
  isLoading: boolean;
  total: number;
  totalPages: number;
  filters: JobFilters;
  selectedJob: Job | null;
  isDrawerOpen: boolean;
  currentPage: number;
  pageSize: number;
  fetchJobs: () => Promise<void>;
  setFilters: (filters: Partial<JobFilters>) => void;
  resetFilters: () => void;
  setSelectedJob: (job: Job | null) => void;
  setIsDrawerOpen: (open: boolean) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  openJobDrawer: (job: Job) => void;
  getFilteredJobs: () => Job[];
}

const DEFAULT_FILTERS: JobFilters = {
  keyword: "",
  category: [],
  location: null,
  employmentType: null,
  license: null,
  salaryRange: [0, 100000],
  postedAt: null,
  schoolType: null,
  gradeLevel: null,
};

export const useJobSearchStore = create<JobSearchState>((set, get) => ({
  jobs: [],
  isLoading: false,
  total: 0,
  totalPages: 0,
  filters: DEFAULT_FILTERS,
  selectedJob: null,
  isDrawerOpen: false,
  currentPage: 1,
  pageSize: 5,

  // ✨ ดึงงานจาก API พร้อมแปลง filters → query params
  fetchJobs: async () => {
    const { filters, currentPage, pageSize } = get();
    set({ isLoading: true });

    try {
      // ✨ แปลง location → province string
      const province = filters.location
        ? LOCATION_MAP[filters.location] ?? filters.location
        : undefined;

      // ✨ แปลง license filter
      const licenseMap: Record<string, string> = {
        required: "required",
        "not-required": "not_required",
        pending: "pending_ok",
      };

      const params = {
        ...(filters.keyword && { keyword: filters.keyword }),
        ...(province && { province }),
        ...(filters.schoolType && { school_type: filters.schoolType }),
        ...(filters.license && { license: licenseMap[filters.license] }),
        ...(filters.gradeLevel && { grade_level: filters.gradeLevel }),
        ...(filters.salaryRange[0] > 0 && { salary_min: filters.salaryRange[0] }),
        ...(filters.salaryRange[1] < 100000 && { salary_max: filters.salaryRange[1] }),
        page: currentPage,
        page_size: pageSize,
      };

      const response = await fetchJobList(params);

      if (response.status_code === 200 && response.data) {
        set({
          jobs: response.data.jobs,
          total: response.data.total,
          totalPages: response.data.total_pages,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("❌ fetchJobs:", error);
      set({ isLoading: false });
    }
  },

  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial }, currentPage: 1 })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS, currentPage: 1 }),

  setSelectedJob: (selectedJob) => set({ selectedJob }),

  setIsDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),

  setCurrentPage: (currentPage) => set({ currentPage }),

  setPageSize: (pageSize) => set({ pageSize, currentPage: 1 }),

  // ✨ เปิด Drawer พร้อมเซ็ต Job ที่เลือก
  openJobDrawer: (job) => set({ selectedJob: job, isDrawerOpen: true }),

  // ✨ ส่งคืน jobs จาก store โดยตรง (filter ทำโดย API แล้ว)
  getFilteredJobs: () => get().jobs,
}));
