"use client";

import {
  BankOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Typography, theme as antTheme } from "antd";
import type { SchoolProfileDetail } from "../_api/school-profile-api";

const { Title, Text, Paragraph } = Typography;

interface SchoolInfoSectionProps {
  school: SchoolProfileDetail;
}

// ✨ แสดงรายละเอียดเกี่ยวกับโรงเรียน (เกี่ยวกับเรา + ตัวเลขสถิติ)
export const SchoolInfoSection = ({ school }: SchoolInfoSectionProps) => {
  const { token } = antTheme.useToken();

  const stats = [
    school.foundedYear && {
      icon: (
        <CalendarOutlined style={{ fontSize: 24, color: token.colorPrimary }} />
      ),
      label: "ก่อตั้งเมื่อ",
      value: `พ.ศ. ${school.foundedYear + 543}`,
    },
    school.studentCount != null && {
      icon: (
        <UserOutlined style={{ fontSize: 24, color: token.colorSuccess }} />
      ),
      label: "จำนวนนักเรียน",
      value: `${school.studentCount.toLocaleString()} คน`,
    },
    school.teacherCount != null && {
      icon: (
        <TeamOutlined style={{ fontSize: 24, color: token.colorWarning }} />
      ),
      label: "ครู/บุคลากร",
      value: `${school.teacherCount.toLocaleString()} คน`,
    },
    school.schoolType && {
      icon: <BankOutlined style={{ fontSize: 24, color: token.colorInfo }} />,
      label: "ประเภทสถาบัน",
      value: school.schoolType,
    },
  ].filter(Boolean) as {
    icon: React.ReactNode;
    label: string;
    value: string;
  }[];

  if (!school.description && stats.length === 0) return null;

  return (
    <Card
      className="shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-none! transition-all duration-300"
      style={{
        borderRadius: 32,
        backgroundColor: token.colorBgContainer,
      }}
      styles={{ body: { padding: 32 } }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-blue-50 text-blue-500">
          <BankOutlined className="text-xl" />
        </div>
        <Title
          level={4}
          className="m-0! font-black text-2xl tracking-tight"
          style={{ color: "#0F172A" }}
        >
          เกี่ยวกับสถาบัน
        </Title>
      </div>

      {school.description && (
        <Paragraph className="text-lg leading-loose text-slate-500 font-medium mb-10">
          {school.description}
        </Paragraph>
      )}

      {stats.length > 0 && (
        <Row gutter={[16, 16]}>
          {stats.map((stat, i) => (
            <Col span={24} key={i}>
              <div
                className="p-6 rounded-3xl transition-all hover:translate-y-[-4px] border border-slate-50 dark:border-slate-800"
                style={{
                  background: token.colorBgLayout,
                }}
              >
                <div className="mb-4">{stat.icon}</div>
                <div className="flex flex-col">
                  <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                    {stat.label}
                  </Text>
                  <Text className="text-[#0F172A] dark:text-white text-xl font-black">
                    {stat.value}
                  </Text>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Card>
  );
};
