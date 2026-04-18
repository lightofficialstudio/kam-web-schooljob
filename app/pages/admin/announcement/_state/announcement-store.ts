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

  // ✨ แก้ race condition — pass role โดยตรงเข้า fetchRecipientCount แทนการ get() state ใหม่
  setTargetRole: (v) => {
    set({ targetRole: v });
    // ✨ เรียกด้วย v (ค่าใหม่) ไม่ใช่ get().targetRole (อาจยังเป็นค่าเก่า)
    get().fetchRecipientCount(v);
  },

  // ✨ reset form หลังส่ง
  resetForm: () => set({ title: "", message: "", targetRole: "ALL", lastSentCount: null, recipientCount: null }),

  // ✨ นับจำนวนผู้รับตาม role ที่รับมาโดยตรง
  fetchRecipientCount: async (role) => {
    set({ isCountingRecipients: true, recipientCount: null });
    try {
      const res = await requestRecipientCount(role);
      // ✨ ตรวจ status_code ก่อนอ่านค่า — ป้องกัน API error แต่ HTTP 200
      if (res.data.status_code === 200 && res.data.data) {
        set({ recipientCount: res.data.data.count });
      } else {
        set({ recipientCount: null });
      }
    } catch {
      set({ recipientCount: null });
    } finally {
      set({ isCountingRecipients: false });
    }
  },

  // ✨ ส่ง Broadcast — ตรวจ status_code + adminUserId ก่อนเสมอ
  broadcast: async (adminUserId) => {
    // ✨ #6 guard: ป้องกันส่ง request โดยไม่มี auth
    if (!adminUserId) {
      return { ok: false, sentCount: 0, error: "ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่" };
    }

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

      // ✨ ตรวจ status_code ก่อนอ่าน sentCount
      if (res.data.status_code !== 200 || !res.data.data) {
        return { ok: false, sentCount: 0, error: res.data.message_th ?? "ส่งไม่สำเร็จ" };
      }

      const sentCount = res.data.data.sentCount ?? 0;
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

  // ✨ โหลดประวัติ — guard adminUserId ว่างก่อน fetch
  fetchHistory: async (adminUserId, page = 1) => {
    if (!adminUserId) return;
    set({ isLoadingHistory: true });
    try {
      const res = await requestAnnouncementHistory(adminUserId, page);
      if (res.data.status_code === 200 && res.data.data) {
        set({
          history: res.data.data.items,
          historyTotal: res.data.data.total,
          historyPage: page,
        });
      }
    } catch {
      // ✨ history โหลดไม่ได้ — ไม่แสดง error ร้ายแรง
    } finally {
      set({ isLoadingHistory: false });
    }
  },
}));
