"use client";

import {
  BankOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Flex,
  Row,
  Typography,
  theme as antTheme,
} from "antd";
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
      icon: <CalendarOutlined style={{ fontSize: 24, color: token.colorPrimary }} />,
      label: "ก่อตั้งเมื่อ",
      value: `พ.ศ. ${school.foundedYear + 543}`,
    },
    school.studentCount != null && {
      icon: <UserOutlined style={{ fontSize: 24, color: token.colorSuccess }} />,
      label: "จำนวนนักเรียน",
      value: `${school.studentCount.toLocaleString()} คน`,
    },
    school.teacherCount != null && {
      icon: <TeamOutlined style={{ fontSize: 24, color: token.colorWarning }} />,
      label: "ครู/บุคลากร",
      value: `${school.teacherCount.toLocaleString()} คน`,
    },
    school.schoolType && {
      icon: <BankOutlined style={{ fontSize: 24, color: token.colorInfo }} />,
      label: "ประเภทสถาบัน",
      value: school.schoolType,
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string }[];

  if (!school.description && stats.length === 0) return null;

  return (
    <Card
      style={{
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
      styles={{ body: { padding: 28 } }}
    >
      <Title level={4} style={{ margin: "0 0 16px" }}>
        เกี่ยวกับโรงเรียน
      </Title>

      {school.description && (
        <Paragraph
          style={{
            fontSize: 15,
            lineHeight: 1.75,
            color: token.colorText,
            marginBottom: stats.length > 0 ? 24 : 0,
          }}
        >
          {school.description}
        </Paragraph>
      )}

      {stats.length > 0 && (
        <Row gutter={[16, 16]}>
          {stats.map((stat, i) => (
            <Col xs={12} sm={6} key={i}>
              <Flex
                vertical
                align="center"
                gap={8}
                style={{
                  padding: "20px 12px",
                  background: token.colorBgLayout,
                  borderRadius: token.borderRadius,
                  textAlign: "center",
                }}
              >
                {stat.icon}
                <Text strong style={{ fontSize: 16 }}>{stat.value}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>{stat.label}</Text>
              </Flex>
            </Col>
          ))}
        </Row>
      )}
    </Card>
  );
};
