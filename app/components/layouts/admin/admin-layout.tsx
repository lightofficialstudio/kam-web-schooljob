"use client";

import { ReactNode, useState } from "react";
import { AdminNavbar } from "./navbar";
import { AdminSidebar } from "./sidebar";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* ✨ [Sidebar] */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
      />

      {/* ✨ [Main Content Area] */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ✨ [Navbar] */}
        <AdminNavbar
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={title}
        />

        {/* ✨ [Content] */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
