"use client";

import { useTheme } from "@/app/contexts/theme-context";
import {
  BgColorsOutlined,
  DashboardOutlined,
  FileTextOutlined,
  HomeOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Layout, Menu, Tooltip } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminSidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

type MenuItem = Required<MenuProps>["items"][number];

export function AdminSidebar({ collapsed = false }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"light" | "dark">("dark");

  // ✨ [Initialize theme from localStorage]
  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("app-theme") as "light" | "dark") || "dark";
    setMode(savedTheme);
    setMounted(true);
  }, []);

  // ✨ [Try to use theme context for live updates]
  try {
    const themeContext = useTheme();
    useEffect(() => {
      if (themeContext && mounted) {
        setMode(themeContext.mode);
      }
    }, [themeContext?.mode]);
  } catch {
    // Fall back to localStorage if context not available
  }

  // ✨ [Menu Items สำหรับ Admin]
  const menuItems: MenuItem[] = [
    {
      key: "/pages/admin",
      icon: <DashboardOutlined style={{ fontSize: "16px" }} />,
      label: "แดชบอร์ด",
      onClick: () => router.push("/pages/admin"),
    },
    {
      key: "/pages/admin/user-management",
      icon: <TeamOutlined style={{ fontSize: "16px" }} />,
      label: "จัดการผู้ใช้",
      onClick: () => router.push("/pages/admin/user-management"),
    },
    {
      key: "/pages/admin/jobs",
      icon: <FileTextOutlined style={{ fontSize: "16px" }} />,
      label: "จัดการงาน",
      onClick: () => router.push("/pages/admin/jobs"),
    },
    {
      key: "/pages/admin/settings",
      icon: <SettingOutlined style={{ fontSize: "16px" }} />,
      label: "การตั้งค่า",
      onClick: () => router.push("/pages/admin/settings"),
    },
  ];

  // ✨ [หาถ้า current pathname match]
  const selectedKey =
    menuItems.find(
      (item) => item && "key" in item && pathname.includes(item.key as string),
    )?.key || "/pages/admin";

  if (!mounted) return null;

  return (
    <Layout.Sider
      collapsed={collapsed}
      width={280}
      theme={mode}
      style={{
        background:
          mode === "dark"
            ? "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1a1f3a 100%)"
            : "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
        boxShadow:
          mode === "dark"
            ? "4px 0 16px rgba(0, 0, 0, 0.25)"
            : "4px 0 16px rgba(0, 0, 0, 0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ✨ [Background Animation Element] */}
      <div
        style={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          background:
            mode === "dark"
              ? "radial-gradient(circle, rgba(30, 58, 138, 0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(96, 165, 250, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100,
          left: -50,
          width: 300,
          height: 300,
          background:
            mode === "dark"
              ? "radial-gradient(circle, rgba(30, 58, 138, 0.1) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(96, 165, 250, 0.05) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      {/* ✨ [Logo Section - Premium Style] */}
      <div
        style={{
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom:
            mode === "dark"
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid rgba(0, 0, 0, 0.08)",
          background:
            mode === "dark"
              ? "linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(30, 58, 138, 0.2) 100%)"
              : "linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(96, 165, 250, 0.05) 100%)",
          backdropFilter: "blur(10px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {collapsed ? (
          <div
            style={{
              fontSize: "20px",
              fontWeight: 800,
              background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
              letterSpacing: "2px",
              animation: "fadeInScale 0.5s ease-out",
            }}
          >
            K
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 800,
                background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "4px",
                letterSpacing: "3px",
                animation: "fadeInScale 0.5s ease-out",
              }}
            >
              KAM
            </div>
            <div
              style={{
                fontSize: "10px",
                color:
                  mode === "dark"
                    ? "rgba(139, 189, 255, 0.7)"
                    : "rgba(96, 165, 250, 0.7)",
                marginTop: "2px",
                fontWeight: 600,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Admin Panel
            </div>
          </div>
        )}
      </div>

      {/* ✨ [Menu Items - Enhanced] */}
      <div
        style={{
          paddingTop: "16px",
          paddingBottom: "80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Menu
          theme={mode}
          mode="inline"
          selectedKeys={[selectedKey as string]}
          items={menuItems}
          style={{
            background: "transparent",
            border: "none",
            paddingLeft: "8px",
            paddingRight: "8px",
          }}
          inlineIndent={12}
        />
      </div>

      {/* ✨ [Footer Section - Home Button] */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          zIndex: 1,
        }}
      >
        {/* ✨ [Theme Toggle Button] */}
        <div
          style={{
            marginBottom: "12px",
            paddingBottom: "12px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Tooltip
            title={
              mode === "dark" ? "สวิตช์เป็น Light Mode" : "สวิตช์เป็น Dark Mode"
            }
          >
            <Button
              block
              type="text"
              icon={<BgColorsOutlined style={{ fontSize: "16px" }} />}
              onClick={() => {
                const newMode = mode === "dark" ? "light" : "dark";
                setMode(newMode);
                localStorage.setItem("app-theme", newMode);
                window.location.reload();
              }}
              style={{
                color:
                  mode === "dark"
                    ? "rgba(255, 255, 255, 0.75)"
                    : "rgba(0, 0, 0, 0.75)",
                borderRadius: "8px",
                transition: "all 0.3s ease",
              }}
            >
              {!collapsed && (mode === "dark" ? "Light Mode" : "Dark Mode")}
            </Button>
          </Tooltip>
        </div>

        {/* ✨ [Home Menu] */}
        <Menu
          theme={mode === "dark" ? "dark" : "light"}
          mode="inline"
          items={[
            {
              key: "home",
              icon: <HomeOutlined style={{ fontSize: "16px" }} />,
              label: collapsed ? "" : "กลับหน้าหลัก",
              onClick: () => router.push("/"),
            },
          ]}
          style={{
            background: "transparent",
            border: "none",
          }}
        />
      </div>

      {/* ✨ [CSS Animations] */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(20px);
          }
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Dark Mode Menu Styles */
        .ant-layout-sider-dark .ant-menu-dark .ant-menu-item {
          position: relative;
          border-radius: 8px !important;
          margin: 8px 0 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          color: rgba(255, 255, 255, 0.75) !important;
          background: rgba(255, 255, 255, 0.02) !important;
        }

        .ant-layout-sider-dark .ant-menu-dark .ant-menu-item:hover {
          background: rgba(96, 165, 250, 0.12) !important;
          color: #60a5fa !important;
          transform: translateX(4px);
          box-shadow: inset 0 0 0 1px rgba(96, 165, 250, 0.2);
        }

        .ant-layout-sider-dark .ant-menu-dark .ant-menu-item-selected {
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.2) 0%, rgba(59, 130, 246, 0.15) 100%) !important;
          color: #93c5fd !important;
          font-weight: 600;
          box-shadow: inset 0 0 0 1px rgba(96, 165, 250, 0.3);
        }

        .ant-layout-sider-dark .ant-menu-dark .ant-menu-item-selected::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
          border-radius: 0 3px 3px 0;
        }

        .ant-layout-sider-dark .ant-menu-dark .ant-menu-item-icon {
          font-size: 16px !important;
          transition: all 0.3s ease !important;
        }

        .ant-layout-sider-dark .ant-menu-dark .ant-menu-item:hover .ant-menu-item-icon {
          color: #60a5fa !important;
          transform: rotate(5deg) scale(1.1);
        }

        .ant-layout-sider-dark .ant-menu-dark .ant-menu-item-selected .ant-menu-item-icon {
          color: #93c5fd !important;
        }

        /* Light Mode Menu Styles */
        .ant-layout-sider-light .ant-menu-light .ant-menu-item {
          position: relative;
          border-radius: 8px !important;
          margin: 8px 0 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          color: rgba(0, 0, 0, 0.75) !important;
          background: rgba(0, 0, 0, 0.02) !important;
        }

        .ant-layout-sider-light .ant-menu-light .ant-menu-item:hover {
          background: rgba(96, 165, 250, 0.1) !important;
          color: #1890ff !important;
          transform: translateX(4px);
          box-shadow: inset 0 0 0 1px rgba(96, 165, 250, 0.2);
        }

        .ant-layout-sider-light .ant-menu-light .ant-menu-item-selected {
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%) !important;
          color: #1890ff !important;
          font-weight: 600;
          box-shadow: inset 0 0 0 1px rgba(96, 165, 250, 0.3);
        }

        .ant-layout-sider-light .ant-menu-light .ant-menu-item-selected::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #1890ff 0%, #096dd9 100%);
          border-radius: 0 3px 3px 0;
        }

        .ant-layout-sider-light .ant-menu-light .ant-menu-item-icon {
          font-size: 16px !important;
          transition: all 0.3s ease !important;
        }

        .ant-layout-sider-light .ant-menu-light .ant-menu-item:hover .ant-menu-item-icon {
          color: #1890ff !important;
          transform: rotate(5deg) scale(1.1);
        }

        .ant-layout-sider-light .ant-menu-light .ant-menu-item-selected .ant-menu-item-icon {
          color: #1890ff !important;
        }

        .ant-menu-item-divider {
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%) !important;
          margin: 12px 0 !important;
        }
      `}</style>
    </Layout.Sider>
  );
}
