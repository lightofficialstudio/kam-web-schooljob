import { create } from "zustand";
import {
  ConfigOption,
  createConfigOption,
  deleteConfigOption,
  fetchAllConfigOptions,
  updateConfigOption,
} from "../_api/config-api";

interface ConfigStore {
  options: ConfigOption[];
  isLoading: boolean;
  isSaving: boolean;
  fetchOptions: () => Promise<void>;
  addOption: (payload: {
    group: string;
    label: string;
    value: string;
    parent_value?: string | null;
    sort_order?: number;
  }) => Promise<void>;
  toggleActive: (id: string, isActive: boolean) => Promise<void>;
  removeOption: (id: string) => Promise<void>;
  updateLabel: (id: string, label: string, sortOrder: number) => Promise<void>;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  options: [],
  isLoading: false,
  isSaving: false,

  // ✨ ดึงข้อมูลทั้งหมดจาก API
  fetchOptions: async () => {
    set({ isLoading: true });
    try {
      const options = await fetchAllConfigOptions();
      set({ options });
    } catch (err) {
      console.error("❌ fetchOptions:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  // ✨ เพิ่มตัวเลือกใหม่
  addOption: async (payload) => {
    set({ isSaving: true });
    try {
      const created = await createConfigOption(payload);
      if (created) {
        set((state) => ({ options: [...state.options, created] }));
      }
    } finally {
      set({ isSaving: false });
    }
  },

  // ✨ เปิด/ปิดตัวเลือก
  toggleActive: async (id, isActive) => {
    set({ isSaving: true });
    try {
      await updateConfigOption({ id, is_active: isActive });
      set((state) => ({
        options: state.options.map((o) =>
          o.id === id ? { ...o, isActive } : o,
        ),
      }));
    } finally {
      set({ isSaving: false });
    }
  },

  // ✨ แก้ไขชื่อและลำดับ
  updateLabel: async (id, label, sortOrder) => {
    set({ isSaving: true });
    try {
      await updateConfigOption({ id, label, sort_order: sortOrder });
      set((state) => ({
        options: state.options.map((o) =>
          o.id === id ? { ...o, label, sortOrder } : o,
        ),
      }));
    } finally {
      set({ isSaving: false });
    }
  },

  // ✨ ลบตัวเลือก
  removeOption: async (id) => {
    set({ isSaving: true });
    try {
      await deleteConfigOption(id);
      set((state) => ({ options: state.options.filter((o) => o.id !== id) }));
    } finally {
      set({ isSaving: false });
    }
  },
}));
