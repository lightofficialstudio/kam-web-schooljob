"use client";

import { Modal, ModalProps, Space, Typography } from "antd";
import { ReactNode } from "react";

const { Title, Text } = Typography;

export interface BaseModalProps extends ModalProps {
  icon?: ReactNode;
  mainTitle?: string;
  subTitle?: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
}

/**
 * 🎯 Base Modal Component - สำหรับแสดง notification แบบต่างๆ
 * ใช้ Ant Design Modal เป็นพื้นฐาน สามารถปรับแต่งได้เยอะ
 */
export default function BaseModal({
  icon,
  mainTitle,
  subTitle,
  description,
  type = "info",
  children,
  ...props
}: BaseModalProps) {
  return (
    <Modal
      centered
      closable={true}
      footer={null}
      width={420}
      styles={{
        body: {
          padding: "40px 32px",
          textAlign: "center",
        },
      }}
      {...props}
    >
      <Space orientation="vertical" size={16} style={{ width: "100%" }}>
        {/* Icon */}
        {icon && <div style={{ fontSize: "48px", lineHeight: 1 }}>{icon}</div>}

        {/* Main Title */}
        {mainTitle && (
          <Title
            level={2}
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            {mainTitle}
          </Title>
        )}

        {/* Sub Title */}
        {subTitle && (
          <Text
            style={{
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            {subTitle}
          </Text>
        )}

        {/* Description */}
        {description && (
          <Text
            style={{
              color: "#475569",
              fontSize: "14px",
              lineHeight: 1.6,
              display: "block",
              marginTop: "8px",
            }}
          >
            {description}
          </Text>
        )}

        {/* Custom Children */}
        {children}
      </Space>
    </Modal>
  );
}
