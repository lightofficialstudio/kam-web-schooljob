"use client";

/**
 * AdminBreadcrumb Component
 *
 * Component กลางสำหรับเป็นส่วนนำทาง (Navigational Aid) ของหน้าเพจในส่วน Admin
 * ช่วยบอกตำแหน่งของผู้ใช้งานปัจจุบัน (Breadcrumb) รองรับการปรับแต่งที่ยืดหยุ่น
 * และเป็นมาตรฐานสำหรับนำไปใช้งานกับทุกหน้า
 *
 * ─── Props ────────────────────────────────────────────────────────────────────
 * @prop items    — Array ของ Breadcrumb item: [{ title: React.ReactNode, path?: string }, ...]
 * @prop style    — Custom style สำหรับปรับแต่งเพิ่มถ้าจำเป็น
 *
 * ─── Example ──────────────────────────────────────────────────────────────────
 * <AdminBreadcrumb
 *   items={[
 *     { title: "แดชบอร์ด", path: "/pages/admin/dashboard" },
 *     { title: "จัดการเกี่ยวกับระบบ" }
 *   ]}
 * />
 */

import { Breadcrumb, theme } from "antd";
import Link from "next/link";
import React from "react";

export interface AdminBreadcrumbItem {
  title: React.ReactNode;
  path?: string;
}

export interface AdminBreadcrumbProps {
  items: AdminBreadcrumbItem[];
  style?: React.CSSProperties;
}

export const AdminBreadcrumb: React.FC<AdminBreadcrumbProps> = ({
  items,
  style,
}) => {
  const { token } = theme.useToken();

  const breadcrumbItems = items.map((item, index) => {
    const isLast = index === items.length - 1;
    const contentColor = isLast ? token.colorText : token.colorTextSecondary;
    
    const content = (
      <span style={{ color: contentColor, fontWeight: isLast ? 600 : 400 }}>
        {item.title}
      </span>
    );

    return {
      title: item.path && !isLast ? (
        <Link
          href={item.path}
          style={{
            color: token.colorTextSecondary,
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = token.colorPrimary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = token.colorTextSecondary;
          }}
        >
          {content}
        </Link>
      ) : (
        content
      ),
    };
  });

  return (
    <div style={{ marginBottom: 16, padding: "0 4px", ...style }}>
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
};
