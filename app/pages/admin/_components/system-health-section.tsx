"use client";

import {
  ApiOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ControlOutlined,
  DatabaseOutlined,
  FileOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { Card, Col, Flex, Progress, Row, Tag, Typography, theme } from "antd";
import { useDashboardStore } from "../_state/dashboard-store";

const { Text } = Typography;

// ✨ [System Health Section — service status + dynamic stats จาก dashboard data]
export function SystemHealthSection() {
  const { token } = theme.useToken();
  const { data } = useDashboardStore();

  const services = [
    {
      icon: <DatabaseOutlined />,
      label: "PostgreSQL Database",
      tagLabel: "Online",
      barColor: token.colorSuccess,
      percent: 100,
      note: "ปกติ",
    },
    {
      icon: <ApiOutlined />,
      label: "Next.js API Server",
      tagLabel: "Running",
      barColor: token.colorInfo,
      percent: 100,
      note: "ใช้งานได้",
    },
    {
      icon: <SafetyOutlined />,
      label: "Supabase Auth",
      tagLabel: "Secure",
      barColor: token.colorWarning,
      percent: 100,
      note: "ปลอดภัย",
    },
    {
      icon: <FileOutlined />,
      label: "Storage",
      tagLabel: "Active",
      barColor: token.colorPrimary,
      percent: 100,
      note: "ใช้งาน",
    },
  ];

  // ✨ ดึงค่าจาก live data แทน hardcode
  const totalUsers = data?.stats.users.total ?? 0;
  const newLast7Days = data?.stats.users.newLast7Days ?? 0;
  const openJobs = data?.stats.jobs.open ?? 0;
  const pendingApps = data?.stats.applications.pending ?? 0;

  const metrics = [
    {
      icon: <ClockCircleOutlined />,
      label: "ผู้ใช้ใหม่ 7 วัน",
      value: newLast7Days.toLocaleString(),
      color: token.colorPrimary,
    },
    {
      icon: <CheckCircleOutlined />,
      label: "ผู้ใช้ทั้งหมด",
      value: totalUsers.toLocaleString(),
      color: token.colorSuccess,
    },
    {
      icon: <DatabaseOutlined />,
      label: "งานเปิดรับ",
      value: openJobs.toLocaleString(),
      color: token.colorWarning,
    },
    {
      icon: <ApiOutlined />,
      label: "รอพิจารณา",
      value: pendingApps.toLocaleString(),
      color: token.colorText,
    },
  ];

  return (
    <Card
      title={
        <Flex align="center" gap={8}>
          <ControlOutlined style={{ color: token.colorPrimary }} />
          <Text strong>System Health</Text>
          <Tag
            color="success"
            style={{ borderRadius: 100, marginLeft: "auto" }}
          >
            All Systems Operational
          </Tag>
        </Flex>
      }
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        height: "100%",
      }}
    >
      <Flex vertical gap={16}>
        <Row gutter={[12, 12]}>
          {metrics.map((m) => (
            <Col xs={12} key={m.label}>
              <Flex
                vertical
                gap={4}
                align="center"
                style={{
                  background: token.colorFillQuaternary,
                  borderRadius: token.borderRadius,
                  padding: "12px 8px",
                }}
              >
                <Text style={{ color: m.color, fontSize: 16 }}>{m.icon}</Text>
                <Text strong style={{ color: m.color, fontSize: 16 }}>
                  {m.value}
                </Text>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {m.label}
                </Text>
              </Flex>
            </Col>
          ))}
        </Row>

        {services.map((svc) => (
          <div key={svc.label}>
            <Flex
              justify="space-between"
              align="center"
              style={{ marginBottom: 6 }}
            >
              <Flex align="center" gap={6}>
                <Text style={{ color: svc.barColor }}>{svc.icon}</Text>
                <Text style={{ fontSize: 13 }}>{svc.label}</Text>
              </Flex>
              <Tag
                color="success"
                icon={<CheckCircleOutlined />}
                style={{ borderRadius: 100 }}
              >
                {svc.tagLabel}
              </Tag>
            </Flex>
            <Progress
              percent={svc.percent}
              strokeColor={svc.barColor}
              railColor={token.colorFillSecondary}
              format={(p) => `${p}% ${svc.note}`}
              size="small"
            />
          </div>
        ))}
      </Flex>
    </Card>
  );
}
