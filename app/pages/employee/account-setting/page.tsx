"use client";

import {
  HomeOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Col, Layout, Row, Space, Typography, theme } from "antd";
import { AccountSettingForm } from "./_components/account-setting-form";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { useToken } = theme;

export default function EmployeeAccountSettingPage() {
  const { token } = useToken();

  return (
    <Content
      style={{
        padding: "40px 24px",
        minHeight: "100vh",
        backgroundColor: token.colorBgLayout,
      }}
    >
      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={16} xl={14}>
          <Space direction="vertical" size={32} style={{ width: "100%" }}>
            {/* ── Header ─── */}
            <Space direction="vertical" size={20} style={{ width: "100%" }}>
              <Breadcrumb
                items={[
                  {
                    href: "/pages/landing",
                    title: (
                      <Space size={4}>
                        <HomeOutlined />
                        <span>หน้าแรก</span>
                      </Space>
                    ),
                  },
                  {
                    href: "/pages/employee/profile",
                    title: (
                      <Space size={4}>
                        <UserOutlined />
                        <span>โปรไฟล์ผู้สมัคร</span>
                      </Space>
                    ),
                  },
                  {
                    title: (
                      <Space size={4}>
                        <SettingOutlined />
                        <span style={{ fontWeight: 500 }}>ตั้งค่าบัญชี</span>
                      </Space>
                    ),
                  },
                ]}
              />

              {/* ✨ Hero header — gradient banner */}
              <div
                style={{
                  borderRadius: 20,
                  padding: "32px 36px",
                  background: `linear-gradient(135deg, ${token.colorPrimary} 0%, #0d8fd4 100%)`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* dot pattern */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.07,
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <Row
                  align="middle"
                  justify="space-between"
                  style={{ position: "relative", zIndex: 1 }}
                >
                  <Col>
                    <Title
                      level={2}
                      style={{
                        margin: 0,
                        fontWeight: 800,
                        color: "#fff",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      ตั้งค่าบัญชี
                    </Title>
                    <Paragraph
                      style={{
                        margin: "6px 0 0 0",
                        fontSize: 15,
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      จัดการความปลอดภัยและการเข้าถึงระบบของคุณ
                    </Paragraph>
                  </Col>
                  <Col>
                    <SafetyCertificateOutlined
                      style={{ fontSize: 56, color: "rgba(255,255,255,0.15)" }}
                    />
                  </Col>
                </Row>
              </div>
            </Space>

            {/* ── Main content ─── */}
            <AccountSettingForm />
          </Space>
        </Col>
      </Row>
    </Content>
  );
}
