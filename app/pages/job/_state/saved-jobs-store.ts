import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SavedJobsState {
  savedJobIds: string[];
  toggleSavedJob: (id: string) => void;
  isSaved: (id: string) => boolean;
  clearSavedJobs: () => void;
}

export const useSavedJobsStore = create<SavedJobsState>()(
  persist(
    (set, get) => ({
      savedJobIds: [],
      toggleSavedJob: (id) =>
        set((state) => ({
          savedJobIds: state.savedJobIds.includes(id)
            ? state.savedJobIds.filter((jid) => jid !== id)
            : [...state.savedJobIds, id],
        })),
      isSaved: (id) => get().savedJobIds.includes(id),
      clearSavedJobs: () => set({ savedJobIds: [] }),
    }),
    { name: "saved-jobs-store" }
  )
);
