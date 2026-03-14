import { create } from "zustand";

interface JobPostState {
  isSubmitting: boolean;
  salaryType: string;
  setSalaryType: (type: string) => void;
  setSubmitting: (submitting: boolean) => void;
  reset: () => void;
}

export const useJobPostStore = create<JobPostState>((set) => ({
  isSubmitting: false,
  salaryType: "SPECIFY",
  setSalaryType: (type) => set({ salaryType: type }),
  setSubmitting: (submitting) => set({ isSubmitting: submitting }),
  reset: () => set({ isSubmitting: false, salaryType: "SPECIFY" }),
}));
