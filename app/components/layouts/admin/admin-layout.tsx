"use client";

import { theme, Layout } from "antd";
import { ReactNode, useState } from "react";
import { AdminBreadcrumb } from "./breadcrumb";
import { AdminNavbar } from "./navbar";
import { AdminSidebar } from "./sidebar";

const { useToken } = theme;

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { token } = useToken();

  return (
    <Layout
      style={{
        minHeight: "100vh",
        fontFamily:
          "'Kanit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: token.colorBgLayout,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        {/* ✨ [Sidebar] */}
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
        />

        {/* ✨ [Main Content Area] */}
        <Layout style={{ background: token.colorBgLayout }}>
          {/* ✨ [Floating Navbar] */}
          <Layout.Header
            style={{
              height: "auto",
              padding: 0,
              lineHeight: "normal",
              background: "transparent",
              position: "sticky",
              top: 0,
              zIndex: 100,
            }}
          >
            <AdminNavbar
              onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={title}
              sidebarCollapsed={sidebarCollapsed}
            />
          </Layout.Header>

          {/* ✨ [Page Content] */}
          <Layout.Content
            style={{
              padding: "24px",
              overflow: "auto",
              background: token.colorBgLayout,
            }}
          >
            {/* ✨ [Breadcrumb Navigation] */}
            <AdminBreadcrumb />

            {/* ✨ [Page Children] */}
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
