"use client";

import { useNotificationModalStore } from "@/app/stores/notification-modal-store";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import BaseModal from "./base-modal";

/**
 * 🎯 Notification Modal Provider - Display global notifications
 * Wraps the application to show notification modals
 */
export function NotificationModalProvider() {
  const { notification, closeNotification } = useNotificationModalStore();

  // 🎨 [Get icon based on notification type]
  const getIcon = () => {
    if (notification.icon) return notification.icon;

    switch (notification.type) {
      case "success":
        return (
          <CheckCircleOutlined style={{ color: "#22c55e", fontSize: "48px" }} />
        );
      case "error":
        return (
          <CloseCircleOutlined style={{ color: "#ef4444", fontSize: "48px" }} />
        );
      case "warning":
        return (
          <ExclamationCircleOutlined
            style={{ color: "#f59e0b", fontSize: "48px" }}
          />
        );
      case "info":
      default:
        return (
          <InfoCircleOutlined style={{ color: "#3b82f6", fontSize: "48px" }} />
        );
    }
  };

  return (
    <BaseModal
      icon={getIcon()}
      mainTitle={notification.mainTitle}
      subTitle={notification.subTitle}
      description={notification.description}
      open={notification.open}
      onCancel={closeNotification}
      onOk={closeNotification}
      okText="ปิด"
      cancelButtonProps={{ style: { display: "none" } }}
    />
  );
}
