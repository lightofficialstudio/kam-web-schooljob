import { create } from "zustand";

type ModalType = "success" | "error" | "warning" | "info";

interface ModalState {
  open: boolean;
  type: ModalType;
  mainTitle: string;
  description: string;
}

interface SigninState {
  isLoading: boolean;
  modal: ModalState;
  setLoading: (loading: boolean) => void;
  showModal: (type: ModalType, mainTitle: string, description: string) => void;
  hideModal: () => void;
}

const DEFAULT_MODAL: ModalState = {
  open: false,
  type: "info",
  mainTitle: "",
  description: "",
};

export const useSigninStore = create<SigninState>((set) => ({
  isLoading: false,
  modal: DEFAULT_MODAL,
  setLoading: (isLoading) => set({ isLoading }),
  showModal: (type, mainTitle, description) =>
    set({ modal: { open: true, type, mainTitle, description } }),
  hideModal: () =>
    set((state) => ({ modal: { ...state.modal, open: false } })),
}));
