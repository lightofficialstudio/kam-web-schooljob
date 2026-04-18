import { create } from "zustand";
import { fetchJobById, fetchJobList, fetchJobOptions } from "../_api/job-search-api";
import { buildCascaderTree, type CascaderNode } from "@/app/pages/landing/_api/landing-api";

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
  qualifications: string;
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

// ✨ URL ข้อมูลภูมิศาสตร์ไทยจาก GitHub
const BASE_GEO = "https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest";

interface Province { id: number; name_th: string; }
interface District { id: number; name_th: string; province_id: number; }

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
  // ✨ Options สำหรับ dropdown — โหลดจาก API/GitHub
  jobCategories: CascaderNode[];
  geoOptions: CascaderNode[];
  schoolTypeOptions: { value: string; label: string }[];
  isLoadingCategories: boolean;
  isLoadingGeo: boolean;
  fetchOptions: () => Promise<void>;        // ✨ โหลด categories + geo + school_type
  fetchJobs: () => Promise<void>;           // ✨ โหลดครั้งแรก (reset list)
  loadMore: () => Promise<void>;            // ✨ โหลดเพิ่มเติม (append)
  fetchAndOpenJob: (id: string) => Promise<void>; // ✨ ดึง job แล้วเปิด Drawer (จาก URL param)
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
  // location อาจเป็น string (province) หรือมาจาก Cascader เดิม
  const province = filters.location ?? undefined;

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
    ...(filters.employmentType && { job_type: filters.employmentType }),
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
  jobCategories: [],
  geoOptions: [],
  schoolTypeOptions: [],
  isLoadingCategories: false,
  isLoadingGeo: false,

  // ✨ โหลด job_category + geo + school_type พร้อมกัน
  fetchOptions: async () => {
    set({ isLoadingCategories: true, isLoadingGeo: true });
    try {
      const [catOptions, schoolTypeOptions, geoData] = await Promise.all([
        fetchJobOptions("job_category"),
        fetchJobOptions("school_type"),
        Promise.all([
          fetch(`${BASE_GEO}/province.json`).then((r) => r.json() as Promise<Province[]>),
          fetch(`${BASE_GEO}/district.json`).then((r) => r.json() as Promise<District[]>),
        ]),
      ]);

      // ✨ สร้าง tree สำหรับ Job Categories
      const jobCategories = buildCascaderTree(catOptions);

      // ✨ School type flat options
      const schoolTypes = schoolTypeOptions.map((o: { value: string; label: string }) => ({
        value: o.value,
        label: o.label,
      }));

      // ✨ สร้าง tree จังหวัด → เขต/อำเภอ
      const [provinces, districts] = geoData;
      const geoOptions: CascaderNode[] = provinces.map((p) => ({
        label: p.name_th,
        value: p.name_th,
        children: districts
          .filter((d) => d.province_id === p.id)
          .map((d) => ({ label: d.name_th, value: d.name_th })),
      }));

      set({
        jobCategories,
        schoolTypeOptions: schoolTypes,
        geoOptions,
        isLoadingCategories: false,
        isLoadingGeo: false,
      });
    } catch (err) {
      console.error("❌ fetchOptions:", err);
      set({ isLoadingCategories: false, isLoadingGeo: false });
    }
  },


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

  // ✨ ดึง job เดี่ยวแล้วเปิด Drawer — ใช้เมื่อมาจาก ?job_id= URL param
  fetchAndOpenJob: async (id: string) => {
    try {
      const res = await fetchJobById(id);
      if (res.status_code !== 200 || !res.data) return;
      const d = res.data;
      // ✨ แมป response → Job interface
      const job: Job = {
        id: d.id,
        title: d.title,
        subjects: d.subjects ?? [],
        grades: d.grades ?? [],
        vacancyCount: d.positionsAvailable ?? 1,
        salaryType: d.salaryNegotiable
          ? "ตามประสบการณ์"
          : d.salaryMin || d.salaryMax
            ? "ระบุเงินเดือน"
            : "ไม่ระบุ",
        salaryMin: d.salaryMin ?? undefined,
        salaryMax: d.salaryMax ?? undefined,
        description: d.description ?? "",
        educationLevel: d.educationLevel ?? "",
        teachingExperience: d.experience ?? "",
        qualifications: d.qualifications ?? "",
        licenseRequired: d.licenseRequired ?? "",
        gender: d.gender ?? "ไม่จำกัด",
        jobType: d.jobType ?? undefined,
        schoolName: d.schoolName ?? "",
        schoolType: d.schoolType ?? "",
        province: d.province ?? "",
        address: d.province ?? "",
        logoUrl: d.logoUrl ?? undefined,
        benefits: d.benefits ?? [],
        deadline: d.deadline ?? null,
        postedAt: d.postedAt ?? new Date().toISOString(),
        isNew: false,
      };
      set({ selectedJob: job, isDrawerOpen: true });
    } catch (err) {
      console.error("❌ fetchAndOpenJob:", err);
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
