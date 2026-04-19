"use client";

import { useTheme } from "@/app/contexts/theme-context";
import {
  AppstoreOutlined,
  BellOutlined,
  BgColorsOutlined,
  DashboardOutlined,
  FileTextOutlined,
  GiftOutlined,
  HomeOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
  SettingOutlined,
  SolutionOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Layout, Tooltip, theme } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

// ── ประเภทของเมนู ──
interface NavLeaf {
  type: "leaf";
  key: string;
  label: string;
  icon: ReactNode;
  href: string;
}
interface NavGroup {
  type: "group";
  key: string;
  label: string;
  icon: ReactNode;
  children: NavLeaf[];
}
type NavItem = NavLeaf | NavGroup;

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
}

export function AdminSidebar({ collapsed, onCollapse }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, toggleTheme } = useTheme();
  const { token } = theme.useToken();
  const isDark = mode === "dark";

  // ── โครงสร้างเมนู + sub-menus ──
  const navItems: NavItem[] = [
    {
      type: "leaf",
      key: "/pages/admin",
      label: "แดชบอร์ด",
      icon: <DashboardOutlined />,
      href: "/pages/admin",
    },
    {
      type: "leaf",
      key: "/pages/admin/user-management",
      label: "จัดการผู้ใช้",
      icon: <TeamOutlined />,
      href: "/pages/admin/user-management",
    },
    {
      type: "group",
      key: "content",
      label: "เนื้อหา & ตั้งค่า",
      icon: <FileTextOutlined />,
      children: [
        {
          type: "leaf",
          key: "/pages/admin/blog",
          label: "จัดการบทความ",
          icon: <FileTextOutlined />,
          href: "/pages/admin/blog",
        },
        {
          type: "leaf",
          key: "/pages/admin/config",
          label: "ตัวเลือก Dropdown",
          icon: <AppstoreOutlined />,
          href: "/pages/admin/config",
        },
        {
          type: "leaf",
          key: "/pages/admin/announcement",
          label: "Announcement",
          icon: <BellOutlined />,
          href: "/pages/admin/announcement",
        },
        {
          type: "leaf",
          key: "/pages/admin/menu-management",
          label: "จัดการระบบ",
          icon: <SettingOutlined />,
          href: "/pages/admin/menu-management",
        },
      ],
    },
    {
      type: "group",
      key: "jobs",
      label: "งาน & แพ็กเกจ",
      icon: <SolutionOutlined />,
      children: [
        {
          type: "leaf",
          key: "/pages/admin/job-management",
          label: "ประกาศงาน",
          icon: <SolutionOutlined />,
          href: "/pages/admin/job-management/read",
        },
        {
          type: "leaf",
          key: "/pages/admin/package-management",
          label: "จัดการแพ็กเกจ",
          icon: <GiftOutlined />,
          href: "/pages/admin/package-management",
        },
      ],
    },
  ];

  // ── หา active key จาก pathname ──
  const allLeaves = navItems.flatMap((item) =>
    item.type === "leaf" ? [item] : item.children,
  );
  const activeKey =
    allLeaves
      .slice()
      .sort((a, b) => b.key.length - a.key.length)
      .find((item) => pathname.startsWith(item.key))?.key ?? "/pages/admin";

  // ── กลุ่มที่ควร auto-open เมื่อ path ตรง ──
  const defaultOpenGroups = navItems
    .filter(
      (item): item is NavGroup =>
        item.type === "group" &&
        item.children.some((child) => pathname.startsWith(child.key)),
    )
    .map((item) => item.key);

  const [openGroups, setOpenGroups] = useState<string[]>(defaultOpenGroups);

  // ── auto-open group เมื่อ pathname เปลี่ยน ──
  useEffect(() => {
    const autoOpen = navItems
      .filter(
        (item): item is NavGroup =>
          item.type === "group" &&
          item.children.some((child) => pathname.startsWith(child.key)),
      )
      .map((item) => item.key);
    setOpenGroups((prev) => Array.from(new Set([...prev, ...autoOpen])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ── toggle sub-menu ──
  const toggleGroup = (key: string) => {
    setOpenGroups((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  // ── สีพื้นหลัง sidebar ──
  const sidebarBg = isDark ? "#1E293B" : "#ffffff";
  const borderColor = isDark
    ? "rgba(255,255,255,0.07)"
    : token.colorBorderSecondary;

  // ── render item เดียว (leaf) ──
  const renderLeaf = (item: NavLeaf, indent = false) => {
    const isActive = activeKey === item.key;
    return (
      <Tooltip
        key={item.key}
        title={collapsed ? item.label : undefined}
        placement="right"
      >
        <button
          onClick={() => router.push(item.href)}
          className={[
            "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5",
            "transition-all duration-200 ease-out",
            "cursor-pointer border-0 outline-none",
            indent && !collapsed ? "pl-9" : "",
            isActive
              ? isDark
                ? "bg-[rgba(17,182,245,0.18)] text-[#52cfff]"
                : "bg-[rgba(17,182,245,0.1)] text-[#0d8fd4]"
              : isDark
                ? "text-slate-300 hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
                : "text-slate-600 hover:bg-[rgba(17,182,245,0.06)] hover:text-[#11b6f5]",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ background: "transparent" }}
        >
          {/* ✨ แถบสีซ้ายเมื่อ active */}
          <span
            className={[
              "absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full",
              "transition-all duration-300 ease-out",
              isActive ? "h-6 opacity-100" : "h-0 opacity-0",
            ].join(" ")}
            style={{
              background: "linear-gradient(180deg, #0d8fd4 0%, #5dd5fb 100%)",
            }}
          />

          {/* ✨ ไอคอน */}
          <span
            className={[
              "flex shrink-0 items-center justify-center text-base",
              "transition-transform duration-200 ease-out",
              "group-hover:scale-110",
              collapsed ? "mx-auto" : "",
            ].join(" ")}
            style={{ color: isActive ? "#11b6f5" : "inherit" }}
          >
            {item.icon}
          </span>

          {/* ✨ label — ซ่อนเมื่อ collapsed */}
          {!collapsed && (
            <span
              className={[
                "text-sm font-medium leading-none whitespace-nowrap",
                "transition-opacity duration-200",
                isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100",
              ].join(" ")}
            >
              {item.label}
            </span>
          )}

          {/* ✨ dot indicator เมื่อ active + collapsed */}
          {collapsed && isActive && (
            <span
              className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
              style={{ background: "#11b6f5" }}
            />
          )}
        </button>
      </Tooltip>
    );
  };

  // ── render group (มี sub-menu) ──
  const renderGroup = (item: NavGroup) => {
    const isOpen = openGroups.includes(item.key);
    const hasActiveChild = item.children.some((child) =>
      pathname.startsWith(child.key),
    );

    return (
      <div key={item.key} className="w-full">
        {/* ✨ Group header button */}
        <Tooltip title={collapsed ? item.label : undefined} placement="right">
          <button
            onClick={() => !collapsed && toggleGroup(item.key)}
            className={[
              "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5",
              "transition-all duration-200 ease-out",
              "cursor-pointer border-0 outline-none",
              hasActiveChild
                ? isDark
                  ? "bg-[rgba(17,182,245,0.12)] text-[#52cfff]"
                  : "bg-[rgba(17,182,245,0.07)] text-[#0d8fd4]"
                : isDark
                  ? "text-slate-300 hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
                  : "text-slate-600 hover:bg-[rgba(17,182,245,0.06)] hover:text-[#11b6f5]",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ background: "transparent" }}
          >
            {/* ✨ ไอคอน */}
            <span
              className={[
                "flex shrink-0 items-center justify-center text-base",
                "transition-transform duration-200 group-hover:scale-110",
                collapsed ? "mx-auto" : "",
              ].join(" ")}
              style={{ color: hasActiveChild ? "#11b6f5" : "inherit" }}
            >
              {item.icon}
            </span>

            {/* ✨ label + chevron */}
            {!collapsed && (
              <>
                <span className="flex-1 text-left text-sm font-medium leading-none whitespace-nowrap opacity-90 group-hover:opacity-100">
                  {item.label}
                </span>
                <RightOutlined
                  className={[
                    "text-xs opacity-50 transition-transform duration-300 ease-in-out",
                    isOpen ? "rotate-90" : "rotate-0",
                  ].join(" ")}
                />
              </>
            )}
          </button>
        </Tooltip>

        {/* ✨ Sub-menu accordion — เฉพาะตอน expanded */}
        {!collapsed && (
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight: isOpen ? `${item.children.length * 52}px` : "0px",
            }}
          >
            {/* ✨ เส้น indent ด้านซ้าย */}
            <div className="relative mt-1 ml-5 pl-3">
              <span
                className="absolute left-0 top-0 bottom-2 w-px rounded-full opacity-20"
                style={{ background: "#11b6f5" }}
              />
              <div className="flex flex-col gap-0.5">
                {item.children.map((child) => renderLeaf(child, true))}
              </div>
            </div>
          </div>
        )}

        {/* ✨ collapsed mode — แสดง children ด้วย Tooltip */}
        {collapsed && (
          <div className="flex flex-col gap-0.5 mt-0.5">
            {item.children.map((child) => renderLeaf(child, false))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout.Sider
      collapsed={collapsed}
      collapsible
      trigger={null}
      width={248}
      collapsedWidth={64}
      theme={isDark ? "dark" : "light"}
      style={{
        margin: "12px 0 12px 12px",
        borderRadius: token.borderRadiusLG,
        height: "calc(100vh - 24px)",
        position: "sticky",
        top: 12,
        overflow: "hidden",
        flexShrink: 0,
        background: sidebarBg,
        boxShadow: isDark
          ? "0 8px 32px rgba(0,0,0,0.45)"
          : "0 8px 24px rgba(17,182,245,0.12)",
        border: `1px solid ${borderColor}`,
        transition: "width 0.35s cubic-bezier(0.4,0,0.2,1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="flex h-full flex-col" style={{ background: sidebarBg }}>
        {/* ── Logo ── */}
        <div
          className="flex shrink-0 items-center gap-3 overflow-hidden px-4"
          style={{
            height: 64,
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          {/* ✨ Avatar gradient */}
          <div
            className="flex shrink-0 items-center justify-center rounded-full font-extrabold text-white shadow-md"
            style={{
              width: 34,
              height: 34,
              fontSize: 14,
              background:
                "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 55%, #5dd5fb 100%)",
              boxShadow: "0 4px 14px rgba(17,182,245,0.4)",
            }}
          >
            S
          </div>

          {/* ✨ ชื่อแอป — ซ่อนเมื่อ collapsed */}
          <div
            className={[
              "flex flex-col overflow-hidden",
              "transition-all duration-300 ease-in-out",
              collapsed ? "w-0 opacity-0" : "w-full opacity-100",
            ].join(" ")}
          >
            <span
              className="text-xs font-extrabold uppercase tracking-widest whitespace-nowrap"
              style={{
                background:
                  "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 55%, #5dd5fb 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.4,
              }}
            >
              SCHOOL BOARD
            </span>
            <span
              className="text-[10px] whitespace-nowrap"
              style={{ color: token.colorTextSecondary }}
            >
              Admin Panel
            </span>
          </div>
        </div>

        {/* ── Navigation Menu ── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2">
          <div className="flex flex-col gap-0.5">
            {navItems.map((item) =>
              item.type === "leaf" ? renderLeaf(item) : renderGroup(item),
            )}
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div
          className="shrink-0 flex flex-col gap-1 px-2 py-3"
          style={{ borderTop: `1px solid ${borderColor}` }}
        >
          {/* ✨ Toggle Dark/Light */}
          <Tooltip
            title={
              collapsed ? (isDark ? "Light Mode" : "Dark Mode") : undefined
            }
            placement="right"
          >
            <button
              onClick={toggleTheme}
              className={[
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5",
                "transition-all duration-200 ease-out border-0 outline-none cursor-pointer",
                isDark
                  ? "text-slate-300 hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
                  : "text-slate-500 hover:bg-[rgba(17,182,245,0.06)] hover:text-[#11b6f5]",
              ].join(" ")}
              style={{ background: "transparent" }}
            >
              <span className="flex shrink-0 items-center justify-center text-base transition-transform duration-200 group-hover:scale-110">
                <BgColorsOutlined />
              </span>
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap opacity-80 group-hover:opacity-100">
                  {isDark ? "Light Mode" : "Dark Mode"}
                </span>
              )}
            </button>
          </Tooltip>

          {/* ✨ กลับหน้าหลัก */}
          <Tooltip
            title={collapsed ? "กลับหน้าหลัก" : undefined}
            placement="right"
          >
            <button
              onClick={() => router.push("/")}
              className={[
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5",
                "transition-all duration-200 ease-out border-0 outline-none cursor-pointer",
                isDark
                  ? "text-slate-300 hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
                  : "text-slate-500 hover:bg-[rgba(17,182,245,0.06)] hover:text-[#11b6f5]",
              ].join(" ")}
              style={{ background: "transparent" }}
            >
              <span className="flex shrink-0 items-center justify-center text-base transition-transform duration-200 group-hover:scale-110">
                <HomeOutlined />
              </span>
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap opacity-80 group-hover:opacity-100">
                  กลับหน้าหลัก
                </span>
              )}
            </button>
          </Tooltip>

          {/* ✨ Collapse toggle */}
          <Tooltip
            title={collapsed ? "ขยาย Sidebar" : undefined}
            placement="right"
          >
            <button
              onClick={() => onCollapse(!collapsed)}
              className={[
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5",
                "transition-all duration-200 ease-out border-0 outline-none cursor-pointer",
                isDark
                  ? "text-slate-300 hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
                  : "text-slate-500 hover:bg-[rgba(17,182,245,0.06)] hover:text-[#11b6f5]",
              ].join(" ")}
              style={{ background: "transparent" }}
            >
              <span
                className={[
                  "flex shrink-0 items-center justify-center text-base",
                  "transition-all duration-300 ease-in-out",
                  collapsed ? "rotate-0" : "rotate-180",
                ].join(" ")}
              >
                <MenuUnfoldOutlined />
              </span>
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap opacity-80 group-hover:opacity-100">
                  ย่อ Sidebar
                </span>
              )}
            </button>
          </Tooltip>
        </div>
      </div>
    </Layout.Sider>
  );
}
