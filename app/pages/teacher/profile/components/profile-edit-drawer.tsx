"use client";

import { Button, Drawer, Space, theme as antTheme } from "antd";
import React, { ReactNode } from "react";

interface ProfileEditDrawerProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  loading?: boolean;
  children: ReactNode;
  width?: number | string;
}

export const ProfileEditDrawer: React.FC<ProfileEditDrawerProps> = ({
  title,
  isOpen,
  onClose,
  onSave,
  loading = false,
  children,
  width = 520,
}) => {
  const { token } = antTheme.useToken();

  return (
    <Drawer
      title={
        <span
          style={{ fontSize: "18px", fontWeight: 700, color: token.colorText }}
        >
          {title}
        </span>
      }
      placement="right"
      onClose={onClose}
      open={isOpen}
      width={width}
      styles={{
        header: { borderBottom: `1px solid ${token.colorBorderSecondary}` },
        body: { padding: "24px" },
        footer: {
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          padding: "16px 24px",
        },
      }}
      footer={
        <Space size={12} style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button
            onClick={onClose}
            size="large"
            style={{
              minWidth: "120px",
              height: "48px",
              fontSize: "16px",
              borderRadius: token.borderRadiusLG,
            }}
          >
            ยกเลิก
          </Button>
          <Button
            type="primary"
            onClick={onSave}
            loading={loading}
            size="large"
            style={{
              minWidth: "160px",
              height: "48px",
              fontSize: "16px",
              borderRadius: token.borderRadiusLG,
            }}
          >
            บันทึกข้อมูล
          </Button>
        </Space>
      }
    >
      {children}
    </Drawer>
  );
};
