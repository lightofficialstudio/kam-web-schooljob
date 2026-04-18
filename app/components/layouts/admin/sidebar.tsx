"use client";

import { useTheme } from "@/app/contexts/theme-context";
import {
  AppstoreOutlined,
  BgColorsOutlined,
  DashboardOutlined,
  FileTextOutlined,
  GiftOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SolutionOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Flex, Layout, Menu, Tooltip, Typography, theme } from "antd";
import { usePathname, useRouter } from "next/navigation";

const { Text } = Typography;

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
}

type MenuItem = Required<MenuProps>["items"][number];

export function AdminSidebar({ collapsed, onCollapse }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, toggleTheme } = useTheme();
  const { token } = theme.useToken();

  const isDark = mode === "dark";

  const menuItems: MenuItem[] = [
    {
      key: "/pages/admin",
      icon: <DashboardOutlined />,
      label: "แดชบอร์ด",
      onClick: () => router.push("/pages/admin"),
    },
    {
      key: "/pages/admin/user-management",
      icon: <TeamOutlined />,
      label: "จัดการผู้ใช้",
      onClick: () => router.push("/pages/admin/user-management"),
    },
    {
      key: "/pages/admin/blog",
      icon: <FileTextOutlined />,
      label: "จัดการบทความ",
      onClick: () => router.push("/pages/admin/blog"),
    },
    {
      key: "/pages/admin/package-management",
      icon: <GiftOutlined />,
      label: "จัดการแพ็กเกจ",
      onClick: () => router.push("/pages/admin/package-management"),
    },
    {
      key: "/pages/admin/config",
      icon: <AppstoreOutlined />,
      label: "ตัวเลือก Dropdown",
      onClick: () => router.push("/pages/admin/config"),
    },
    {
      key: "/pages/admin/job-management",
      icon: <SolutionOutlined />,
      label: "จัดการประกาศงาน",
      onClick: () => router.push("/pages/admin/job-management/create"),
    },
  ];

  // หา selected key จาก pathname — match ยาวสุดก่อน
  const selectedKey =
    (menuItems as { key: string }[])
      .slice()
      .sort((a, b) => b.key.length - a.key.length)
      .find((item) => pathname.startsWith(item.key))?.key ?? "/pages/admin";

  return (
    <>
      {/* ── Floating Sider ── */}
      <Layout.Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        width={248}
        collapsedWidth={64}
        theme={isDark ? "dark" : "light"}
        style={{
          // Floating effect
          margin: "12px 0 12px 12px",
          borderRadius: token.borderRadiusLG,
          height: "calc(100vh - 24px)",
          position: "sticky",
          top: 12,
          overflow: "hidden",
          flexShrink: 0,
          boxShadow: isDark
            ? "0 8px 32px rgba(0,0,0,0.45)"
            : "0 8px 24px rgba(17,182,245,0.12)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : token.colorBorderSecondary}`,
          transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* ── Logo ── */}
        <Flex
          align="center"
          justify="center"
          gap={10}
          style={{
            height: 64,
            padding: "0 16px",
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : token.colorBorderSecondary}`,
            overflow: "hidden",
          }}
        >
          {/* Avatar circle */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${token.colorPrimary} 0%, #6366f1 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 14,
              flexShrink: 0,
              boxShadow: `0 4px 12px ${token.colorPrimaryBg}`,
            }}
          >
            S
          </div>

          {!collapsed && (
            <Flex vertical gap={0} style={{ overflow: "hidden" }}>
              <Text
                strong
                style={{
                  fontSize: 12,
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  background: `linear-gradient(135deg, ${token.colorPrimary} 0%, #6366f1 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  whiteSpace: "nowrap",
                  lineHeight: 1.3,
                }}
              >
                SCHOOL BOARD
              </Text>
              <Text
                type="secondary"
                style={{ fontSize: 10, whiteSpace: "nowrap" }}
              >
                Admin Panel
              </Text>
            </Flex>
          )}
        </Flex>

        {/* ── Menu ── */}
        <Menu
          mode="inline"
          theme={isDark ? "dark" : "light"}
          selectedKeys={[selectedKey]}
          items={menuItems}
          inlineIndent={16}
          style={{
            border: "none",
            background: "transparent",
            flex: 1,
            paddingTop: 8,
            paddingInline: collapsed ? 4 : 8,
          }}
        />

        {/* ── Footer Actions ── */}
        <Flex
          vertical
          gap={4}
          style={{
            padding: "12px 8px 16px",
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : token.colorBorderSecondary}`,
          }}
        >
          <Tooltip
            title={
              collapsed ? (isDark ? "Light Mode" : "Dark Mode") : undefined
            }
            placement="right"
          >
            <Button
              block
              type="text"
              icon={<BgColorsOutlined />}
              onClick={toggleTheme}
              style={{ justifyContent: collapsed ? "center" : "flex-start" }}
            >
              {!collapsed && (isDark ? "Light Mode" : "Dark Mode")}
            </Button>
          </Tooltip>

          <Tooltip
            title={collapsed ? "กลับหน้าหลัก" : undefined}
            placement="right"
          >
            <Button
              block
              type="text"
              icon={<HomeOutlined />}
              onClick={() => router.push("/")}
              style={{ justifyContent: collapsed ? "center" : "flex-start" }}
            >
              {!collapsed && "กลับหน้าหลัก"}
            </Button>
          </Tooltip>

          <Tooltip
            title={collapsed ? "ขยาย Sidebar" : undefined}
            placement="right"
          >
            <Button
              block
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => onCollapse(!collapsed)}
              style={{ justifyContent: collapsed ? "center" : "flex-start" }}
            >
              {!collapsed && "ย่อ Sidebar"}
            </Button>
          </Tooltip>
        </Flex>
      </Layout.Sider>
    </>
  );
}
