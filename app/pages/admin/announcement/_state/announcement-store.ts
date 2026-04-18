"use client";

import { create } from "zustand";
import {
  AnnouncementHistoryItem,
  BroadcastPayload,
  requestAnnouncementHistory,
  requestBroadcast,
  requestRecipientCount,
  TargetRole,
} from "../_api/announcement-api";

interface AnnouncementStore {
  // ✨ Form state
  title: string;
  message: string;
  targetRole: TargetRole;
  isSending: boolean;
  lastSentCount: number | null;

  // ✨ Recipient count (นับก่อนส่ง)
  recipientCount: number | null;
  isCountingRecipients: boolean;

  // ✨ History state
  history: AnnouncementHistoryItem[];
  historyTotal: number;
  historyPage: number;
  isLoadingHistory: boolean;

  // ✨ Actions
  setTitle: (v: string) => void;
  setMessage: (v: string) => void;
  setTargetRole: (v: TargetRole) => void;
  resetForm: () => void;
  fetchRecipientCount: (role: TargetRole) => Promise<void>;
  broadcast: (adminUserId: string) => Promise<{ ok: boolean; sentCount: number; error?: string }>;
  fetchHistory: (adminUserId: string, page?: number) => Promise<void>;
}

export const useAnnouncementStore = create<AnnouncementStore>((set, get) => ({
  title: "",
  message: "",
  targetRole: "ALL",
  isSending: false,
  lastSentCount: null,
  recipientCount: null,
  isCountingRecipients: false,
  history: [],
  historyTotal: 0,
  historyPage: 1,
  isLoadingHistory: false,

  setTitle: (v) => set({ title: v }),
  setMessage: (v) => set({ message: v }),

  // ✨ เปลี่ยน role แล้วนับผู้รับใหม่ทันที
  setTargetRole: (v) => {
    set({ targetRole: v });
    get().fetchRecipientCount(v);
  },

  // ✨ reset form หลังส่ง
  resetForm: () => set({ title: "", message: "", targetRole: "ALL", lastSentCount: null, recipientCount: null }),

  // ✨ นับจำนวนผู้รับก่อนเปิด Confirm Modal
  fetchRecipientCount: async (role) => {
    set({ isCountingRecipients: true, recipientCount: null });
    try {
      const res = await requestRecipientCount(role);
      if (res.data.status_code === 200) {
        set({ recipientCount: res.data.data.count });
      }
    } catch {
      set({ recipientCount: null });
    } finally {
      set({ isCountingRecipients: false });
    }
  },

  // ✨ ส่ง Broadcast — return ok + sentCount สำหรับแสดง Modal
  broadcast: async (adminUserId) => {
    const { title, message, targetRole } = get();
    set({ isSending: true });
    try {
      const payload: BroadcastPayload = {
        admin_user_id: adminUserId,
        title,
        message,
        target_role: targetRole,
        type: "system",
      };
      const res = await requestBroadcast(payload);
      const sentCount = res.data.data?.sentCount ?? 0;
      set({ lastSentCount: sentCount });
      return { ok: true, sentCount };
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message_th?: string } } })?.response?.data?.message_th ??
        "เกิดข้อผิดพลาด กรุณาลองใหม่";
      return { ok: false, sentCount: 0, error: msg };
    } finally {
      set({ isSending: false });
    }
  },

  // ✨ โหลดประวัติ Announcement
  fetchHistory: async (adminUserId, page = 1) => {
    set({ isLoadingHistory: true });
    try {
      const res = await requestAnnouncementHistory(adminUserId, page);
      if (res.data.status_code === 200) {
        set({
          history: res.data.data.items,
          historyTotal: res.data.data.total,
          historyPage: page,
        });
      }
    } catch {
      // ✨ ไม่แสดง error ร้ายแรง — แค่ history โหลดไม่ได้
    } finally {
      set({ isLoadingHistory: false });
    }
  },
}));
