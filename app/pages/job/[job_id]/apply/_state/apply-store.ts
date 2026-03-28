import { create } from "zustand";

interface ApplyState {
  currentStep: number;
  resumeOption: string;
  coverLetterOption: string;
  selectedResume: string | undefined;
  isConfirmModalOpen: boolean;
  setCurrentStep: (step: number) => void;
  setResumeOption: (option: string) => void;
  setCoverLetterOption: (option: string) => void;
  setSelectedResume: (resume: string | undefined) => void;
  setIsConfirmModalOpen: (open: boolean) => void;
  reset: () => void;
}

export const useApplyStore = create<ApplyState>((set) => ({
  currentStep: 0,
  resumeOption: "select",
  coverLetterOption: "none",
  selectedResume: "resume-1",
  isConfirmModalOpen: false,
  setCurrentStep: (step) => set({ currentStep: step }),
  setResumeOption: (option) => set({ resumeOption: option }),
  setCoverLetterOption: (option) => set({ coverLetterOption: option }),
  setSelectedResume: (resume) => set({ selectedResume: resume }),
  setIsConfirmModalOpen: (isConfirmModalOpen) => set({ isConfirmModalOpen }),
  reset: () =>
    set({
      currentStep: 0,
      resumeOption: "select",
      coverLetterOption: "none",
      selectedResume: "resume-1",
      isConfirmModalOpen: false,
    }),
}));
