import { create } from "zustand";

// ประเภทข้อมูลฟอร์มลงประกาศงาน
interface JobFormData {
  title?: string;
  employmentType?: string;
  vacancyCount?: number;
  subjects?: string[];
  grades?: string[];
  salary_type?: string;
  salaryFrom?: number;
  salaryTo?: number;
  description?: string;
  educationLevel?: string;
  experience?: string;
  license?: string;
  gender?: string;
  qualifications?: string;
  province?: string;
  area?: string;
  address?: string;
  duration?: number;
  status?: boolean;
}

interface JobPostState {
  isSubmitting: boolean;
  salaryType: string;
  initialFormData: JobFormData | null;
  setSalaryType: (type: string) => void;
  setSubmitting: (submitting: boolean) => void;
  setInitialFormData: (data: JobFormData | null) => void;
  reset: () => void;
}

export const useJobPostStore = create<JobPostState>((set) => ({
  isSubmitting: false,
  salaryType: "SPECIFY",
  initialFormData: null,
  setSalaryType: (salaryType) => set({ salaryType }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setInitialFormData: (initialFormData) => set({ initialFormData }),
  reset: () => set({ isSubmitting: false, salaryType: "SPECIFY", initialFormData: null }),
}));
