"use client";

import { create } from "zustand";

// ✨ โครงสร้างใบสมัครงาน 1 รายการ
export interface ApplicationEntry {
  id: string;
  jobId: string;
  jobTitle: string;
  jobType: string | null;
  province: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryNegotiable: boolean;
  deadline: string | null;
  schoolName: string;
  schoolType: string | null;
  schoolLogoUrl: string | null;
  coverLetter: string | null;
  appliedAt: string;
  updatedAt: string;
  status: "submitted" | "interview" | "accepted" | "rejected";
}

interface ApplicationsStore {
  applications: ApplicationEntry[];
  isLoading: boolean;
  setApplications: (applications: ApplicationEntry[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useApplicationsStore = create<ApplicationsStore>((set) => ({
  applications: [],
  isLoading: false,
  setApplications: (applications) => set({ applications }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
