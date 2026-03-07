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
                background:
                  mode === "dark"
                    ? "linear-gradient(90deg, #001529 0%, #003d82 100%)"
                    : "linear-gradient(90deg, #fafafa 0%, #f0f0f0 100%)",
                boxShadow:
                  mode === "dark"
                    ? "0 2px 8px rgba(0, 0, 0, 0.15)"
                    : "0 2px 8px rgba(0, 0, 0, 0.08)",
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
          {/* ✨ [Navbar with Theme Styling] */}
          <Layout.Header
            style={{
              background:
                mode === "dark"
                  ? "linear-gradient(90deg, #001529 0%, #003d82 100%)"
                  : "linear-gradient(90deg, #fafafa 0%, #f0f0f0 100%)",
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
            />
          </Layout.Header>

          {/* ✨ [Content] */}
          <Layout.Content
            style={{
              padding: "24px",
              overflow: "auto",
              background: mode === "dark" ? "#141414" : "#f5f5f5",
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
