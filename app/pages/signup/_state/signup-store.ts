import type { ReactNode } from "react";
import { create } from "zustand";

type ModalType = "success" | "error" | "warning" | "info";

interface ModalState {
  open: boolean;
  type: ModalType;
  mainTitle: string;
  description: string | ReactNode;
}

interface SignupState {
  isLoading: boolean;
  modal: ModalState;
  setLoading: (loading: boolean) => void;
  showModal: (type: ModalType, mainTitle: string, description: string | ReactNode) => void;
  hideModal: () => void;
}

const DEFAULT_MODAL: ModalState = {
  open: false,
  type: "info",
  mainTitle: "",
  description: "",
};

export const useSignupStore = create<SignupState>((set) => ({
  isLoading: false,
  modal: DEFAULT_MODAL,
  setLoading: (isLoading) => set({ isLoading }),
  showModal: (type, mainTitle, description) =>
    set({ modal: { open: true, type, mainTitle, description } }),
  hideModal: () =>
    set((state) => ({ modal: { ...state.modal, open: false } })),
}));
