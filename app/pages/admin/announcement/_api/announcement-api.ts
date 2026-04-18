import axios from "axios";

// ✨ ประเภทของ Announcement ที่ส่งได้
export type TargetRole = "ALL" | "EMPLOYEE" | "EMPLOYER";

export interface BroadcastPayload {
  admin_user_id: string;
  title: string;
  message: string;
  target_role: TargetRole;
  type?: string;
  reference_id?: string;
  reference_type?: string;
}

export interface AnnouncementHistoryItem {
  title: string;
  message: string;
  type: string;
  sentCount: number;
  createdAt: string;
}

export interface AnnouncementHistoryData {
  items: AnnouncementHistoryItem[];
  total: number;
  page: number;
  pageSize: number;
}

// ✨ ส่ง Broadcast Notification
export const requestBroadcast = (payload: BroadcastPayload) =>
  axios.post<{ status_code: number; message_th: string; data: { sentCount: number } }>(
    "/api/v1/admin/announcements/broadcast",
    payload
  );

// ✨ ดึงประวัติ Announcement
export const requestAnnouncementHistory = (adminUserId: string, page = 1) =>
  axios.get<{ status_code: number; data: AnnouncementHistoryData }>(
    "/api/v1/admin/announcements/history",
    { params: { admin_user_id: adminUserId, page } }
  );

// ✨ นับจำนวนผู้รับตาม target role (ก่อนส่ง)
export const requestRecipientCount = (targetRole: TargetRole) =>
  axios.get<{ status_code: number; data: { count: number } }>(
    "/api/v1/admin/announcements/count",
    { params: { target_role: targetRole } }
  );
