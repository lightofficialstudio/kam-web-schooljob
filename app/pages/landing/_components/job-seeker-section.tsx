"use client";

import { useTheme } from "@/app/contexts/theme-context";
import {
  GlobalOutlined,
  RocketOutlined,
  SearchOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import {
  theme as antTheme,
  Button,
  Card,
  Col,
  Row,
  Space,
  Typography,
} from "antd";
import type { ReactNode } from "react";

const { Title, Text, Paragraph } = Typography;

interface FeatureItem {
  title: string;
  desc: string;
  icon: ReactNode;
  color: string;
}

const FEATURES: FeatureItem[] = [
  {
    title: "ฝากประวัติฟรี",
    desc: "สร้างโปรไฟล์เพื่อให้โรงเรียนค้นพบคุณ",
    icon: <SolutionOutlined />,
    color: "#11b6f5",
  },
  {
    title: "สมัครง่ายในไม่กี่ขั้นตอน",
    desc: "ลงทะเบียนและเริ่มสมัครงานได้ทันที",
    icon: <RocketOutlined />,
    color: "#52c41a",
  },
  {
    title: "ค้นพบตำแหน่งงานมากมาย",
    desc: "รวมงานจากโรงเรียนทั่วประเทศ",
    icon: <SearchOutlined />,
    color: "#fadb14",
  },
  {
    title: "เพิ่มโอกาสได้งานที่ใช่",
    desc: "โรงเรียนค้นพบโปรไฟล์ของคุณได้ง่ายขึ้น",
    icon: <GlobalOutlined />,
    color: "#ff4d4f",
  },
];

// ส่วนแสดงสิทธิประโยชน์สำหรับผู้หางาน
export default function JobSeekerSection() {
  const { mode } = useTheme();
  const { token } = antTheme.useToken();
  const isDark = mode === "dark";

  return (
    <div
      style={{
        padding: "80px 24px",
        position: "relative",
        overflow: "hidden",
        background: isDark ? "#070d1a" : "#f4f9ff",
      }}
    >
      {/* Diagonal stripe pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: isDark
          ? "repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 40px)"
          : "repeating-linear-gradient(45deg, rgba(17,182,245,0.05) 0px, rgba(17,182,245,0.05) 1px, transparent 1px, transparent 40px)",
        pointerEvents: "none",
      }} />
      {/* Center glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "800px", height: "400px", borderRadius: "50%",
        background: isDark
          ? "radial-gradient(ellipse, rgba(17,182,245,0.08) 0%, transparent 70%)"
          : "radial-gradient(ellipse, rgba(17,182,245,0.12) 0%, transparent 70%)",
        filter: "blur(50px)", pointerEvents: "none",
      }} />

      <div
        style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}
      >
        <Title level={2}>สิทธิประโยชน์สำหรับผู้หางาน</Title>
        <Paragraph style={{ marginBottom: "48px" }}>
          ฝากประวัติไว้กับเรา โอกาสได้งานใหม่ในโรงเรียนฝันอยู่ไม่ไกล
        </Paragraph>

        <Row gutter={[24, 24]}>
          {FEATURES.map((item, i) => (
            <Col xs={24} sm={12} md={6} key={i}>
              <Card
                hoverable
                style={{
                  height: "100%",
                  borderRadius: "24px",
                  border: "none",
                  transition: "all 0.3s ease",
                }}
                className="feature-card"
                styles={{ body: { padding: "24px" } }}
              >
                <Space
                  orientation="vertical"
                  align="center"
                  style={{ width: "100%" }}
                  size={24}
                >
                  <div
                    className="icon-wrapper"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "40px",
                      background: isDark
                        ? "rgba(255, 255, 255, 0.05)"
                        : token.colorBgContainer,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                      color: item.color,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {item.icon}
                  </div>
                  <Space
                    orientation="vertical"
                    align="center"
                    size={8}
                    style={{ width: "100%" }}
                  >
                    <Title level={4} style={{ margin: 0, fontSize: "18px" }}>
                      {item.title}
                    </Title>
                    <Text type="secondary" style={{ fontSize: "14px" }}>
                      {item.desc}
                    </Text>
                  </Space>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <style jsx global>{`
          .feature-card:hover {
            transform: translateY(-10px);
          }
          .feature-card:hover .icon-wrapper {
            transform: scale(1.1) rotate(5deg);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
            background: #11b6f5 !important;
            color: white !important;
          }
        `}</style>

        <Button
          type="primary"
          size="large"
          shape="round"
          style={{
            marginTop: "48px",
            height: "56px",
            padding: "0 48px",
            fontSize: "18px",
            fontWeight: 600,
            boxShadow: "0 10px 20px rgba(17, 182, 245, 0.3)",
          }}
        >
          สร้างโปรไฟล์หางานตอนนี้
        </Button>
      </div>
    </div>
  );
}
