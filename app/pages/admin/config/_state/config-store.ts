import type { ModalType } from "@/app/components/modal/modal.component";
import { create } from "zustand";
import {
  ConfigOption,
  createConfigOption,
  deleteConfigOption,
  fetchAllConfigOptions,
  updateConfigOption,
} from "../_api/config-api";

// ✨ Metadata ของแต่ละ Group — label ภาษาไทย + หน้าที่มีผลกระทบ
export const GROUP_META: Record<string, { label: string; usedIn: string[] }> = {
  school_type: {
    label: "ประเภทโรงเรียน",
    usedIn: ["/pages/employer/profile", "/pages/job (filter)"],
  },
  school_level: {
    label: "ระดับชั้นที่เปิดสอน",
    usedIn: ["/pages/employer/profile"],
  },
  job_category: {
    label: "หมวดหมู่งาน (ตำแหน่งงาน)",
    usedIn: ["/pages/landing", "/pages/job (filter)"],
  },
};

// ✨ Modal state สำหรับรายงานสถานะ Success / Error / Warning
interface ModalState {
  open: boolean;
  type: ModalType;
  title: string;
  description?: string;
  errorDetails?: unknown;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface ConfigStore {
  options: ConfigOption[];
  isLoading: boolean;
  isSaving: boolean;
  // ✨ UI state — active tab + modal visibility
  activeGroup: string;
  isAddModalOpen: boolean;
  defaultParentValue: string | null;
  isEditModalOpen: boolean;
  editingOption: ConfigOption | null;
  // ✨ actions
  setActiveGroup: (g: string) => void;
  openAddModal: (parentValue?: string) => void;
  closeAddModal: () => void;
  openEditModal: (option: ConfigOption) => void;
  closeEditModal: () => void;
  modal: ModalState;
  showModal: (opts: Omit<ModalState, "open">) => void;
  hideModal: () => void;
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

const DEFAULT_MODAL: ModalState = { open: false, type: "success", title: "" };

export const useConfigStore = create<ConfigStore>((set, get) => ({
  options: [],
  isLoading: false,
  isSaving: false,
  activeGroup: "school_type",
  isAddModalOpen: false,
  defaultParentValue: null,
  isEditModalOpen: false,
  editingOption: null,

  // ✨ เปลี่ยน active group tab
  setActiveGroup: (g) => set({ activeGroup: g }),

  // ✨ เปิด modal เพิ่มตัวเลือก (pre-fill parent ถ้ามี)
  openAddModal: (parentValue) =>
    set({ isAddModalOpen: true, defaultParentValue: parentValue ?? null }),
  closeAddModal: () => set({ isAddModalOpen: false, defaultParentValue: null }),

  // ✨ เปิด modal แก้ไขตัวเลือก
  openEditModal: (option) =>
    set({ isEditModalOpen: true, editingOption: option }),
  closeEditModal: () => set({ isEditModalOpen: false, editingOption: null }),
  modal: DEFAULT_MODAL,

  // ✨ เปิด modal พร้อมตั้งค่า
  showModal: (opts) => set({ modal: { ...opts, open: true } }),

  // ✨ ปิด modal และ reset state
  hideModal: () => set({ modal: DEFAULT_MODAL }),

  // ✨ ดึงข้อมูลทั้งหมดจาก API
  fetchOptions: async () => {
    set({ isLoading: true });
    try {
      const options = await fetchAllConfigOptions();
      set({ options });
    } catch (err: unknown) {
      get().showModal({
        type: "error",
        title: "โหลดข้อมูลไม่สำเร็จ",
        description: "ไม่สามารถดึงรายการตัวเลือกได้ กรุณาลองใหม่หรือแจ้ง Admin",
        errorDetails: err,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // ✨ เพิ่มตัวเลือกใหม่ — throw เพื่อให้ page ปิด modal ได้
  addOption: async (payload) => {
    set({ isSaving: true });
    try {
      const created = await createConfigOption(payload);
      if (created) {
        set((state) => ({ options: [...state.options, created] }));
        get().showModal({
          type: "success",
          title: "เพิ่มตัวเลือกสำเร็จ",
          description: `เพิ่ม "${payload.label}" เรียบร้อยแล้ว`,
        });
      }
    } catch (err: unknown) {
      get().showModal({
        type: "error",
        title: "เพิ่มตัวเลือกไม่สำเร็จ",
        description: "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
        errorDetails: err,
      });
      throw err; // ✨ re-throw เพื่อให้ page ทราบว่าไม่ควรปิด form modal
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
      get().showModal({
        type: "success",
        title: isActive ? "เปิดใช้งานแล้ว" : "ปิดใช้งานแล้ว",
        description: isActive
          ? "ตัวเลือกนี้จะแสดงในฟอร์มระบบแล้ว"
          : "ตัวเลือกนี้จะไม่แสดงในฟอร์มระบบชั่วคราว",
      });
    } catch (err: unknown) {
      get().showModal({
        type: "error",
        title: "เปลี่ยนสถานะไม่สำเร็จ",
        description: "กรุณาลองใหม่อีกครั้ง",
        errorDetails: err,
      });
    } finally {
      set({ isSaving: false });
    }
  },

  // ✨ แก้ไขชื่อและลำดับ — throw เพื่อให้ page ปิด modal ได้
  updateLabel: async (id, label, sortOrder) => {
    set({ isSaving: true });
    try {
      await updateConfigOption({ id, label, sort_order: sortOrder });
      set((state) => ({
        options: state.options.map((o) =>
          o.id === id ? { ...o, label, sortOrder } : o,
        ),
      }));
      get().showModal({
        type: "success",
        title: "แก้ไขสำเร็จ",
        description: `อัปเดตชื่อเป็น "${label}" เรียบร้อยแล้ว`,
      });
    } catch (err: unknown) {
      get().showModal({
        type: "error",
        title: "แก้ไขไม่สำเร็จ",
        description: "กรุณาลองใหม่อีกครั้ง",
        errorDetails: err,
      });
      throw err;
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
      get().showModal({
        type: "success",
        title: "ลบสำเร็จ",
        description:
          "ลบตัวเลือกเรียบร้อยแล้ว ข้อมูลเดิมที่บันทึกไว้ไม่ได้รับผลกระทบ",
      });
    } catch (err: unknown) {
      get().showModal({
        type: "error",
        title: "ลบไม่สำเร็จ",
        description: "กรุณาลองใหม่อีกครั้ง",
        errorDetails: err,
      });
    } finally {
      set({ isSaving: false });
    }
  },
}));
