"use client";

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, Space } from "antd";
import BaseModal, { BaseModalProps } from "./base-modal";

export interface ResultModalProps extends BaseModalProps {
  type: "success" | "error" | "warning" | "info";
  onConfirm?: () => void;
  confirmText?: string;
}

/**
 * 🎯 Result Modal - สำหรับแสดงผลสำเร็จ/ล้มเหลว
 */
export default function ResultModal({
  type,
  mainTitle,
  subTitle,
  description,
  onConfirm,
  confirmText = "ตกลง",
  open,
  onCancel,
  ...props
}: ResultModalProps) {
  // ✨ เลือก icon ตามประเภท
  const iconMap = {
    success: (
      <CheckCircleOutlined
        style={{
          color: "#10B981",
          fontSize: "72px",
        }}
      />
    ),
    error: (
      <CloseCircleOutlined
        style={{
          color: "#EF4444",
          fontSize: "72px",
        }}
      />
    ),
    warning: (
      <WarningOutlined
        style={{
          color: "#F59E0B",
          fontSize: "72px",
        }}
      />
    ),
    info: (
      <InfoCircleOutlined
        style={{
          color: "#0066FF",
          fontSize: "72px",
        }}
      />
    ),
  };

  const handleConfirm = () => {
    onConfirm?.();
    onCancel?.();
  };

  return (
    <BaseModal
      type={type}
      icon={iconMap[type]}
      mainTitle={mainTitle}
      subTitle={subTitle}
      description={description}
      open={open}
      onCancel={onCancel}
      {...props}
    >
      <div style={{ marginTop: "24px" }}>
        <Space>
          <Button
            type="primary"
            onClick={handleConfirm}
            style={{
              borderRadius: "8px",
              height: "52px",
              paddingInline: "32px",
              fontWeight: 600,
              fontSize: "16px",
            }}
          >
            {confirmText}
          </Button>
        </Space>
      </div>
    </BaseModal>
  );
}
