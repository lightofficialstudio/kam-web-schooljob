import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchMyApplications } from "../_api/job-search-api";

export type ApplicationStatus =
  | "submitted"
  | "acknowledged"
  | "interview"
  | "pending_result"
  | "accepted"
  | "rejected";

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  schoolName: string;
  appliedAt: string;
  status: ApplicationStatus;
  interviewDate?: string;
}

interface ApplicationTrackerState {
  applications: JobApplication[];
  isTrackerOpen: boolean;
  isLoading: boolean;
  fetchApplications: (userId: string) => Promise<void>;
  setIsTrackerOpen: (open: boolean) => void;
  addApplication: (app: JobApplication) => void;
  updateStatus: (id: string, status: ApplicationStatus) => void;
}

export const useApplicationTrackerStore = create<ApplicationTrackerState>()(
  persist(
    (set) => ({
      applications: [],
      isTrackerOpen: false,
      isLoading: false,

      // ✨ ดึงใบสมัครจาก API ตาม userId
      fetchApplications: async (userId: string) => {
        set({ isLoading: true });
        try {
          const response = await fetchMyApplications(userId);
          if (response.status_code === 200 && response.data) {
            set({ applications: response.data, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error("❌ fetchApplications:", error);
          set({ isLoading: false });
        }
      },

      setIsTrackerOpen: (isTrackerOpen) => set({ isTrackerOpen }),

      addApplication: (app) =>
        set((state) => ({ applications: [app, ...state.applications] })),

      updateStatus: (id, status) =>
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id ? { ...a, status } : a,
          ),
        })),
    }),
    { name: "application-tracker-store" },
  ),
);
