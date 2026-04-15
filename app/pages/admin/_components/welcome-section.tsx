"use client";

import {
  ArrowUpOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Card,
  Col,
  Flex,
  Row,
  Statistic,
  Typography,
  theme,
} from "antd";

const { Title, Text } = Typography;

// ✨ [Welcome Section — Enterprise header พร้อม live KPI inline]
export function WelcomeSection() {
  const { token } = theme.useToken();

  const now = new Date();
  const timeStr = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = now.toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card
      style={{
        background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryActive} 100%)`,
        border: "none",
        borderRadius: token.borderRadiusLG,
        overflow: "hidden",
      }}
      styles={{ body: { padding: "28px 32px" } }}
    >
      <Row justify="space-between" align="middle" gutter={[24, 16]}>
        <Col xs={24} md={14}>
          <Flex vertical gap={6}>
            <Flex align="center" gap={8}>
              <Badge status="processing" color="#4ade80" />
              <Text
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 12,
                  letterSpacing: "0.5px",
                }}
              >
                SYSTEM ONLINE
              </Text>
            </Flex>
            <Title
              level={2}
              style={{ color: "#fff", margin: 0, fontWeight: 700 }}
            >
              KAM School Job Platform
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.70)", fontSize: 14 }}>
              <ClockCircleOutlined style={{ marginRight: 6 }} />
              {dateStr} · {timeStr} น.
            </Text>
          </Flex>
        </Col>

        <Col xs={24} md={10}>
          <Row gutter={[16, 8]}>
            {[
              {
                title: "Users Today",
                value: 2,
                icon: <TeamOutlined />,
                suffix: "คน",
              },
              {
                title: "Response",
                value: 145,
                icon: <ThunderboltOutlined />,
                suffix: "ms",
              },
              {
                title: "Uptime",
                value: 99.9,
                icon: <ArrowUpOutlined />,
                suffix: "%",
              },
            ].map((item) => (
              <Col xs={8} key={item.title}>
                <Flex vertical align="center" gap={4}>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.60)",
                      fontSize: 11,
                      textAlign: "center",
                    }}
                  >
                    {item.title}
                  </Text>
                  <Statistic
                    value={item.value}
                    suffix={item.suffix}
                    prefix={<span style={{ fontSize: 13 }}>{item.icon}</span>}
                    styles={{
                      content: { color: "#fff", fontSize: 18, fontWeight: 700 },
                      suffix: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
                    }}
                  />
                </Flex>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Card>
  );
}
