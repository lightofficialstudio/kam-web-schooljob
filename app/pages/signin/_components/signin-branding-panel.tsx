"use client";

import {
  BankOutlined,
  BookOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Flex, Space, Typography } from "antd";

const { Title, Text } = Typography;

const PERSONAS = [
  {
    icon: <UserOutlined style={{ fontSize: 22, color: "#11b6f5" }} />,
    role: "ครูผู้สอน",
    desc: "ค้นหางานตามวิชาเอก สมัครง่าย ติดตามสถานะได้ทันที",
    feature: <SearchOutlined style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }} />,
    bg: "rgba(255,255,255,0.12)",
  },
  {
    icon: <BankOutlined style={{ fontSize: 22, color: "#11b6f5" }} />,
    role: "สถานศึกษา",
    desc: "ลงประกาศรับสมัครครูฟรี พร้อมระบบคัดกรองอัตโนมัติ",
    feature: <BookOutlined style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }} />,
    bg: "rgba(255,255,255,0.08)",
  },
];


// แผงด้านซ้าย — แสดง persona และสถิติแพลตฟอร์ม
export const SigninBrandingPanel = () => {
  return (
    <Col
      xs={0}
      md={10}
      style={{
        background: "linear-gradient(160deg, #11b6f5 0%, #0878a8 100%)",
        padding: "48px 36px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* วงกลมประดับ */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
      <div style={{ position: "absolute", bottom: 60, left: -60, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

      <Flex vertical justify="space-between" style={{ height: "100%", position: "relative", zIndex: 1 }} gap={36}>

        {/* Logo + Headline */}
        <Flex vertical gap={20}>
          <Flex align="center" gap={10}>
            <Flex align="center" justify="center" style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}>
              <Text strong style={{ fontSize: 18, color: "#fff" }}>S</Text>
            </Flex>
            <Text strong style={{ fontSize: 15, color: "rgba(255,255,255,0.9)", letterSpacing: 1 }}>
              SCHOOL BOARD
            </Text>
          </Flex>

          <Flex vertical gap={8}>
            <Title level={2} style={{ margin: 0, color: "#fff", lineHeight: 1.3 }}>
              ยินดีต้อนรับ <br /> กลับมา!
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.7 }}>
              แพลตฟอร์มที่เชื่อมต่อครูคุณภาพ <br />
              กับสถานศึกษาชั้นนำทั่วประเทศ
            </Text>
          </Flex>
        </Flex>

        {/* Persona Cards */}
        <Flex vertical gap={12}>
          <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>
            สำหรับ
          </Text>
          {PERSONAS.map((p) => (
            <Card
              key={p.role}
              variant="borderless"
              style={{
                background: p.bg,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
              }}
              styles={{ body: { padding: "14px 16px" } }}
            >
              <Space size={12} align="start">
                <Flex align="center" justify="center" style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.9)", flexShrink: 0 }}>
                  {p.icon}
                </Flex>
                <Flex vertical gap={2}>
                  <Text strong style={{ color: "#fff", fontSize: 14 }}>{p.role}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, lineHeight: 1.5 }}>{p.desc}</Text>
                </Flex>
              </Space>
            </Card>
          ))}
        </Flex>

        {/* Footer */}
        <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
          © 2025 School Board
        </Text>
      </Flex>
    </Col>
  );
};
