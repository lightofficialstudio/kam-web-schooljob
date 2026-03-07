"use client";

import { useAuthStore } from "@/app/stores/auth-store";
import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Dropdown, Tooltip } from "antd";
import { useRouter } from "next/navigation";

interface AdminNavbarProps {
  onMenuClick?: () => void;
  title?: string;
}

export function AdminNavbar({ onMenuClick, title }: AdminNavbarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  // ✨ [Dropdown menu สำหรับ User]
  const userMenu: MenuProps["items"] = [
    {
      key: "profile",
      label: "Profile",
      onClick: () => router.push("/admin/profile"),
    },
    {
      key: "settings",
      label: "Settings",
      onClick: () => router.push("/admin/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      onClick: () => {
        logout();
        router.push("/pages/signin");
      },
    },
  ];

  return (
    <nav className="bg-linear-to-r from-slate-800 to-slate-900 text-white shadow-lg border-b border-slate-700">
      <div className="flex items-center justify-between h-16 px-6">
        {/* ✨ [Left: Menu Toggle + Title] */}
        <div className="flex items-center gap-4">
          <Tooltip title="Toggle Sidebar">
            <Button
              type="text"
              icon={<MenuOutlined className="text-xl" />}
              onClick={onMenuClick}
              className="text-white hover:bg-slate-700 transition-colors"
            />
          </Tooltip>

          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white">
              {title || "Admin Dashboard"}
            </h1>
            <p className="text-xs text-slate-400">KAM - School Job Platform</p>
          </div>
        </div>

        {/* ✨ [Right: User Menu] */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3 pr-4 border-r border-slate-700">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  {user.full_name || "User"}
                </p>
                <p className="text-xs text-slate-400 capitalize">
                  {user.role?.toLowerCase() || "user"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {(user.full_name || "A").charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          <Dropdown menu={{ items: userMenu }} trigger={["click"]}>
            <Tooltip title="User Menu">
              <Button
                type="text"
                icon={<LogoutOutlined className="text-lg" />}
                className="text-white hover:bg-slate-700 transition-colors"
              />
            </Tooltip>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
}
