// ─── API layer สำหรับ Organization / RBAC ────────────────────────────────────

const BASE = "/api/v1/employer/organization";

interface ApiResponse<T> {
  status_code: number;
  message_th: string;
  message_en: string;
  data: T;
}

async function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json: ApiResponse<T> = await res.json();
  if (!res.ok) throw new Error(json.message_en ?? "API_ERROR");
  return json.data;
}

// ─── Members ─────────────────────────────────────────────────────────────────

export const fetchOrgMembers = (userId: string) =>
  request(`${BASE}/members?user_id=${userId}`);

export const fetchInviteMember = (
  userId: string,
  body: { email: string; role_id: string },
) =>
  request(`${BASE}/members?user_id=${userId}`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const fetchUpdateMemberRole = (
  userId: string,
  body: { member_id: string; role_id: string },
) =>
  request(`${BASE}/members?user_id=${userId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const fetchRemoveMember = (userId: string, memberId: string) =>
  request(
    `${BASE}/members?user_id=${userId}&member_id=${memberId}`,
    { method: "DELETE" },
  );

// ─── Invites ─────────────────────────────────────────────────────────────────

export const fetchPendingInvites = (userId: string) =>
  request(`${BASE}/invites?user_id=${userId}`);

export const fetchRevokeInvite = (userId: string, inviteId: string) =>
  request(
    `${BASE}/invites?user_id=${userId}&invite_id=${inviteId}`,
    { method: "DELETE" },
  );

export const fetchAcceptInvite = (userId: string, token: string) =>
  request(`${BASE}/invites/accept?user_id=${userId}`, {
    method: "POST",
    body: JSON.stringify({ token }),
  });

// ─── Roles ────────────────────────────────────────────────────────────────────

export const fetchOrgRoles = (userId: string) =>
  request(`${BASE}/roles?user_id=${userId}`);

export const fetchCreateRole = (
  userId: string,
  body: { name: string; description?: string; color?: string; icon_key?: string },
) =>
  request(`${BASE}/roles?user_id=${userId}`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const fetchUpdateRole = (
  userId: string,
  roleId: string,
  body: { name?: string; description?: string; color?: string; icon_key?: string },
) =>
  request(`${BASE}/roles?user_id=${userId}&role_id=${roleId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const fetchDeleteRole = (userId: string, roleId: string) =>
  request(`${BASE}/roles?user_id=${userId}&role_id=${roleId}`, {
    method: "DELETE",
  });

export const fetchUpdateRolePermissions = (
  userId: string,
  roleId: string,
  permissions: string[],
) =>
  request(
    `${BASE}/roles/permissions?user_id=${userId}&role_id=${roleId}`,
    {
      method: "PUT",
      body: JSON.stringify({ permissions }),
    },
  );

// ─── Delegated Access ────────────────────────────────────────────────────────

export const fetchDelegatedAccess = (userId: string) =>
  request(`${BASE}/delegated?user_id=${userId}`);
