import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  user_id: string;
  email: string;
  full_name: string;       // ชื่อ-นามสกุลผู้ดูแล (firstName + lastName)
  school_name?: string;    // ชื่อโรงเรียน — เฉพาะ EMPLOYER
  role: string;
  is_first_login?: boolean;
  profile_image_url?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  updateUser: (patch: Partial<User>) => void; // ✨ อัปเดตบางฟิลด์โดยไม่ต้อง re-login
  setFirstLogin: (isFirst: boolean) => void;
  logout: () => void;
}

/**
 * 🔐 Auth Store - จัดการ state ของ user authentication
 * ✨ ใช้ localStorage persistence เพื่อให้ user state ยัง maintain หลัง refresh/navigate
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      // ✨ [กำหนด user เมื่อ login สำเร็จ]
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
        console.log(
          "✅ User set in auth store:",
          user.email,
          "role:",
          user.role,
        );
      },

      // ✨ [อัปเดตบางฟิลด์ใน user โดยไม่ต้อง re-login]
      updateUser: (patch: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...patch } : null,
        }));
      },

      // ✨ [กำหนดสถานะการเข้าสู่ระบบครั้งแรก]
      setFirstLogin: (isFirst: boolean) => {
        set((state) => ({
          user: state.user ? { ...state.user, is_first_login: isFirst } : null,
        }));
      },

      // ✨ [เคลียร์ user info เมื่อ logout]
      logout: () => {
        set({ user: null, isAuthenticated: false });
        console.log("🚪 User logged out from auth store");
      },
    }),
    {
      name: "auth-store", // key ใน localStorage
    },
  ),
);
