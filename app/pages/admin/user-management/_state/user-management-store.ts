import { create } from "zustand";
import { responseUserList, type UserRecord } from "../_api/user-management-api";

// ✨ [Type Definition สำหรับ Store]
interface UserManagementStore {
  // ── State ──
  users: UserRecord[];
  isLoading: boolean;
  searchText: string;
  selectedRowKeys: React.Key[];

  // ── Derived (computed) ──
  filteredUsers: () => UserRecord[];
  countByRole: (role: UserRecord["role"]) => number;

  // ── Actions ──
  fetchUsers: () => Promise<{
    success: boolean;
    total?: number;
    message?: string;
  }>;
  setSearchText: (text: string) => void;
  setSelectedRowKeys: (keys: React.Key[]) => void;
}

export const useUserManagementStore = create<UserManagementStore>(
  (set, get) => ({
    // ── Initial State ──
    users: [],
    isLoading: false,
    searchText: "",
    selectedRowKeys: [],

    // ── Derived: กรอง users ตาม searchText จาก raw data โดยตรง ──
    filteredUsers: () => {
      const { users, searchText } = get();
      if (!searchText) return users;
      const lower = searchText.toLowerCase();
      return users.filter((u) =>
        [u.email, u.fullName ?? "", u.role]
          .join(" ")
          .toLowerCase()
          .includes(lower),
      );
    },

    // ── Derived: นับ users ตาม role จาก raw data ──
    countByRole: (role) => get().users.filter((u) => u.role === role).length,

    // ── Action: ดึงข้อมูล users ทั้งหมด ──
    fetchUsers: async () => {
      set({ isLoading: true });
      try {
        console.log("📊 [USER MANAGEMENT] Fetching users...");
        const result = await responseUserList();
        console.log(`✅ [USER MANAGEMENT] Found ${result.total} users`);
        set({ users: result.users });
        return { success: true, total: result.total };
      } catch (error: unknown) {
        console.error("❌ [USER MANAGEMENT] Error:", error);
        return { success: false, message: "ล้มเหลวในการดึงข้อมูลผู้ใช้" };
      } finally {
        set({ isLoading: false });
      }
    },

    // ── Action: อัปเดต search text ──
    setSearchText: (text) => set({ searchText: text }),

    // ── Action: อัปเดต selected row keys ──
    setSelectedRowKeys: (keys) => set({ selectedRowKeys: keys }),
  }),
);
