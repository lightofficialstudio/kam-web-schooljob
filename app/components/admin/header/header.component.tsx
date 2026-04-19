"use client";

/**
 * AdminHeader Component
 *
 * Component กลางสำหรับเป็นส่วนหัว (Header) ของหน้า Admin ต่างๆ
 * รองรับการยืดหยุ่นปรับแต่งสูง (Customizable) ตามมาตรฐาน Frontend-Standard
 *
 * ─── Props ────────────────────────────────────────────────────────────────────
 * @prop title          — ชื่อหน้าหลัก (เช่น "จัดการเมนูและระบบ")
 * @prop description    — คำอธิบายสั้นๆ รองรับข้อความหรือ ReactNode
 * @prop icon           — ไอคอนของหน้านั้น (เช่น <Settings size={22} color="#fff" />)
 * @prop gradient       — ปรับโทนสี Gradient ของพื้นหลังไอคอน เช่น `linear-gradient(135deg, #11b6f5 0%, #0d8fd4 100%)`
 * @prop action         — ReactNode สำหรับปุ่ม Action ด้านขวาสุด (optional)
 * @prop disableMotion  — ปิด Animation หรือไม่ Default: false
 * @prop style          — สามารถเพิ่ม custom style ที่คุม container รวม
 *
 * ─── Example ──────────────────────────────────────────────────────────────────
 * <AdminHeader
 *   title="Announcement & Broadcast"
 *   description="ส่ง In-app Notification ถึงผู้ใช้งาน"
 *   icon={<BellOutlined style={{ fontSize: 22, color: "#fff" }} />}
 *   style={{ marginBottom: 24 }}
 * />
 */

import { Flex, Typography, theme } from "antd";
import { motion } from "framer-motion";
import React from "react";

const { Title, Text } = Typography;

export interface AdminHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon: React.ReactNode;
  gradient?: string;
  action?: React.ReactNode;
  disableMotion?: boolean;
  style?: React.CSSProperties;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  description,
  icon,
  gradient,
  action,
  disableMotion = false,
  style,
}) => {
  const { token } = theme.useToken();

  const defaultGradient = `linear-gradient(135deg, ${token.colorPrimary} 0%, #0d8fd4 100%)`;

  const headerContent = (
    <Flex align="center" justify="space-between" style={style}>
      <Flex align="center" gap={12}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: gradient || defaultGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <Title level={4} style={{ margin: 0, color: token.colorText }}>
            {title}
          </Title>
          {description && (
            <Text style={{ color: token.colorTextSecondary, fontSize: 13 }}>
              {description}
            </Text>
          )}
        </div>
      </Flex>
      {action && <div>{action}</div>}
    </Flex>
  );

  if (disableMotion) {
    return <div style={{ width: "100%" }}>{headerContent}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ width: "100%" }}
    >
      {headerContent}
    </motion.div>
  );
};
