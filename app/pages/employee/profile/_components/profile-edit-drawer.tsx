"use client";

import { useTheme } from "@/app/contexts/theme-context";
import { Button, Drawer, theme as antTheme } from "antd";
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
  const { mode } = useTheme();

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
      size={width}
      styles={{
        header: {
          borderBottom: "none", // ✨ Minimal: ลบเส้นคั่นออก
          padding: "32px 32px 8px 32px",
          background: "transparent",
        },
        body: {
          padding: "0 32px",
          background: "transparent",
        },
        footer: {
          borderTop: "none", // ✨ Minimal: ลบเส้นคั่นออก
          padding: "24px 32px 40px 32px",
          background: "transparent",
        },
        mask: {
          backdropFilter: "blur(8px)", // ✨ เพิ่ม Blur ให้ความรู้สึกหรูหรา
          backgroundColor:
            mode === "dark" ? "rgba(0, 0, 0, 0.65)" : "rgba(0, 0, 0, 0.25)",
        },
      }}
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button
            onClick={onClose}
            size="large"
            className="px-8 h-12 border-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium"
            style={{
              borderRadius: "14px",
              color: token.colorTextSecondary,
            }}
          >
            ยกเลิก
          </Button>
          <Button
            type="primary"
            onClick={onSave}
            loading={loading}
            size="large"
            className="px-10 h-12 font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
            style={{
              borderRadius: "14px",
              background: `linear-gradient(135deg, ${token.colorPrimary} 0%, #0d8fd4 100%)`,
              border: "none",
            }}
          >
            บันทึกข้อมูล
          </Button>
        </div>
      }
    >
      <div className="py-6">{children}</div>
    </Drawer>
  );
};
