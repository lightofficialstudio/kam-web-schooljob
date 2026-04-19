"use client";

import {
  BankOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Flex, Typography, theme as antTheme } from "antd";
import type { SchoolProfileDetail } from "../_api/school-profile-api";

const { Text, Paragraph, Title } = Typography;

interface SchoolInfoSectionProps {
  school: SchoolProfileDetail;
}

// ✨ แสดงรายละเอียดเกี่ยวกับโรงเรียน — เกี่ยวกับเรา + สถิติ
export const SchoolInfoSection = ({ school }: SchoolInfoSectionProps) => {
  const { token } = antTheme.useToken();

  // ✨ foundedYear ใน DB เก็บเป็น พ.ศ. อยู่แล้ว — ไม่ต้องบวก 543
  const stats = [
    school.foundedYear && {
      icon: <CalendarOutlined />,
      color: token.colorPrimary,
      bg: token.colorPrimaryBg,
      label: "ก่อตั้งเมื่อ",
      value: `พ.ศ. ${school.foundedYear}`,
    },
    school.studentCount != null && {
      icon: <UserOutlined />,
      color: token.colorSuccess,
      bg: token.colorSuccessBg,
      label: "นักเรียน",
      value: `${school.studentCount.toLocaleString()} คน`,
    },
    school.teacherCount != null && {
      icon: <TeamOutlined />,
      color: token.colorWarning,
      bg: token.colorWarningBg,
      label: "ครู/บุคลากร",
      value: `${school.teacherCount.toLocaleString()} คน`,
    },
    school.schoolType && {
      icon: <BankOutlined />,
      color: token.colorInfo,
      bg: token.colorInfoBg,
      label: "ประเภท",
      value: school.schoolType,
    },
  ].filter(Boolean) as {
    icon: React.ReactNode;
    color: string;
    bg: string;
    label: string;
    value: string;
  }[];

  if (!school.description && stats.length === 0) return null;

  return (
    <div
      style={{
        borderRadius: 20,
        border: `1px solid ${token.colorBorderSecondary}`,
        backgroundColor: token.colorBgContainer,
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: "20px 24px 16px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          background: `linear-gradient(135deg, rgba(17,182,245,0.04) 0%, transparent 100%)`,
        }}
      >
        <Flex align="center" gap={10}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: `linear-gradient(135deg, rgba(17,182,245,0.15) 0%, rgba(17,182,245,0.05) 100%)`,
              border: `1px solid rgba(17,182,245,0.2)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: token.colorPrimary,
              fontSize: 16,
            }}
          >
            <BankOutlined />
          </div>
          <Title level={5} style={{ margin: 0, fontSize: 15, fontWeight: 800, color: token.colorTextHeading }}>
            เกี่ยวกับสถาบัน
          </Title>
        </Flex>
      </div>

      {/* ── Description ── */}
      {school.description && (
        <div style={{ padding: "16px 24px", borderBottom: stats.length > 0 ? `1px solid ${token.colorBorderSecondary}` : "none" }}>
          <Paragraph
            style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: token.colorTextSecondary }}
            ellipsis={{ rows: 4, expandable: true, symbol: "อ่านเพิ่มเติม" }}
          >
            {school.description}
          </Paragraph>
        </div>
      )}

      {/* ── Stats Grid ── */}
      {stats.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(stats.length, 2)}, 1fr)`,
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                padding: "16px 20px",
                borderRight: i % 2 === 0 && i < stats.length - 1 ? `1px solid ${token.colorBorderSecondary}` : "none",
                borderBottom: i < stats.length - 2 ? `1px solid ${token.colorBorderSecondary}` : "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = `rgba(17,182,245,0.03)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
              }}
            >
              <Flex align="center" gap={12}>
                {/* ✨ Icon badge */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: stat.bg,
                    color: stat.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    flexShrink: 0,
                  }}
                >
                  {stat.icon}
                </div>
                <Flex vertical gap={1} style={{ minWidth: 0 }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: token.colorTextQuaternary,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      lineHeight: 1,
                    }}
                  >
                    {stat.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: token.colorTextHeading,
                      lineHeight: 1.3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {stat.value}
                  </Text>
                </Flex>
              </Flex>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
