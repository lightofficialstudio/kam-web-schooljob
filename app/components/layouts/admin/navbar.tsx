"use client";

import { useTheme } from "@/app/contexts/theme-context";
import { useAuthStore } from "@/app/stores/auth-store";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Dropdown, Flex, theme, Tooltip, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const { useToken } = theme;
const { Text } = Typography;

interface AdminNavbarProps {
  onMenuClick?: () => void;
  title?: string;
  sidebarCollapsed?: boolean;
}

export function AdminNavbar({ onMenuClick, title, sidebarCollapsed }: AdminNavbarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { mode } = useTheme();
  const { token } = useToken();
  const isDark = mode === "dark";

  // ✨ [Scroll detection — ไม่มี mounted state, setState ใน callback ไม่ใช่ใน body ของ effect]
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 60;
      if (next !== scrolledRef.current) {
        scrolledRef.current = next;
        setScrolled(next);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // ✨ [Token-based colors — ไม่มี hardcode]
  const pillBg = isDark
    ? "rgba(10,15,30,0.82)"
    : "rgba(255,255,255,0.82)";

  const barBg = isDark
    ? "rgba(10,15,30,0.55)"
    : "rgba(255,255,255,0.55)";

  const pillBorder = isDark
    ? "rgba(255,255,255,0.10)"
    : `rgba(17,182,245,0.20)`;

  const barBorder = isDark
    ? "rgba(255,255,255,0.06)"
    : token.colorBorderSecondary;

  const pillShadow = isDark
    ? "0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)"
    : "0 8px 32px rgba(17,182,245,0.15), 0 2px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)";

  const roleLabel =
    user?.role === "ADMIN"
      ? "ผู้ดูแลระบบ"
      : user?.role === "EMPLOYER"
      ? "โรงเรียน"
      : "ครู";

  return (
    // ✨ [Outer wrapper — จัด alignment และ padding เมื่อ scroll]
    <div
      suppressHydrationWarning
      style={{
        padding: scrolled ? "8px 24px" : "8px 0",
        transition: "padding 0.4s cubic-bezier(0.4,0,0.2,1)",
        display: "flex",
        justifyContent: scrolled ? "center" : "stretch",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 52,
          padding: "0 16px",
          width: "100%",

          // ── Dynamic Island morph ──
          maxWidth: scrolled ? 820 : "100%",
          borderRadius: scrolled ? 100 : 0,

          // ── Glass background ──
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          backgroundColor: scrolled ? pillBg : barBg,

          // ── Border ──
          border: `1px solid ${scrolled ? pillBorder : barBorder}`,

          // ── Shadow ──
          boxShadow: scrolled ? pillShadow : "none",

          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* ── Left: Sidebar Toggle + Page Title ── */}
        <Flex align="center" gap={12}>
          <Tooltip title={sidebarCollapsed ? "ขยาย Sidebar" : "ย่อ Sidebar"}>
            <div
              onClick={onMenuClick}
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: token.colorTextSecondary,
                transition: "background 0.2s ease, color 0.2s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = isDark
                  ? "rgba(255,255,255,0.09)"
                  : "rgba(0,0,0,0.06)";
                (e.currentTarget as HTMLDivElement).style.color = token.colorPrimary;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLDivElement).style.color = token.colorTextSecondary;
              }}
            >
              {sidebarCollapsed
                ? <MenuUnfoldOutlined style={{ fontSize: 16 }} />
                : <MenuFoldOutlined style={{ fontSize: 16 }} />
              }
            </div>
          </Tooltip>

          {/* Page title */}
          <Flex vertical gap={0}>
            <Text
              strong
              style={{
                fontSize: 14,
                lineHeight: 1.25,
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
                lineHeight: 1.25,
                letterSpacing: "0.3px",
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
              {/* User name+role — ซ่อนเมื่อเป็น pill */}
              <div
                style={{
                  maxWidth: scrolled ? 0 : 180,
                  overflow: "hidden",
                  transition: "max-width 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
                  opacity: scrolled ? 0 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                <Flex vertical gap={0} align="flex-end" style={{ paddingRight: 8 }}>
                  <Text strong style={{ fontSize: 13, color: token.colorText }}>
                    {user.full_name || "ผู้ดูแล"}
                  </Text>
                  <Text style={{ fontSize: 11, color: token.colorTextDescription }}>
                    {roleLabel}
                  </Text>
                </Flex>
              </div>

              {/* Avatar + Dropdown */}
              <Dropdown
                menu={{ items: userMenu }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Avatar
                  size={34}
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

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: 20,
              backgroundColor: isDark
                ? "rgba(255,255,255,0.12)"
                : "rgba(0,0,0,0.10)",
              margin: "0 4px",
              flexShrink: 0,
            }}
          />

          {/* Settings shortcut */}
          <Tooltip title="การตั้งค่า">
            <div
              onClick={() => router.push("/pages/admin/settings")}
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: token.colorTextSecondary,
                transition: "background 0.2s ease, color 0.2s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = isDark
                  ? "rgba(255,255,255,0.09)"
                  : "rgba(0,0,0,0.06)";
                (e.currentTarget as HTMLDivElement).style.color = token.colorPrimary;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLDivElement).style.color = token.colorTextSecondary;
              }}
            >
              <SettingOutlined style={{ fontSize: 15 }} />
            </div>
          </Tooltip>
        </Flex>
      </div>
    </div>
  );
}
