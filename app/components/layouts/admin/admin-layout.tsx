"use client";

import { Layout } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { AdminNavbar } from "./navbar";
import { AdminSidebar } from "./sidebar";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"light" | "dark">("dark");

  // ✨ [Initialize theme from localStorage]
  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("app-theme") as "light" | "dark") || "dark";
    setMode(savedTheme);
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <AdminSidebar collapsed={false} onCollapse={() => {}} />
          <Layout>
            <AdminNavbar onMenuClick={() => {}} title={title} />
            <Layout.Content style={{ padding: "24px", overflow: "auto" }}>
              {children}
            </Layout.Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout
      style={{
        minHeight: "100vh",
        fontFamily:
          "'Kanit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: mode === "dark" ? "#141414" : "#f5f5f5",
      }}
    >
      <Layout>
        {/* ✨ [Sidebar] */}
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
        />

        {/* ✨ [Main Content Area] */}
        <Layout>
          {/* ✨ [Navbar] */}
          <AdminNavbar
            onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={title}
          />

          {/* ✨ [Content] */}
          <Layout.Content
            style={{
              padding: "24px",
              overflow: "auto",
              background: mode === "dark" ? "#141414" : "#f5f5f5",
            }}
          >
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
