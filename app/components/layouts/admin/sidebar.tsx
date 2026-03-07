"use client";

import {
  DashboardOutlined,
  FileTextOutlined,
  HomeOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";

interface AdminSidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

type MenuItem = Required<MenuProps>["items"][number];

export function AdminSidebar({ collapsed = false }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // ✨ [Menu Items สำหรับ Admin]
  const menuItems: MenuItem[] = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => router.push("/admin"),
    },
    {
      key: "/admin/users",
      icon: <TeamOutlined />,
      label: "User Management",
      onClick: () => router.push("/admin/user-management"),
    },
    {
      key: "/admin/jobs",
      icon: <FileTextOutlined />,
      label: "Job Management",
      onClick: () => router.push("/admin/jobs"),
    },
    {
      type: "divider",
    },
    {
      key: "/admin/settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => router.push("/admin/settings"),
    },
  ];

  // ✨ [หาถ้า current pathname match]
  const selectedKey =
    menuItems.find(
      (item) => item && "key" in item && pathname.includes(item.key as string),
    )?.key || "/admin";

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-slate-800 min-h-screen text-white border-r border-slate-700 transition-all duration-300 overflow-hidden`}
    >
      {/* ✨ [Logo Section] */}
      <div className="h-16 flex items-center justify-center border-b border-slate-700">
        <div className="text-center">
          <h2
            className={`font-bold text-blue-400 ${collapsed ? "text-sm" : "text-lg"}`}
          >
            KAM
          </h2>
          {!collapsed && <p className="text-xs text-slate-400">Admin Panel</p>}
        </div>
      </div>

      {/* ✨ [Menu Items] */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey as string]}
        items={menuItems}
        className="bg-slate-800 border-none"
        inlineIndent={16}
      />

      {/* ✨ [Footer Section] */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-700">
        <button onClick={() => router.push("/")} className="w-full">
          <div className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm">
            <HomeOutlined />
            {!collapsed && <span>Back to Home</span>}
          </div>
        </button>
      </div>
    </div>
  );
}
