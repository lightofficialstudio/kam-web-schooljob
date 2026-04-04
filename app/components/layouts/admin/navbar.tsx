"use client";

import { useAuthStore } from "@/app/stores/auth-store";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Dropdown, Flex, Space, theme, Tooltip, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Text } = Typography;

interface AdminNavbarProps {
  onMenuClick?: () => void;
  title?: string;
  mode: "light" | "dark";
  sidebarCollapsed?: boolean;
}

export function AdminNavbar({ onMenuClick, title, mode, sidebarCollapsed }: AdminNavbarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { token } = theme.useToken();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isDark = mode === "dark";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = document.querySelector(".ant-layout-content");
    const handleScroll = () => setScrolled((el?.scrollTop ?? 0) > 20);
    el?.addEventListener("scroll", handleScroll, { passive: true });
    return () => el?.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  // ✨ [Dropdown menu สำหรับ User]
  const userMenu: MenuProps["items"] = [
    {
      key: "profile",
      label: "โปรไฟล์",
      icon: <UserOutlined />,
      onClick: () => router.push("/pages/admin/profile"),
    },
    {
      key: "settings",
      label: "การตั้งค่า",
      icon: <SettingOutlined />,
      onClick: () => router.push("/pages/admin/settings"),
    },
    { type: "divider" },
    {
      key: "logout",
      label: "ออกจากระบบ",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        logout();
        router.push("/pages/signin");
      },
    },
  ];

  if (!mounted) return null;

  return (
    // ✨ [Outer wrapper — จัด floating pill ให้อยู่กลาง]
    <div
      style={{
        padding: scrolled ? "8px 16px" : "8px 16px",
        transition: "padding 0.4s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "48px",
          padding: "0 16px",

          // ── Pill shape เมื่อ scroll ──
          borderRadius: scrolled ? "100px" : "16px",

          // ── Background ──
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          backgroundColor: scrolled
            ? isDark
              ? "rgba(10, 15, 30, 0.85)"
              : "rgba(255, 255, 255, 0.85)"
            : isDark
            ? "rgba(10, 15, 30, 0.60)"
            : "rgba(255, 255, 255, 0.60)",

          // ── Border ──
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: scrolled
            ? isDark
              ? "rgba(255,255,255,0.10)"
              : "rgba(17,182,245,0.20)"
            : isDark
            ? "rgba(255,255,255,0.06)"
            : token.colorBorderSecondary,

          // ── Shadow — Dynamic Island style ──
          boxShadow: scrolled
            ? isDark
              ? "0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)"
              : "0 8px 32px rgba(17,182,245,0.15), 0 2px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)"
            : "none",

          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* ── Left: Toggle + Title ── */}
        <Flex align="center" gap={12}>
          <Tooltip title={sidebarCollapsed ? "ขยาย Sidebar" : "ย่อ Sidebar"}>
            <div
              onClick={onMenuClick}
              style={{
                width: 32,
                height: 32,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: token.colorTextSecondary,
                transition: "all 0.2s ease",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor =
                  isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
              }}
            >
              {sidebarCollapsed
                ? <MenuUnfoldOutlined style={{ fontSize: 16 }} />
                : <MenuFoldOutlined style={{ fontSize: 16 }} />
              }
            </div>
          </Tooltip>

          {/* Title */}
          <Flex vertical gap={0}>
            <Text
              strong
              style={{
                fontSize: 14,
                lineHeight: 1.2,
                color: token.colorText,
                letterSpacing: "-0.2px",
              }}
            >
              {title || "แดชบอร์ดแอดมิน"}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: token.colorTextDescription,
                lineHeight: 1.2,
              }}
            >
              SCHOOL BOARD — Admin
            </Text>
          </Flex>
        </Flex>

        {/* ── Right: User Info + Dropdown ── */}
        <Flex align="center" gap={8}>
          {user && (
            <>
              {/* User info — ซ่อนเมื่อ pill */}
              <div
                style={{
                  maxWidth: scrolled ? "0px" : "180px",
                  overflow: "hidden",
                  transition: "max-width 0.35s cubic-bezier(0.4,0,0.2,1)",
                  whiteSpace: "nowrap",
                }}
              >
                <Flex
                  vertical
                  gap={0}
                  align="flex-end"
                  style={{ paddingRight: 8 }}
                >
                  <Text strong style={{ fontSize: 13 }}>
                    {user.full_name || "ผู้ดูแล"}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {user.role === "ADMIN"
                      ? "ผู้ดูแลระบบ"
                      : user.role === "EMPLOYER"
                      ? "โรงเรียน"
                      : "ครู"}
                  </Text>
                </Flex>
              </div>

              {/* Avatar */}
              <Dropdown menu={{ items: userMenu }} placement="bottomRight" trigger={["click"]}>
                <Avatar
                  size={32}
                  style={{
                    background: "linear-gradient(135deg, #11b6f5 0%, #6366f1 100%)",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(17,182,245,0.35)",
                  }}
                >
                  {(user.full_name || "A").charAt(0).toUpperCase()}
                </Avatar>
              </Dropdown>
            </>
          )}

          {/* Separator */}
          <div
            style={{
              width: 1,
              height: 20,
              backgroundColor: isDark
                ? "rgba(255,255,255,0.12)"
                : "rgba(0,0,0,0.10)",
              margin: "0 4px",
            }}
          />

          {/* Settings shortcut */}
          <Space size={4}>
            <Tooltip title="การตั้งค่า">
              <div
                onClick={() => router.push("/pages/admin/settings")}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: token.colorTextSecondary,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor =
                    isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
                }}
              >
                <SettingOutlined style={{ fontSize: 15 }} />
              </div>
            </Tooltip>
          </Space>
        </Flex>
      </div>
    </div>
  );
}
