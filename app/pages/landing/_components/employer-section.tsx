"use client";

import { useTheme } from "@/app/contexts/theme-context";
import { RocketOutlined } from "@ant-design/icons";
import {
  theme as antTheme,
  Badge,
  Button,
  Col,
  Flex,
  Row,
  Space,
  Typography,
} from "antd";

const { Title, Text, Paragraph } = Typography;

const EMPLOYER_FEATURES = [
  "ประกาศรับสมัครงานได้ไม่จำกัดตำแหน่ง",
  "Dashboard ติดตามสถานะผู้สมัครได้ในที่เดียว",
  "สร้างโปรไฟล์โรงเรียนเพื่อเพิ่มความน่าเชื่อถือ",
  "เข้าถึงผู้สมัครที่ตรงคุณสมบัติได้ง่ายขึ้น",
];

// ส่วนแนะนำโซลูชันสำหรับโรงเรียน/ผู้ว่าจ้าง
export default function EmployerSection() {
  const { mode } = useTheme();
  const { token } = antTheme.useToken();
  const isDark = mode === "dark";

  return (
    <div
      style={{
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
        background: isDark
          ? "linear-gradient(135deg, #0d1b2a 0%, #0a0f1e 100%)"
          : "linear-gradient(135deg, #eef7ff 0%, #f8fbff 60%, #ffffff 100%)",
      }}
    >
      {/* Dot pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: isDark
          ? "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)"
          : "radial-gradient(circle, rgba(17,182,245,0.13) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 60%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 60%, transparent 100%)",
        pointerEvents: "none",
      }} />
      {/* Glow left */}
      <div style={{
        position: "absolute", top: "10%", left: "-12%",
        width: "500px", height: "500px", borderRadius: "50%",
        background: isDark
          ? "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)"
          : "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 65%)",
        filter: "blur(70px)", pointerEvents: "none",
      }} />
      {/* Glow right */}
      <div style={{
        position: "absolute", bottom: "5%", right: "-8%",
        width: "400px", height: "400px", borderRadius: "50%",
        background: isDark
          ? "radial-gradient(circle, rgba(17,182,245,0.12) 0%, transparent 65%)"
          : "radial-gradient(circle, rgba(17,182,245,0.15) 0%, transparent 65%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <Row gutter={[64, 48]} align="middle">
          {/* Left: Content */}
          <Col xs={24} md={12}>
            <Badge status="processing" text={<Text strong>สำหรับโรงเรียน</Text>} />
            <Title style={{ fontSize: "40px", marginTop: "16px", fontWeight: 600 }}>
              พบบุคลากรที่ใช่ <br />
              <span>ได้เร็วกว่าเดิม</span>
            </Title>
            <Paragraph style={{ fontSize: "16px", marginBottom: "32px" }}>
              เราช่วยให้โรงเรียน หาครูและบุคลากรทางการศึกษาได้ง่ายขึ้น
              ด้วยระบบประกาศงานที่ใช้งานง่าย
              พร้อมเครื่องมือคัดกรองผู้สมัครและติดตามสถานะการสมัครในที่เดียว
            </Paragraph>

            <Space orientation="vertical" size={16} style={{ marginBottom: "40px" }}>
              {EMPLOYER_FEATURES.map((feature, i) => (
                <Flex key={i} gap={8} align="center">
                  <RocketOutlined />
                  <Text strong>{feature}</Text>
                </Flex>
              ))}
            </Space>

            <Button
              type="primary"
              size="large"
              style={{ height: "56px", padding: "0 40px", borderRadius: "16px" }}
            >
              เริ่มต้นใช้งานฟรี ประกาศงานได้ทันที!
            </Button>
          </Col>

          {/* Right: Illustration */}
          <Col xs={24} md={12}>
            <div
              style={{
                height: "450px",
                borderRadius: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ width: "100%", maxWidth: "400px", zIndex: 1 }}>
                <img
                  src="/images/flat/undraw_hiring_8szx.svg"
                  alt="Employer Solutions"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              {/* Background Decoration */}
              <div
                style={{
                  position: "absolute",
                  width: "150%",
                  height: "150%",
                  backgroundColor: isDark ? "#1A202C" : "#fff",
                  borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                  top: "10%",
                  left: "10%",
                  zIndex: 0,
                  opacity: isDark ? 0.3 : 0.5,
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
