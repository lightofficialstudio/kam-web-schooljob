import { create } from "zustand";
import { persist } from "zustand/middleware";

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

// Mock ใบสมัครที่อยู่ในสถานะต่างๆ — จะแทนที่ด้วย API จริง
const MOCK_APPLICATIONS: JobApplication[] = [
  {
    id: "app-1",
    jobId: "1",
    jobTitle: "ครูสอนภาษาอังกฤษ (English Teacher)",
    schoolName: "โรงเรียนนานาชาติแสงทอง",
    appliedAt: "2026-03-20T10:00:00Z",
    status: "interview",
    interviewDate: "2026-04-02T09:00:00Z",
  },
  {
    id: "app-2",
    jobId: "2",
    jobTitle: "ครูสอนคณิตศาสตร์",
    schoolName: "โรงเรียนประถมวิทยา",
    appliedAt: "2026-03-18T14:00:00Z",
    status: "acknowledged",
  },
  {
    id: "app-3",
    jobId: "3",
    jobTitle: "ครูสอนวิทยาศาสตร์ (ฟิสิกส์)",
    schoolName: "โรงเรียนสาธิตเกษตร",
    appliedAt: "2026-03-15T09:30:00Z",
    status: "pending_result",
  },
  {
    id: "app-4",
    jobId: "5",
    jobTitle: "ครูสอนคอมพิวเตอร์และ Coding",
    schoolName: "โรงเรียนเทคโนวิทยา",
    appliedAt: "2026-03-10T11:00:00Z",
    status: "accepted",
  },
  {
    id: "app-5",
    jobId: "7",
    jobTitle: "ครูสอนศิลปะ (Art Teacher)",
    schoolName: "โรงเรียนสร้างสรรค์วิทย์",
    appliedAt: "2026-03-05T10:00:00Z",
    status: "rejected",
  },
];

interface ApplicationTrackerState {
  applications: JobApplication[];
  isTrackerOpen: boolean;
  setIsTrackerOpen: (open: boolean) => void;
  addApplication: (app: JobApplication) => void;
  updateStatus: (id: string, status: ApplicationStatus) => void;
}

export const useApplicationTrackerStore = create<ApplicationTrackerState>()(
  persist(
    (set) => ({
      applications: MOCK_APPLICATIONS,
      isTrackerOpen: false,
      setIsTrackerOpen: (isTrackerOpen) => set({ isTrackerOpen }),
      addApplication: (app) =>
        set((state) => ({ applications: [app, ...state.applications] })),
      updateStatus: (id, status) =>
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        })),
    }),
    { name: "application-tracker-store" }
  )
);
