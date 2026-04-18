"use client";

import {
  ArrowLeftOutlined,
  BankOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Flex,
  Row,
  Space,
  Tag,
  Typography,
  theme as antTheme,
} from "antd";
import { useRouter } from "next/navigation";
import type { SchoolProfileDetail } from "../_api/school-profile-api";

const { Title, Text, Link } = Typography;

interface SchoolProfileHeaderProps {
  school: SchoolProfileDetail;
}

export const SchoolProfileHeader = ({ school }: SchoolProfileHeaderProps) => {
  const { token } = antTheme.useToken();
  const router = useRouter();

  const fallbackLogo = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(school.schoolName)}`;

  return (
    <div style={{ position: "relative" }}>
      {/* ── Cover Image ── */}
      <div
        style={{
          height: 240,
          background: school.coverImageUrl
            ? `url(${school.coverImageUrl}) center/cover no-repeat`
            : `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorInfoBgHover} 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── decorative circles ── */}
        <div
          style={{
            position: "absolute", top: -40, right: -40,
            width: 240, height: 240, borderRadius: "50%",
            background: token.colorWhite, opacity: 0.05,
          }}
        />
        <div
          style={{
            position: "absolute", bottom: -60, left: "15%",
            width: 200, height: 200, borderRadius: "50%",
            background: token.colorWhite, opacity: 0.04,
          }}
        />
        {/* ── ปุ่มย้อนกลับ ── */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          style={{
            position: "absolute", top: 20, left: 24,
            background: "rgba(0,0,0,0.35)", border: "none",
            color: token.colorWhite, borderRadius: token.borderRadiusLG,
            backdropFilter: "blur(8px)",
          }}
        >
          กลับ
        </Button>
      </div>

      {/* ── Identity Bar ── */}
      <div
        style={{
          backgroundColor: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          padding: "0 24px 24px",
        }}
      >
        <Row justify="space-between" align="bottom" wrap>
          <Col>
            <Flex gap={24} align="flex-end">
              {/* Logo — ลอยทับ cover */}
              <Avatar
                size={100}
                shape="square"
                src={school.logoUrl ?? fallbackLogo}
                style={{
                  marginTop: -50,
                  border: `4px solid ${token.colorBgContainer}`,
                  borderRadius: token.borderRadiusLG,
                  boxShadow: token.boxShadowSecondary,
                  backgroundColor: token.colorWhite,
                  flexShrink: 0,
                }}
              />
              <Flex vertical gap={6} style={{ paddingBottom: 4 }}>
                <Flex gap={8} align="center" wrap>
                  <Title level={2} style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
                    {school.schoolName}
                  </Title>
                  {school.schoolType && (
                    <Tag color="blue" style={{ borderRadius: 99, margin: 0 }}>
                      {school.schoolType}
                    </Tag>
                  )}
                  {school.affiliation && (
                    <Tag color="cyan" style={{ borderRadius: 99, margin: 0 }}>
                      {school.affiliation}
                    </Tag>
                  )}
                </Flex>
                <Space size={16} wrap>
                  <Space size={4}>
                    <EnvironmentOutlined style={{ color: token.colorPrimary }} />
                    <Text type="secondary">
                      {[school.district, school.province].filter(Boolean).join(", ")}
                    </Text>
                  </Space>
                  {school.phone && (
                    <Space size={4}>
                      <PhoneOutlined style={{ color: token.colorTextDescription }} />
                      <Text type="secondary">{school.phone}</Text>
                    </Space>
                  )}
                  {school.email && (
                    <Space size={4}>
                      <MailOutlined style={{ color: token.colorTextDescription }} />
                      <Text type="secondary">{school.email}</Text>
                    </Space>
                  )}
                  {school.website && (
                    <Space size={4}>
                      <GlobalOutlined style={{ color: token.colorTextDescription }} />
                      <Link href={school.website} target="_blank" rel="noopener noreferrer">
                        {school.website.replace(/^https?:\/\//, "")}
                      </Link>
                    </Space>
                  )}
                </Space>
              </Flex>
            </Flex>
          </Col>

          {/* ── Stats ── */}
          <Col style={{ paddingBottom: 4 }}>
            <Flex gap={32}>
              <Flex vertical align="center">
                <Text strong style={{ fontSize: 28, color: token.colorPrimary, lineHeight: 1.1 }}>
                  {school.openJobCount}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>ตำแหน่งเปิดรับ</Text>
              </Flex>
              {school.studentCount != null && (
                <Flex vertical align="center">
                  <Text strong style={{ fontSize: 28, lineHeight: 1.1 }}>
                    {school.studentCount.toLocaleString()}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>นักเรียน</Text>
                </Flex>
              )}
              {school.teacherCount != null && (
                <Flex vertical align="center">
                  <Text strong style={{ fontSize: 28, lineHeight: 1.1 }}>
                    {school.teacherCount.toLocaleString()}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>ครู/บุคลากร</Text>
                </Flex>
              )}
              {school.totalJobsPosted > 0 && (
                <Flex vertical align="center">
                  <Text strong style={{ fontSize: 28, lineHeight: 1.1 }}>
                    {school.totalJobsPosted}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>ประกาศทั้งหมด</Text>
                </Flex>
              )}
            </Flex>
          </Col>
        </Row>
      </div>
    </div>
  );
};
