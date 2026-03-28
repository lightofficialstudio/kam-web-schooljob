"use client";

import {
  BookOutlined,
  CheckCircleFilled,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Col, Flex, Space, Typography } from "antd";

const { Title, Text } = Typography;

const FEATURES = [
  { icon: <TeamOutlined />, text: "ระบบจับคู่ตามวิชาเอกที่แม่นยำ" },
  { icon: <BookOutlined />, text: "สมัครงานง่ายในไม่กี่ขั้นตอน" },
  { icon: <TrophyOutlined />, text: "ลงประกาศงานฟรีสำหรับโรงเรียน" },
];

// แผงด้านซ้าย — Gradient branding พร้อมจุดเด่นของแพลตฟอร์ม
export const BrandingPanel = () => {
  return (
    <Col
      xs={0}
      md={9}
      style={{
        background: "linear-gradient(160deg, #11b6f5 0%, #0a85b8 100%)",
        padding: "48px 36px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* วงกลมประดับ */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }}
      />

      <Flex vertical justify="space-between" style={{ height: "100%", position: "relative", zIndex: 1 }} gap={40}>
        {/* Logo + Headline */}
        <Flex vertical gap={20}>
          <Flex
            align="center"
            justify="center"
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <Title level={3} style={{ margin: 0, color: "#fff" }}>
              S
            </Title>
          </Flex>

          <Flex vertical gap={8}>
            <Title level={2} style={{ margin: 0, color: "#fff", lineHeight: 1.3 }}>
              ก้าวสู่ <br /> อนาคตใหม่
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, lineHeight: 1.6 }}>
              แพลตฟอร์มที่เชื่อมต่อครูคุณภาพ <br />
              กับสถานศึกษาชั้นนำทั่วประเทศ
            </Text>
          </Flex>
        </Flex>

        {/* Features */}
        <Flex vertical gap={16}>
          {FEATURES.map((item, i) => (
            <Space key={i} size={12} align="start">
              <CheckCircleFilled style={{ fontSize: 18, color: "rgba(255,255,255,0.9)", marginTop: 2 }} />
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 15 }}>
                {item.text}
              </Text>
            </Space>
          ))}
        </Flex>

        {/* Footer */}
        <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
          © 2025 School Job Board
        </Text>
      </Flex>
    </Col>
  );
};
