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
  isLoadingMore: boolean;
  hasMore: boolean;
  nextCursor: string | null;
  filters: JobFilters;
  selectedJob: Job | null;
  isDrawerOpen: boolean;
  pageSize: number;
  fetchJobs: () => Promise<void>;   // ✨ โหลดครั้งแรก (reset list)
  loadMore: () => Promise<void>;    // ✨ โหลดเพิ่มเติม (append)
  setFilters: (filters: Partial<JobFilters>) => void;
  resetFilters: () => void;
  setSelectedJob: (job: Job | null) => void;
  setIsDrawerOpen: (open: boolean) => void;
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

// ✨ แปลง filters → query params
const buildParams = (filters: JobFilters, cursor?: string | null, pageSize = 10) => {
  const province = filters.location
    ? LOCATION_MAP[filters.location] ?? filters.location
    : undefined;

  const licenseMap: Record<string, string> = {
    required: "required",
    "not-required": "not_required",
    pending: "pending_ok",
  };

  return {
    ...(filters.keyword && { keyword: filters.keyword }),
    ...(province && { province }),
    ...(filters.schoolType && { school_type: filters.schoolType }),
    ...(filters.license && { license: licenseMap[filters.license] }),
    ...(filters.gradeLevel && { grade_level: filters.gradeLevel }),
    ...(filters.salaryRange[0] > 0 && { salary_min: filters.salaryRange[0] }),
    ...(filters.salaryRange[1] < 100000 && { salary_max: filters.salaryRange[1] }),
    ...(cursor ? { cursor } : {}),
    page_size: pageSize,
  };
};

export const useJobSearchStore = create<JobSearchState>((set, get) => ({
  jobs: [],
  isLoading: false,
  isLoadingMore: false,
  hasMore: false,
  nextCursor: null,
  filters: DEFAULT_FILTERS,
  selectedJob: null,
  isDrawerOpen: false,
  pageSize: 10,

  // ✨ โหลดครั้งแรก — reset list
  fetchJobs: async () => {
    const { filters, pageSize } = get();
    set({ isLoading: true, jobs: [], hasMore: false, nextCursor: null });

    try {
      const params = buildParams(filters, null, pageSize);
      const response = await fetchJobList(params);

      if (response.status_code === 200 && response.data) {
        set({
          jobs: response.data.jobs,
          hasMore: response.data.has_more,
          nextCursor: response.data.next_cursor,
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

  // ✨ โหลดเพิ่มเติม — append เข้า list เดิม
  loadMore: async () => {
    const { filters, pageSize, nextCursor, isLoadingMore, hasMore } = get();
    if (!hasMore || isLoadingMore) return;

    set({ isLoadingMore: true });

    try {
      const params = buildParams(filters, nextCursor, pageSize);
      const response = await fetchJobList(params);

      if (response.status_code === 200 && response.data) {
        set((state) => ({
          jobs: [...state.jobs, ...response.data.jobs],
          hasMore: response.data.has_more,
          nextCursor: response.data.next_cursor,
          isLoadingMore: false,
        }));
      } else {
        set({ isLoadingMore: false });
      }
    } catch (error) {
      console.error("❌ loadMore:", error);
      set({ isLoadingMore: false });
    }
  },

  // ✨ เปลี่ยน filter → reset cursor และโหลดใหม่
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial }, nextCursor: null })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS, nextCursor: null }),

  setSelectedJob: (selectedJob) => set({ selectedJob }),

  setIsDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),

  // ✨ เปิด Drawer พร้อมเซ็ต Job ที่เลือก
  openJobDrawer: (job) => set({ selectedJob: job, isDrawerOpen: true }),

  // ✨ ส่งคืน jobs จาก store โดยตรง
  getFilteredJobs: () => get().jobs,
}));
