import { create } from 'zustand';

interface SearchState {
  examYear: string;
  startDate: string;
  studyFormat: string;
  subject: string;
  
  // Actions
  setExamYear: (year: string) => void;
  setStartDate: (date: string) => void;
  setStudyFormat: (format: string) => void;
  setSubject: (subject: string) => void;
  resetAll: () => void;
}

export const useStore = create<SearchState>((set) => ({
  examYear: '',
  startDate: '',
  studyFormat: '',
  subject: '',

  setExamYear: (year) => set({ examYear: year }),
  setStartDate: (date) => set({ startDate: date }),
  setStudyFormat: (format) => set({ studyFormat: format }),
  setSubject: (subject) => set({ subject: subject }),
  
  resetAll: () => set({
    examYear: '',
    startDate: '',
    studyFormat: '',
    subject: '',
  }),
}));
