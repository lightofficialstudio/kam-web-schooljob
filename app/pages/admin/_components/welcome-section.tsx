"use client";

import { DesktopOutlined } from "@ant-design/icons";
import { Card, Col, Flex, Row, Typography, theme } from "antd";

const { Title, Text } = Typography;

// ✨ [Welcome Section — แสดงหัวข้อหน้า Admin Dashboard]
export function WelcomeSection() {
  const { token } = theme.useToken();

  return (
    <Card
      style={{
        background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryActive} 100%)`,
        border: "none",
        borderRadius: token.borderRadiusLG,
      }}
      styles={{ body: { padding: "20px 24px" } }}
    >
      <Row align="middle" gutter={16}>
        <Col>
          <DesktopOutlined style={{ fontSize: 32, color: "#fff" }} />
        </Col>
        <Col>
          <Flex vertical gap={2}>
            <Title level={4} style={{ color: "#fff", margin: 0 }}>
              แดชบอร์ดแอดมิน KAM School Job Platform
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.80)", fontSize: 14 }}>
              ยินดีต้อนรับ! นี่คือศูนย์ควบคุมระบบของคุณ
            </Text>
          </Flex>
        </Col>
      </Row>
    </Card>
  );
}
