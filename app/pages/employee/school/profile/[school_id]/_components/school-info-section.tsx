"use client";

import {
  BankOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Typography, theme as antTheme } from "antd";
import type { SchoolProfileDetail } from "../_api/school-profile-api";

const { Text, Paragraph } = Typography;

interface SchoolInfoSectionProps {
  school: SchoolProfileDetail;
}

// ✨ แสดงรายละเอียดเกี่ยวกับโรงเรียน (เกี่ยวกับเรา + ตัวเลขสถิติ)
export const SchoolInfoSection = ({ school }: SchoolInfoSectionProps) => {
  const { token } = antTheme.useToken();

  // foundedYear ใน DB เก็บเป็น พ.ศ. อยู่แล้ว — ไม่ต้องบวก 543
  // ✨ ใช้ token แทน hardcode สีทั้งหมด
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
      value: school.studentCount.toLocaleString(),
    },
    school.teacherCount != null && {
      icon: <TeamOutlined />,
      color: token.colorWarning,
      bg: token.colorWarningBg,
      label: "ครู/บุคลากร",
      value: school.teacherCount.toLocaleString(),
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
      className="rounded-[28px] overflow-hidden border"
      style={{
        backgroundColor: token.colorBgContainer,
        borderColor: token.colorBorderSecondary,
      }}
    >
      {/* ── Header ── */}
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
          style={{ backgroundColor: token.colorPrimaryBg, color: token.colorPrimary }}
        >
          <BankOutlined />
        </div>
        <Text className="font-black text-base tracking-tight" style={{ color: token.colorTextHeading }}>
          เกี่ยวกับสถาบัน
        </Text>
      </div>

      {/* ── Description ── */}
      {school.description && (
        <div className="px-6 pb-4">
          <Paragraph
            className="m-0! text-sm leading-relaxed"
            style={{ color: token.colorTextSecondary }}
            ellipsis={{ rows: 4, expandable: true, symbol: "อ่านเพิ่ม" }}
          >
            {school.description}
          </Paragraph>
        </div>
      )}

      {/* ── Stats Grid ── */}
      {stats.length > 0 && (
        <div
          className="grid gap-px"
          style={{
            gridTemplateColumns: `repeat(${Math.min(stats.length, 2)}, 1fr)`,
            backgroundColor: token.colorBorderSecondary,
            borderTop: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-4"
              style={{ backgroundColor: token.colorBgContainer }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm"
                style={{ backgroundColor: stat.bg, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <Text
                  className="text-[10px] font-bold uppercase tracking-widest leading-none mb-0.5"
                  style={{ color: token.colorTextQuaternary }}
                >
                  {stat.label}
                </Text>
                <Text
                  className="text-sm font-black leading-tight truncate"
                  style={{ color: token.colorTextHeading }}
                >
                  {stat.value}
                </Text>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
