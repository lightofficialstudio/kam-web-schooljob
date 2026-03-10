import { ReactNode } from "react";
import { create } from "zustand";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationContent {
  type: NotificationType;
  mainTitle: string;
  subTitle?: string;
  description?: string;
  icon?: ReactNode;
  open: boolean;
}

interface NotificationModalStore {
  notification: NotificationContent;
  openNotification: (content: Omit<NotificationContent, "open">) => void;
  closeNotification: () => void;
}

/**
 * 📢 Global Notification Modal Store using Zustand
 * ใช้สำหรับแจ้งเตือน success, error, warning, info
 */
export const useNotificationModalStore = create<NotificationModalStore>(
  (set) => ({
    notification: {
      type: "info",
      mainTitle: "",
      open: false,
    },

    openNotification: (content) =>
      set({
        notification: {
          ...content,
          open: true,
        },
      }),

    closeNotification: () =>
      set((state) => ({
        notification: {
          ...state.notification,
          open: false,
        },
      })),
  }),
);
