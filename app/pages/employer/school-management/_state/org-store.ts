import { create } from "zustand";
import {
  fetchCreateRole,
  fetchDeleteRole,
  fetchOrgMembers,
  fetchOrgRoles,
  fetchPendingInvites,
  fetchRemoveMember,
  fetchRevokeInvite,
  fetchSendInvite,
  fetchUpdateMemberRole,
  fetchUpdateRole,
  fetchUpdateRolePermissions,
} from "../_api/org-api";

// ─── Types (DB-aligned) ───────────────────────────────────────────────────────

export interface OrgPermission {
  id: string;
  roleId: string;
  permissionKey: string;
}

export interface OrgRole {
  id: string;
  orgId: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  iconKey: string;
  isSystem: boolean;
  permissions: OrgPermission[];
  _count: { members: number };
  createdAt: string;
}

export interface OrgMemberProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  profileImageUrl: string | null;
}

export interface OrgMember {
  id: string;
  orgId: string;
  profileId: string;
  roleId: string;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  invitedBy: string | null;
  joinedAt: string | null;
  createdAt: string;
  profile: OrgMemberProfile;
  role: OrgRole;
}

export interface OrgInvite {
  id: string;
  orgId: string;
  email: string;
  roleId: string;
  token: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
  inviter: { firstName: string | null; lastName: string | null };
}

// ─── Store State ──────────────────────────────────────────────────────────────

interface OrgState {
  members: OrgMember[];
  invites: OrgInvite[];
  roles: OrgRole[];
  isLoadingMembers: boolean;
  isLoadingInvites: boolean;
  isLoadingRoles: boolean;

  // Members
  fetchMembers: (userId: string) => Promise<void>;
  inviteMember: (userId: string, email: string, roleId: string) => Promise<void>;
  updateMemberRole: (userId: string, memberId: string, roleId: string) => Promise<void>;
  removeMember: (userId: string, memberId: string) => Promise<void>;

  // Invites
  fetchInvites: (userId: string) => Promise<void>;
  revokeInvite: (userId: string, inviteId: string) => Promise<void>;

  // Roles
  fetchRoles: (userId: string) => Promise<void>;
  createRole: (userId: string, data: { name: string; description?: string; color?: string; icon_key?: string }) => Promise<OrgRole>;
  updateRole: (userId: string, roleId: string, data: { name?: string; description?: string; color?: string; icon_key?: string }) => Promise<void>;
  deleteRole: (userId: string, roleId: string) => Promise<void>;
  savePermissions: (userId: string, roleId: string, permissions: string[]) => Promise<void>;
}

export const useOrgStore = create<OrgState>((set, get) => ({
  members: [],
  invites: [],
  roles: [],
  isLoadingMembers: false,
  isLoadingInvites: false,
  isLoadingRoles: false,

  // ─── Members ────────────────────────────────────────────────────────────────

  fetchMembers: async (userId) => {
    set({ isLoadingMembers: true });
    try {
      const data = await fetchOrgMembers(userId);
      set({ members: Array.isArray(data) ? (data as OrgMember[]) : [] });
    } catch (err) {
      console.error("❌ [org-store] fetchMembers:", err);
      set({ members: [] });
    } finally {
      set({ isLoadingMembers: false });
    }
  },

  inviteMember: async (userId, email, roleId) => {
    // ✨ เรียก POST /invites ซึ่งจะสร้าง invite + ส่ง email จริง
    await fetchSendInvite(userId, { email, role_id: roleId });
    await get().fetchInvites(userId);
  },

  updateMemberRole: async (userId, memberId, roleId) => {
    await fetchUpdateMemberRole(userId, { member_id: memberId, role_id: roleId });
    // optimistic: update local state
    set((state) => ({
      members: state.members.map((m) => {
        if (m.id !== memberId) return m;
        const newRole = state.roles.find((r) => r.id === roleId);
        return newRole ? { ...m, roleId, role: newRole } : m;
      }),
    }));
  },

  removeMember: async (userId, memberId) => {
    await fetchRemoveMember(userId, memberId);
    set((state) => ({ members: state.members.filter((m) => m.id !== memberId) }));
  },

  // ─── Invites ────────────────────────────────────────────────────────────────

  fetchInvites: async (userId) => {
    set({ isLoadingInvites: true });
    try {
      const data = await fetchPendingInvites(userId);
      set({ invites: Array.isArray(data) ? (data as OrgInvite[]) : [] });
    } catch (err) {
      console.error("❌ [org-store] fetchInvites:", err);
      set({ invites: [] });
    } finally {
      set({ isLoadingInvites: false });
    }
  },

  revokeInvite: async (userId, inviteId) => {
    await fetchRevokeInvite(userId, inviteId);
    set((state) => ({ invites: state.invites.filter((i) => i.id !== inviteId) }));
  },

  // ─── Roles ──────────────────────────────────────────────────────────────────

  fetchRoles: async (userId) => {
    set({ isLoadingRoles: true });
    try {
      const data = await fetchOrgRoles(userId);
      set({ roles: Array.isArray(data) ? (data as OrgRole[]) : [] });
    } catch (err) {
      console.error("❌ [org-store] fetchRoles:", err);
      set({ roles: [] });
    } finally {
      set({ isLoadingRoles: false });
    }
  },

  createRole: async (userId, data) => {
    const newRole = await fetchCreateRole(userId, data) as OrgRole;
    set((state) => ({ roles: [...state.roles, newRole] }));
    return newRole;
  },

  updateRole: async (userId, roleId, data) => {
    const updated = await fetchUpdateRole(userId, roleId, data) as OrgRole;
    set((state) => ({
      roles: state.roles.map((r) => (r.id === roleId ? updated : r)),
    }));
  },

  deleteRole: async (userId, roleId) => {
    await fetchDeleteRole(userId, roleId);
    set((state) => ({ roles: state.roles.filter((r) => r.id !== roleId) }));
  },

  savePermissions: async (userId, roleId, permissions) => {
    const updated = await fetchUpdateRolePermissions(userId, roleId, permissions) as OrgRole;
    set((state) => ({
      roles: state.roles.map((r) => (r.id === roleId ? updated : r)),
    }));
  },
}));
