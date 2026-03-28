import { create } from "zustand";

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

// ข้อมูล Mock สำหรับรายการงานของ Employer
const MOCK_JOBS: JobRecord[] = [
  {
    key: "1",
    title: "ครูสอนภาษาอังกฤษ (Full-time)",
    subjects: ["ภาษาอังกฤษ", "Conversation"],
    grades: ["มัธยมต้น", "มัธยมปลาย"],
    publishedAt: "2026-03-01",
    expiresAt: "2026-03-31",
    status: "ACTIVE",
    views: 1240,
    applicants: 45,
    newApplicants: 12,
    conversionRate: "3.6%",
    salary: "25,000 - 35,000 บาท",
  },
  {
    key: "2",
    title: "ครูสอนคณิตศาสตร์ (Part-time)",
    subjects: ["คณิตศาสตร์", "Calculus"],
    grades: ["มัธยมปลาย"],
    publishedAt: "2026-02-15",
    expiresAt: "2026-03-15",
    status: "ACTIVE",
    views: 850,
    applicants: 18,
    newApplicants: 3,
    conversionRate: "2.1%",
    salary: "ตามตกลง",
  },
  {
    key: "3",
    title: "ครูประจำชั้นอนุบาล 3",
    subjects: ["ปฐมวัย"],
    grades: ["อนุบาล"],
    publishedAt: "2025-12-01",
    expiresAt: "2026-01-01",
    status: "CLOSED",
    views: 2100,
    applicants: 89,
    newApplicants: 0,
    conversionRate: "4.2%",
    salary: "18,000 - 22,000 บาท",
  },
];

interface JobReadState {
  jobs: JobRecord[];
  searchKeyword: string;
  activeTab: string;
  isLoading: boolean;
  setJobs: (jobs: JobRecord[]) => void;
  setSearchKeyword: (keyword: string) => void;
  setActiveTab: (tab: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useJobReadStore = create<JobReadState>((set) => ({
  jobs: MOCK_JOBS,
  searchKeyword: "",
  activeTab: "ACTIVE",
  isLoading: false,
  setJobs: (jobs) => set({ jobs }),
  setSearchKeyword: (searchKeyword) => set({ searchKeyword }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setLoading: (isLoading) => set({ isLoading }),
}));
