import { create } from "zustand";

interface ApplyState {
  currentStep: number;
  resumeOption: string;
  coverLetterOption: string;
  selectedResume: string | undefined;
  setCurrentStep: (step: number) => void;
  setResumeOption: (option: string) => void;
  setCoverLetterOption: (option: string) => void;
  setSelectedResume: (resume: string | undefined) => void;
  reset: () => void;
}

export const useApplyStore = create<ApplyState>((set) => ({
  currentStep: 0,
  resumeOption: "select",
  coverLetterOption: "none",
  selectedResume: "resume-1",
  setCurrentStep: (step) => set({ currentStep: step }),
  setResumeOption: (option) => set({ resumeOption: option }),
  setCoverLetterOption: (option) => set({ coverLetterOption: option }),
  setSelectedResume: (resume) => set({ selectedResume: resume }),
  reset: () =>
    set({
      currentStep: 0,
      resumeOption: "select",
      coverLetterOption: "none",
      selectedResume: "resume-1",
    }),
}));
