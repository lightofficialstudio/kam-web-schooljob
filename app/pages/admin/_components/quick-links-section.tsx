"use client";

import {
  FileOutlined,
  LineChartOutlined,
  ProjectOutlined,
  SafetyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Card, Col, Flex, Row, Space, Typography, theme } from "antd";
import Link from "next/link";

const { Text } = Typography;

// ✨ [type สำหรับ quick link card]
interface QuickLink {
  label: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  href: string;
}

// ✨ [Quick Links Section — shortcut cards ไปยังส่วนต่างๆ]
export function QuickLinksSection() {
  const { token } = theme.useToken();

  const links: QuickLink[] = [
    {
      label: "จัดการผู้ใช้",
      description: "ดูและจัดการผู้ใช้ทั้งหมด",
      icon: <TeamOutlined style={{ fontSize: 24 }} />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      href: "/pages/admin/user-management",
    },
    {
      label: "ดูรายงาน",
      description: "การวิเคราะห์ระบบ",
      icon: <LineChartOutlined style={{ fontSize: 24 }} />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      href: "/pages/admin/reports",
    },
    {
      label: "ความปลอดภัย",
      description: "ตั้งค่าความปลอดภัย",
      icon: <SafetyOutlined style={{ fontSize: 24 }} />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      href: "/pages/admin/security",
    },
    {
      label: "ตั้งค่าระบบ",
      description: "จัดการการตั้งค่า",
      icon: <FileOutlined style={{ fontSize: 24 }} />,
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      href: "/pages/admin/settings",
    },
  ];

  return (
    <Card
      title={
        <Space>
          <ProjectOutlined />
          <Text strong>การจัดการด่วน</Text>
        </Space>
      }
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Row gutter={[16, 16]}>
        {links.map((link) => (
          <Col xs={24} sm={12} lg={6} key={link.label}>
            <Link href={link.href} style={{ display: "block" }}>
              <Card
                hoverable
                style={{
                  background: link.gradient,
                  border: "none",
                  borderRadius: token.borderRadius,
                }}
                styles={{ body: { padding: "16px" } }}
              >
                <Flex align="center" gap={12}>
                  <span style={{ color: "#fff" }}>{link.icon}</span>
                  <Flex vertical gap={2}>
                    <Text strong style={{ color: "#fff", fontSize: 14 }}>
                      {link.label}
                    </Text>
                    <Text
                      style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}
                    >
                      {link.description}
                    </Text>
                  </Flex>
                </Flex>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
