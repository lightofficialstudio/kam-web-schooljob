"use client";

// ✨ Branding Panel — ฝั่งซ้าย Minimal + Animated dots
import { Col, Flex, Typography } from "antd";

const { Text } = Typography;

// ✨ floating orb style
const orb = (size: number, top: string, left: string, delay: string, opacity: number): React.CSSProperties => ({
  position: "absolute",
  width: size,
  height: size,
  borderRadius: "50%",
  background: "rgba(255,255,255,0.12)",
  top,
  left,
  animation: `floatOrb 6s ease-in-out infinite`,
  animationDelay: delay,
  opacity,
  pointerEvents: "none",
});

const STATS = [
  { value: "2,400+", label: "ครูที่ลงทะเบียน" },
  { value: "380+", label: "โรงเรียนพันธมิตร" },
  { value: "94%", label: "อัตราการจับคู่สำเร็จ" },
];

export const SigninBrandingPanel = () => {
  return (
    <Col
      xs={0}
      md={10}
      style={{
        background: "linear-gradient(150deg, #0a85c2 0%, #11b6f5 60%, #38c5f7 100%)",
        padding: "52px 40px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* ✨ keyframe inject */}
      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-14px) scale(1.04); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>

      {/* ✨ Orbs */}
      <div style={orb(220, "-80px", "-80px", "0s", 0.5)} />
      <div style={orb(140, "55%", "-50px", "1.5s", 0.3)} />
      <div style={orb(90, "75%", "70%", "3s", 0.25)} />
      <div style={orb(60, "15%", "72%", "2s", 0.2)} />

      {/* ✨ Top: Logo + Tagline */}
      <Flex vertical gap={28} style={{ position: "relative", zIndex: 1, animation: "fadeSlideUp 0.7s ease both" }}>
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
            <Text strong style={{ color: "#fff", fontSize: 16, lineHeight: 1 }}>S</Text>
          </div>
          <Text style={{ color: "rgba(255,255,255,0.92)", fontWeight: 700, fontSize: 13, letterSpacing: "1.5px" }}>
            SCHOOLJOB
          </Text>
        </Flex>

        {/* Headline */}
        <Flex vertical gap={10}>
          <Text style={{ color: "#fff", fontSize: 28, fontWeight: 800, lineHeight: 1.25, display: "block" }}>
            ยินดีต้อนรับ<br />กลับมา 👋
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.72)", fontSize: 14, lineHeight: 1.7, display: "block" }}>
            แพลตฟอร์มเชื่อมครูคุณภาพ<br />กับสถานศึกษาทั่วประเทศ
          </Text>
        </Flex>
      </Flex>

      {/* ✨ Bottom: Stats row */}
      <Flex
        vertical
        gap={20}
        style={{
          position: "relative",
          zIndex: 1,
          animation: "fadeSlideUp 0.7s ease 0.2s both",
        }}
      >
        {/* Divider line */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.18)", borderRadius: 1 }} />

        <Flex justify="space-between">
          {STATS.map((s) => (
            <Flex vertical gap={2} key={s.label} align="center">
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: 800, display: "block", lineHeight: 1 }}>
                {s.value}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, display: "block", textAlign: "center" }}>
                {s.label}
              </Text>
            </Flex>
          ))}
        </Flex>

        <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
          © 2025 School Board · All rights reserved
        </Text>
      </Flex>
    </Col>
  );
};
