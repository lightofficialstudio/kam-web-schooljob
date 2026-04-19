"use client";

// ✨ Section Header — Divider มีชื่อ Section + subtitle สำหรับแบ่งกลุ่ม Dashboard
import { Flex, Typography, theme } from "antd";
import type { ReactNode } from "react";

const { Text } = Typography;

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  /** สีของ icon background tint — default ใช้ colorPrimary */
  color?: string;
}

export function SectionHeader({ icon, title, subtitle, color }: SectionHeaderProps) {
  const { token } = theme.useToken();
  const c = color ?? token.colorPrimary;

  return (
    <Flex align="center" gap={12} style={{ paddingBottom: 4 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${c}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 17,
          color: c,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <Text strong style={{ fontSize: 15, color: token.colorText }}>
          {title}
        </Text>
        {subtitle && (
          <>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {subtitle}
            </Text>
          </>
        )}
      </div>
      {/* ✨ เส้น divider ยาวขวา */}
      <div
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(90deg, ${c}30 0%, transparent 100%)`,
          borderRadius: 1,
        }}
      />
    </Flex>
  );
}
