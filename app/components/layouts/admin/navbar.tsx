"use client";

import { useTheme } from "@/app/contexts/theme-context";
import { useAuthStore } from "@/app/stores/auth-store";
import { LogoutOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminNavbarProps {
  onMenuClick?: () => void;
  title?: string;
}

export function AdminNavbar({ onMenuClick, title }: AdminNavbarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"light" | "dark">("dark");

  // ✨ [Try to use theme context, fall back to localStorage]
  try {
    const themeContext = useTheme();
    useEffect(() => {
      if (themeContext) {
        setMode(themeContext.mode);
        setMounted(true);
      }
    }, [themeContext]);
  } catch {
    // Fall back to localStorage if context not available
    useEffect(() => {
      const savedTheme =
        (localStorage.getItem("app-theme") as "light" | "dark") || "dark";
      setMode(savedTheme);
      setMounted(true);
    }, []);
  }

  // ✨ [Dropdown menu สำหรับ User]
  const userMenu: MenuProps["items"] = [
    {
      key: "profile",
      label: "โปรไฟล์",
      onClick: () => router.push("/pages/admin/profile"),
    },
    {
      key: "settings",
      label: "การตั้งค่า",
      onClick: () => router.push("/pages/admin/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "ออกจากระบบ",
      onClick: () => {
        logout();
        router.push("/pages/signin");
      },
    },
  ];

  return (
    <Layout.Header
      style={{
        background:
          mode === "dark"
            ? "linear-gradient(90deg, #001529 0%, #003d82 100%)"
            : "linear-gradient(90deg, #fafafa 0%, #f0f0f0 100%)",
        padding: "0 24px",
        boxShadow:
          mode === "dark"
            ? "0 2px 8px rgba(0, 0, 0, 0.15)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily:
          "'Kanit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* ✨ [Left: Menu Toggle + Title] */}
      <Space size="large">
        <Tooltip title="สลับแถบด้านข้าง">
          <Button
            type="text"
            icon={
              <MenuOutlined
                style={{
                  fontSize: "18px",
                  color: mode === "dark" ? "white" : "rgba(0, 0, 0, 0.88)",
                }}
              />
            }
            onClick={onMenuClick}
            style={{
              background:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
            }}
          />
        </Tooltip>

        <div>
          <Typography.Title
            level={3}
            style={{
              color: mode === "dark" ? "white" : "rgba(0, 0, 0, 0.88)",
              margin: 0,
              fontWeight: 700,
            }}
          >
            {title || "แดชบอร์ดแอดมิน"}
          </Typography.Title>
          <Typography.Text
            type="secondary"
            style={{
              color:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.65)"
                  : "rgba(0, 0, 0, 0.45)",
              fontSize: "12px",
            }}
          >
            KAM - School Job Platform
          </Typography.Text>
        </div>
      </Space>

      {/* ✨ [Right: User Menu] */}
      <Space>
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              paddingRight: "16px",
              borderRight:
                mode === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.2)"
                  : "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ textAlign: "right" }}>
              <Typography.Text
                style={{
                  color: mode === "dark" ? "white" : "rgba(0, 0, 0, 0.88)",
                  fontSize: "14px",
                  fontWeight: 600,
                  display: "block",
                }}
              >
                {user.full_name || "ผู้ใช้"}
              </Typography.Text>
              <Typography.Text
                style={{
                  color:
                    mode === "dark"
                      ? "rgba(255, 255, 255, 0.65)"
                      : "rgba(0, 0, 0, 0.45)",
                  fontSize: "12px",
                  display: "block",
                }}
              >
                {user.role === "ADMIN"
                  ? "ผู้ดูแลระบบ"
                  : user.role === "SCHOOL"
                    ? "โรงเรียน"
                    : "ครู"}
              </Typography.Text>
            </div>
            <Avatar
              size={40}
              icon={<UserOutlined />}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              {(user.full_name || "A").charAt(0).toUpperCase()}
            </Avatar>
          </div>
        )}

        <Dropdown menu={{ items: userMenu }} trigger={["click"]}>
          <Tooltip title="เมนูผู้ใช้">
            <Button
              type="text"
              icon={
                <LogoutOutlined
                  style={{
                    fontSize: "18px",
                    color: mode === "dark" ? "white" : "rgba(0, 0, 0, 0.88)",
                  }}
                />
              }
              style={{
                background:
                  mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.05)",
              }}
            />
          </Tooltip>
        </Dropdown>
      </Space>
    </Layout.Header>
  );
}
