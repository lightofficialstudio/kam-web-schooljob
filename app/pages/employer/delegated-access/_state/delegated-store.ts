import { create } from "zustand";
import { fetchDelegatedAccess } from "../../school-management/_api/org-api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DelegatedSchoolProfile {
  id: string;
  schoolName: string;
  schoolType: string | null;
  province: string;
  logoUrl: string | null;
  profile: { firstName: string | null; lastName: string | null; email: string };
}

export interface DelegatedRole {
  id: string;
  name: string;
  slug: string;
  color: string;
  iconKey: string;
  permissions: { id: string; roleId: string; permissionKey: string }[];
}

export interface DelegatedAccess {
  id: string;
  orgId: string;
  profileId: string;
  roleId: string;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  invitedBy: string | null;
  joinedAt: string | null;
  createdAt: string;
  schoolProfile: DelegatedSchoolProfile;
  role: DelegatedRole;
  inviter: { firstName: string | null; lastName: string | null } | null;
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface DelegatedState {
  accesses: DelegatedAccess[];
  isLoading: boolean;
  fetchAccesses: (userId: string) => Promise<void>;
}

export const useDelegatedStore = create<DelegatedState>((set) => ({
  accesses: [],
  isLoading: false,

  fetchAccesses: async (userId) => {
    set({ isLoading: true });
    try {
      const data = await fetchDelegatedAccess(userId);
      set({ accesses: data as DelegatedAccess[] });
    } catch (err) {
      console.error("❌ [delegated-store] fetchAccesses:", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
