import type { ReactNode } from "react";
import { create } from "zustand";

type ModalType = "success" | "error" | "warning" | "info";

// ✨ role ที่รองรับ — เพิ่มได้ในอนาคต
export type SignupRole = "teacher" | "school";

interface ModalState {
  open: boolean;
  type: ModalType;
  mainTitle: string;
  description: string | ReactNode;
}

interface SignupState {
  // ✨ ขั้นตอนการสมัคร: 1 = เลือก role, 2 = กรอกข้อมูล
  step: 1 | 2;
  role: SignupRole | null;
  isLoading: boolean;
  modal: ModalState;
  setStep: (step: 1 | 2) => void;
  setRole: (role: SignupRole) => void;
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
  step: 1,
  role: null,
  isLoading: false,
  modal: DEFAULT_MODAL,
  setStep: (step) => set({ step }),
  setRole: (role) => set({ role }),
  setLoading: (isLoading) => set({ isLoading }),
  showModal: (type, mainTitle, description) =>
    set({ modal: { open: true, type, mainTitle, description } }),
  hideModal: () =>
    set((state) => ({ modal: { ...state.modal, open: false } })),
}));
