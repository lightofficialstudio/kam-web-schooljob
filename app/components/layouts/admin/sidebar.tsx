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
import { Button, Layout, Menu, Tooltip, theme } from "antd";
import { usePathname, useRouter } from "next/navigation";

const { useToken } = theme;

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
}

type MenuItem = Required<MenuProps>["items"][number];

export function AdminSidebar({ collapsed, onCollapse }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, toggleTheme } = useTheme();
  const { token } = useToken();

  const isDark = mode === "dark";

  // ✨ [สีพื้นหลัง Sidebar]
  const sidebarBg = isDark
    ? "linear-gradient(160deg, #0f172a 0%, #0f1f3d 55%, #0f172a 100%)"
    : "linear-gradient(160deg, #ffffff 0%, #f0f7ff 55%, #f8fafc 100%)";

  const borderColor = isDark
    ? "rgba(255,255,255,0.07)"
    : "rgba(17,182,245,0.12)";

  const textMuted = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";

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

  // ✨ [หา selected key จาก pathname — match ยาวสุดก่อน]
  const validItems = menuItems.filter(
    (item): item is NonNullable<typeof item> => !!item && "key" in item,
  );
  const selectedKey =
    validItems
      .sort(
        (a, b) =>
          ((b.key as string).length || 0) - ((a.key as string).length || 0),
      )
      .find((item) => pathname.startsWith(item.key as string))?.key ||
    "/pages/admin";

  return (
    <Layout.Sider
      collapsed={collapsed}
      collapsible
      trigger={null}
      width={260}
      collapsedWidth={72}
      style={{
        background: sidebarBg,
        boxShadow: isDark
          ? "4px 0 24px rgba(0,0,0,0.35)"
          : "4px 0 20px rgba(17,182,245,0.08)",
        borderRight: `1px solid ${borderColor}`,
        position: "relative",
        overflow: "hidden",
        transition: "width 0.35s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
      }}
    >
      {/* ✨ [Dot-grid background pattern] */}
      <div
        suppressHydrationWarning
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: isDark
            ? "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(17,182,245,0.12) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ✨ [Glow Blob — top right] */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 220,
          height: 220,
          background: isDark
            ? `radial-gradient(circle, rgba(17,182,245,0.18) 0%, transparent 70%)`
            : `radial-gradient(circle, rgba(17,182,245,0.14) 0%, transparent 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ✨ [Glow Blob — bottom left] */}
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -60,
          width: 280,
          height: 280,
          background: isDark
            ? `radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)`
            : `radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ✨ [Logo Area] */}
      <div
        style={{
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${borderColor}`,
          background: isDark
            ? "linear-gradient(135deg, rgba(17,182,245,0.18) 0%, rgba(17,182,245,0.06) 100%)"
            : "linear-gradient(135deg, rgba(17,182,245,0.10) 0%, rgba(17,182,245,0.03) 100%)",
          backdropFilter: "blur(8px)",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Icon circle — always visible */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${token.colorPrimary} 0%, #6366f1 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 16,
            color: "#fff",
            flexShrink: 0,
            boxShadow: `0 4px 12px rgba(17,182,245,0.45)`,
            transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          S
        </div>

        {/* Text — ซ่อนเมื่อ collapsed */}
        <div
          style={{
            maxWidth: collapsed ? 0 : 160,
            overflow: "hidden",
            whiteSpace: "nowrap",
            transition: "max-width 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
            opacity: collapsed ? 0 : 1,
            marginLeft: collapsed ? 0 : 10,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              background: isDark
                ? "linear-gradient(135deg, #7dd3fc 0%, #a5b4fc 100%)"
                : `linear-gradient(135deg, ${token.colorPrimary} 0%, #6366f1 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
            }}
          >
            SCHOOL BOARD
          </div>
          <div style={{ fontSize: 10, color: textMuted, letterSpacing: "0.5px", marginTop: 2 }}>
            Admin Panel
          </div>
        </div>
      </div>

      {/* ✨ [Menu Items] */}
      <div
        style={{
          paddingTop: 12,
          paddingBottom: 120,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey as string]}
          items={menuItems}
          inlineIndent={12}
          style={{
            background: "transparent",
            border: "none",
            paddingLeft: collapsed ? 0 : 8,
            paddingRight: collapsed ? 0 : 8,
          }}
          // ✨ [ใช้ token สี — ไม่มี style tag]
          theme={isDark ? "dark" : "light"}
        />
      </div>

      {/* ✨ [Active left-bar indicator — inject via data attribute + CSS variable] */}
      <style>{`
        /* ── Shared menu item base ── */
        .admin-sidebar .ant-menu-item {
          position: relative !important;
          border-radius: 10px !important;
          margin: 4px 0 !important;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1) !important;
        }

        /* ── Active bar indicator ── */
        .admin-sidebar .ant-menu-item-selected::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 3px;
          background: linear-gradient(180deg, #7dd3fc 0%, #11b6f5 100%);
          border-radius: 0 3px 3px 0;
        }

        /* ── Hover translate ── */
        .admin-sidebar .ant-menu-item:not(.ant-menu-item-selected):hover {
          transform: translateX(3px);
        }
      `}</style>

      {/* ✨ [Footer — Theme toggle + กลับหน้าหลัก] */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 12px 16px",
          borderTop: `1px solid ${borderColor}`,
          background: isDark
            ? "linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 100%)"
            : "linear-gradient(0deg, rgba(255,255,255,0.6) 0%, transparent 100%)",
          backdropFilter: "blur(8px)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* Theme toggle */}
        <Tooltip
          title={
            collapsed
              ? mode === "dark"
                ? "Light Mode"
                : "Dark Mode"
              : undefined
          }
          placement="right"
        >
          <Button
            block
            type="text"
            icon={<BgColorsOutlined />}
            onClick={toggleTheme}
            style={{
              color: isDark ? "rgba(255,255,255,0.65)" : token.colorTextSecondary,
              borderRadius: 10,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 8,
              paddingLeft: collapsed ? 0 : 12,
              transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {!collapsed && (mode === "dark" ? "Light Mode" : "Dark Mode")}
          </Button>
        </Tooltip>

        {/* กลับหน้าหลัก */}
        <Tooltip
          title={collapsed ? "กลับหน้าหลัก" : undefined}
          placement="right"
        >
          <Button
            block
            type="text"
            icon={<HomeOutlined />}
            onClick={() => router.push("/")}
            style={{
              color: isDark ? "rgba(255,255,255,0.65)" : token.colorTextSecondary,
              borderRadius: 10,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 8,
              paddingLeft: collapsed ? 0 : 12,
              transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {!collapsed && "กลับหน้าหลัก"}
          </Button>
        </Tooltip>

        {/* Collapse toggle */}
        <Button
          block
          type="text"
          onClick={() => onCollapse(!collapsed)}
          style={{
            color: isDark ? "rgba(255,255,255,0.35)" : token.colorTextQuaternary,
            borderRadius: 10,
            height: 32,
            fontSize: 11,
            letterSpacing: "0.5px",
          }}
        >
          {collapsed ? "›" : "‹ ย่อ Sidebar"}
        </Button>
      </div>
    </Layout.Sider>
  );
}
