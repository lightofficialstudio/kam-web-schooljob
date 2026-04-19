"use client";

import { Layout, theme } from "antd";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminBreadcrumb } from "@/app/components/admin/header/breadcrumb.component";
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
  const pathname = usePathname();

  // ✨ [Determine breadcrumb items based on path - fallback for generic pages]
  const getBreadcrumbItems = () => {
    const items = [{ title: "แดชบอร์ด", path: "/pages/admin/dashboard" }];
    const path = pathname || "";

    if (path.includes("/user-management")) {
      items.push({ title: "จัดการผู้ใช้" });
    } else if (path.includes("/package-management")) {
      items.push({ title: "แพ็กเกจสมาชิก" });
    } else if (path.includes("/menu-management")) {
      items.push({ title: "จัดการเมนู" });
    } else if (path.includes("/announcement")) {
      items.push({ title: "จัดการข่าวสาร" });
    }

    return items;
  };

  // Note: We show layout breadcrumb only if the pathname is not one of the pages that 
  // handle their own breadcrumbs (1-2-3-4 layout rule). 
  // However, following user instruction to "use" it here.
  const breadcrumbItems = getBreadcrumbItems();

  return (
    <Layout
      style={{ minHeight: "100vh", background: token.colorBgLayout }}
      hasSider
    >
      {/* ✨ [Floating Sidebar] */}
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
          {/* ✨ [Breadcrumb Navigation - Fallback] */}
          {/* Note: If the page already has its own breadcrumb (1-2-3-4 layout), this may be redundant */}
          {!["/dashboard", "/user-management", "/package-management"].some(p => pathname?.includes(p)) && (
             <AdminBreadcrumb items={breadcrumbItems} />
          )}

          {/* ✨ [Page Children] */}
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
