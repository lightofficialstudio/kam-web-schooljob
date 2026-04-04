"use client";

import { Layout } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { AdminBreadcrumb } from "./breadcrumb";
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
            <Layout.Header
              style={{
                padding: 0,
              }}
            >
              <AdminNavbar onMenuClick={() => {}} title={title} mode={mode} />
            </Layout.Header>
            <Layout.Content style={{ padding: "24px", overflow: "auto" }}>
              <AdminBreadcrumb />
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
          {/* ✨ [Navbar with Theme Styling] */}
          <Layout.Header
            style={{
              boxShadow:
                mode === "dark"
                  ? "0 2px 8px rgba(0, 0, 0, 0.15)"
                  : "0 2px 8px rgba(0, 0, 0, 0.08)",
              padding: 0,
            }}
          >
            <AdminNavbar
              onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={title}
              mode={mode}
              sidebarCollapsed={sidebarCollapsed}
            />
          </Layout.Header>

          {/* ✨ [Content] */}
          <Layout.Content
            style={{
              padding: "24px",
              overflow: "auto",
            }}
          >
            {/* ✨ [Breadcrumb Navigation] */}
            <AdminBreadcrumb />

            {/* ✨ [Page Content] */}
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
