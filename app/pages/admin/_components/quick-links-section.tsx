"use client";

import {
  ApiOutlined,
  BellOutlined,
  BookOutlined,
  RocketOutlined,
  SettingOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Card, Col, Flex, Row, Typography, theme } from "antd";
import Link from "next/link";

const { Text } = Typography;

const links = [
  {
    key: "users",
    icon: <TeamOutlined />,
    label: "จัดการผู้ใช้",
    href: "/pages/admin/user-management",
    colorKey: "colorPrimary" as const,
  },
  {
    key: "jobs",
    icon: <BookOutlined />,
    label: "จัดการงาน",
    href: "/pages/job",
    colorKey: "colorSuccess" as const,
  },
  {
    key: "api",
    icon: <ApiOutlined />,
    label: "API Docs",
    href: "/api/v1/authenticate/docs",
    colorKey: "colorInfo" as const,
  },
  {
    key: "packages",
    icon: <SettingOutlined />,
    label: "จัดการแพ็กเกจ",
    href: "/pages/admin/package-management",
    colorKey: "colorWarning" as const,
  },
  {
    key: "blog",
    icon: <RocketOutlined />,
    label: "จัดการบล็อก",
    href: "/pages/admin/blog",
    colorKey: "colorError" as const,
  },
  {
    key: "jobs-mgmt",
    icon: <ThunderboltOutlined />,
    label: "จัดการประกาศงาน",
    href: "/pages/admin/job-management/read",
    colorKey: "colorPrimary" as const,
  },
  {
    key: "announcement",
    icon: <BellOutlined />,
    label: "Announcement",
    href: "/pages/admin/announcement",
    colorKey: "colorInfo" as const,
  },
];

// ✨ [Quick Links Section]
export function QuickLinksSection() {
  const { token } = theme.useToken();

  return (
    <Card
      title={
        <Flex align="center" gap={8}>
          <RocketOutlined style={{ color: token.colorPrimary }} />
          <Text strong>Quick Links</Text>
        </Flex>
      }
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        height: "100%",
      }}
    >
      <Row gutter={[10, 10]}>
        {links.map((lnk) => {
          const color =
            ((token as Record<string, unknown>)[lnk.colorKey] as string) ??
            token.colorPrimary;
          return (
            <Col xs={12} key={lnk.key}>
              <Link href={lnk.href} style={{ textDecoration: "none" }}>
                <Flex
                  align="center"
                  gap={8}
                  style={{
                    background: token.colorFillQuaternary,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: token.borderRadius,
                    padding: "10px 12px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      color;
                    (e.currentTarget as HTMLDivElement).style.background =
                      token.colorFillSecondary;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      token.colorBorderSecondary;
                    (e.currentTarget as HTMLDivElement).style.background =
                      token.colorFillQuaternary;
                  }}
                >
                  <span style={{ color, fontSize: 16 }}>{lnk.icon}</span>
                  <Text style={{ fontSize: 13 }}>{lnk.label}</Text>
                </Flex>
              </Link>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
}
