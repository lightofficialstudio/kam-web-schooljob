import { create } from "zustand";
import { fetchJobStats } from "../_api/job-read-api";

export interface PipelineStep {
  label: string;
  count: number;
  color: string;
}

export interface DailyTrend {
  date: string;
  views: number;
  applicants: number;
}

export interface BreakdownItem {
  label: string;
  count: number;
  percent: number;
}

export interface JobStatsData {
  jobId: string;
  jobTitle: string;
  publishedAt: string;
  expiresAt: string;
  totalViews: number;
  totalApplicants: number;
  newApplicants: number;
  conversionRate: string;
  avgTimeToApply: string;
  pipeline: PipelineStep[];
  dailyTrend: DailyTrend[];
  sources: BreakdownItem[];
  experienceLevels: BreakdownItem[];
}

// State สำหรับ Modal สถิติของแต่ละตำแหน่งงาน
interface JobStatsModalState {
  isOpen: boolean;
  stats: JobStatsData | null;
  isLoading: boolean;
  openModal: (jobId: string, userId: string) => void;
  closeModal: () => void;
}

export const useJobStatsModalStore = create<JobStatsModalState>((set) => ({
  isOpen: false,
  stats: null,
  isLoading: false,

  // ✨ เปิด Modal พร้อมโหลดสถิติจริงจาก API
  openModal: async (jobId, userId) => {
    set({ isOpen: true, stats: null, isLoading: true });
    try {
      const data = await fetchJobStats(userId, jobId);
      set({ stats: data as JobStatsData });
    } catch (err) {
      console.error("❌ [job-stats-modal-store] openModal error:", err);
      set({ stats: null });
    } finally {
      set({ isLoading: false });
    }
  },

  closeModal: () => set({ isOpen: false, stats: null }),
}));
