"use client";

// ✨ Branding Panel — ฝั่งซ้าย Minimal + Animated orbs + icon-based features
// ✨ keyframes (floatOrb, fadeSlideUp) อยู่ใน globals.css
import {
  BankOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Col, Flex, Typography } from "antd";

const { Text } = Typography;

// ✨ floating orb helper
const orb = (
  size: number,
  top: string,
  left: string,
  delay: string,
  opacity: number,
): React.CSSProperties => ({
  position: "absolute",
  width: size,
  height: size,
  borderRadius: "50%",
  background: "rgba(255,255,255,0.12)",
  top,
  left,
  animation: "floatOrb 6s ease-in-out infinite",
  animationDelay: delay,
  opacity,
  pointerEvents: "none",
});

// ✨ Feature items — icon-based เท่านั้น ไม่มี hardcode ตัวเลข
const FEATURES = [
  {
    icon: (
      <SearchOutlined
        style={{ fontSize: 14, color: "rgba(255,255,255,0.9)" }}
      />
    ),
    text: "ค้นหางานตามวิชาเอกและพื้นที่",
  },
  {
    icon: (
      <BankOutlined style={{ fontSize: 14, color: "rgba(255,255,255,0.9)" }} />
    ),
    text: "สถานศึกษาคุณภาพทั่วประเทศ",
  },
  {
    icon: (
      <UserOutlined style={{ fontSize: 14, color: "rgba(255,255,255,0.9)" }} />
    ),
    text: "โปรไฟล์ครูพร้อมระบบสมัครงานในที่เดียว",
  },
  {
    icon: (
      <CheckCircleOutlined
        style={{ fontSize: 14, color: "rgba(255,255,255,0.9)" }}
      />
    ),
    text: "ติดตามสถานะใบสมัครแบบ real-time",
  },
];

export const SigninBrandingPanel = () => {
  return (
    <Col
      xs={0}
      md={10}
      style={{
        background:
          "linear-gradient(150deg, #0a85c2 0%, #11b6f5 60%, #38c5f7 100%)",
        padding: "52px 40px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* ✨ keyframes อยู่ใน globals.css แล้ว */}

      {/* ✨ Orbs */}
      <div style={orb(220, "-80px", "-80px", "0s", 0.5)} />
      <div style={orb(140, "55%", "-50px", "1.5s", 0.3)} />
      <div style={orb(90, "75%", "70%", "3s", 0.25)} />
      <div style={orb(60, "15%", "72%", "2s", 0.2)} />

      {/* ✨ Top: Logo + Headline */}
      <Flex
        vertical
        gap={28}
        style={{
          position: "relative",
          zIndex: 1,
        }}
        className="signin-branding-top"
      >
        {/* Logo mark */}
        <Flex align="center" gap={10}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(255,255,255,0.22)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text strong style={{ color: "#fff", fontSize: 16, lineHeight: 1 }}>
              S
            </Text>
          </div>
          <Text
            style={{
              color: "rgba(255,255,255,0.92)",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "1.5px",
            }}
          >
            SCHOOL BOARD
          </Text>
        </Flex>

        {/* Headline */}
        <Flex vertical gap={10}>
          <Text
            style={{
              color: "#fff",
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1.25,
              display: "block",
            }}
          >
            ยินดีต้อนรับ
            <br />
            กลับมา
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: 14,
              lineHeight: 1.7,
              display: "block",
            }}
          >
            แพลตฟอร์มเชื่อมครูคุณภาพ
            <br />
            กับสถานศึกษาทั่วประเทศ
          </Text>
        </Flex>
      </Flex>

      {/* ✨ Bottom: Feature list + footer — animation class จาก globals.css */}
      <Flex
        vertical
        gap={20}
        style={{
          position: "relative",
          zIndex: 1,
        }}
        className="signin-branding-bottom"
      >
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.18)",
            borderRadius: 1,
          }}
        />

        {/* ✨ Icon-based feature list */}
        <Flex vertical gap={12}>
          {FEATURES.map((f) => (
            <Flex key={f.text} align="center" gap={10}>
              <Flex
                align="center"
                justify="center"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.15)",
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </Flex>
              <Text
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 13,
                  lineHeight: 1.4,
                }}
              >
                {f.text}
              </Text>
            </Flex>
          ))}
        </Flex>

        <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
          © {new Date().getFullYear()} School Board · All rights reserved
        </Text>
      </Flex>
    </Col>
  );
};
