"use client";

import { Breadcrumb } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface BreadcrumbItem {
  title: React.ReactNode;
  href?: string;
}

/**
 * 🍞 Admin Breadcrumb Navigation
 * Displays breadcrumb navigation for admin pages
 */
export function AdminBreadcrumb() {
  const pathname = usePathname();

  // ✨ [Define breadcrumbs for each route]
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      {
        title: "แดชบอร์ด",
        href: "/pages/admin",
      },
    ];

    if (pathname.includes("/user-management")) {
      breadcrumbs.push({
        title: "จัดการผู้ใช้",
        href: "/pages/admin/user-management",
      });
    } else if (pathname.includes("/jobs")) {
      breadcrumbs.push({
        title: "จัดการงาน",
        href: "/pages/admin/jobs",
      });
    } else if (pathname.includes("/settings")) {
      breadcrumbs.push({
        title: "การตั้งค่า",
        href: "/pages/admin/settings",
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // ✨ [Render breadcrumb items]
  const items = breadcrumbs.map((item, index) => {
    const isLast = index === breadcrumbs.length - 1;

    return {
      title: isLast ? (
        <span style={{ fontWeight: 600 }}>{item.title}</span>
      ) : (
        <Link href={item.href || "#"} style={{ color: "#1890ff" }}>
          {item.title}
        </Link>
      ),
    };
  });

  return (
    <Breadcrumb
      items={items}
      style={{
        paddingBottom: "16px",
        marginBottom: "16px",
        borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
      }}
    />
  );
}
