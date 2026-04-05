import { create } from "zustand";
import { fetchJobList, requestCloseJob } from "../_api/job-read-api";

export interface JobRecord {
  key: string;
  title: string;
  subjects: string[];
  grades: string[];
  publishedAt: string;
  expiresAt: string;
  status: "ACTIVE" | "CLOSED" | "DRAFT";
  views: number;
  applicants: number;
  newApplicants: number;
  conversionRate: string;
  salary: string;
}

// ✨ แปลงข้อมูลจาก DB → JobRecord สำหรับ UI
const mapDbJobToRecord = (job: Record<string, unknown>): JobRecord => {
  const subjects = ((job.jobSubjects as { subject: string }[]) ?? []).map(
    (s) => s.subject,
  );
  const grades = ((job.jobGrades as { grade: string }[]) ?? []).map(
    (g) => g.grade,
  );

  const min = job.salaryMin as number | null;
  const max = job.salaryMax as number | null;
  const negotiable = job.salaryNegotiable as boolean;
  let salary = "ตามตกลง";
  if (!negotiable && min && max) {
    salary = `${min.toLocaleString()} - ${max.toLocaleString()} บาท`;
  } else if (!negotiable && min) {
    salary = `${min.toLocaleString()} บาท`;
  }

  const statusRaw = job.status as string;
  const status: JobRecord["status"] =
    statusRaw === "OPEN"
      ? "ACTIVE"
      : statusRaw === "CLOSED"
        ? "CLOSED"
        : "DRAFT";

  const createdAt = job.createdAt as string | null;
  const deadline = job.deadline as string | null;

  return {
    key: job.id as string,
    title: job.title as string,
    subjects,
    grades,
    publishedAt: createdAt
      ? new Date(createdAt).toISOString().split("T")[0]
      : "-",
    expiresAt: deadline ? new Date(deadline).toISOString().split("T")[0] : "-",
    status,
    views: 0,
    applicants: 0,
    newApplicants: 0,
    conversionRate: "0%",
    salary,
  };
};

interface JobReadState {
  jobs: JobRecord[];
  searchKeyword: string;
  activeTab: string;
  isLoading: boolean;
  setJobs: (jobs: JobRecord[]) => void;
  setSearchKeyword: (keyword: string) => void;
  setActiveTab: (tab: string) => void;
  setLoading: (loading: boolean) => void;
  fetchJobs: (userId: string) => Promise<void>;
  closeJob: (userId: string, jobId: string) => Promise<void>;
}

export const useJobReadStore = create<JobReadState>((set, get) => ({
  jobs: [],
  searchKeyword: "",
  activeTab: "ACTIVE",
  isLoading: false,
  setJobs: (jobs) => set({ jobs }),
  setSearchKeyword: (searchKeyword) => set({ searchKeyword }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setLoading: (isLoading) => set({ isLoading }),

  // ✨ โหลดรายการประกาศงานจาก API จริง
  fetchJobs: async (userId: string) => {
    set({ isLoading: true });
    try {
      const rawList = await fetchJobList(userId);
      const jobs = (rawList as Record<string, unknown>[]).map(mapDbJobToRecord);
      set({ jobs });
    } catch (err) {
      console.error("❌ [job-read-store] fetchJobs error:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  // ✨ ปิดรับสมัครประกาศงาน แล้ว refresh รายการ
  closeJob: async (userId: string, jobId: string) => {
    await requestCloseJob(userId, jobId);
    await get().fetchJobs(userId);
  },
}));
