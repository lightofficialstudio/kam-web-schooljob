"use client";

// ✨ หน้าตั้งค่าบัญชี Employer — layout 2 คอลัมน์: sidebar + content
import {
  BankOutlined,
  CrownOutlined,
  LockOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Breadcrumb, Col, Flex, Row, Tag, theme, Typography } from "antd";
import Link from "next/link";

import { useAuthStore } from "@/app/stores/auth-store";
import AccountSettingForm from "./components/account-setting-form";

const { Title, Text } = Typography;

// ✨ เมนู sidebar แต่ละ section
const SECTIONS = [
  { icon: <UserOutlined />, label: "ข้อมูลส่วนตัว", color: "#11b6f5" },
  { icon: <LockOutlined />, label: "ความปลอดภัย", color: "#52c41a" },
  { icon: <MailOutlined />, label: "ข้อมูลบัญชี", color: "#fa8c16" },
];

export default function EmployerAccountSettingPage() {
  const { user } = useAuthStore();
  const { token } = theme.useToken();

  const initials = user?.full_name
    ? user.full_name.slice(0, 2).toUpperCase()
    : "?";

  return (
    <div style={{ minHeight: "100vh", background: token.colorBgLayout }}>

      {/* ─── Hero Banner ─── */}
      <div
        style={{
          background: "linear-gradient(135deg, #001e45 0%, #0a4a8a 55%, #11b6f5 100%)",
          padding: "40px 0 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        <div style={{
          position: "absolute", top: -60, right: -60, width: 280, height: 280,
          borderRadius: "50%", background: "rgba(17,182,245,0.12)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: "30%", width: 180, height: 180,
          borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <Breadcrumb
            style={{ marginBottom: 24 }}
            items={[
              { title: <Link href="/pages/employer/profile" style={{ color: "rgba(255,255,255,0.65)" }}>หน้าแรก</Link> },
              { title: <span style={{ color: "white" }}>ตั้งค่าบัญชี</span> },
            ]}
          />
          <Flex align="center" gap={20}>
            <div style={{ position: "relative" }}>
              <Avatar
                size={72}
                src={user?.profile_image_url || undefined}
                style={{
                  background: "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 100%)",
                  border: "3px solid rgba(255,255,255,0.3)",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {!user?.profile_image_url && initials}
              </Avatar>
              {/* Online dot */}
              <div style={{
                position: "absolute", bottom: 2, right: 2,
                width: 14, height: 14, borderRadius: "50%",
                background: "#52c41a", border: "2px solid white",
              }} />
            </div>
            <Flex vertical gap={4}>
              <Title level={3} style={{ margin: 0, color: "white", lineHeight: 1.2 }}>
                {user?.full_name || "ผู้ดูแลระบบ"}
              </Title>
              <Flex gap={8} align="center">
                <Tag
                  icon={<BankOutlined />}
                  color="default"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    borderColor: "rgba(255,255,255,0.25)",
                    color: "white",
                    fontSize: 12,
                  }}
                >
                  สถานศึกษา
                </Tag>
                <Tag
                  icon={<CrownOutlined />}
                  color="default"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderColor: "rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 12,
                  }}
                >
                  Basic Plan
                </Tag>
              </Flex>
            </Flex>
          </Flex>
        </div>
      </div>

      {/* ─── Main Content (ดึงขึ้นมาทับ banner ด้วย negative margin) ─── */}
      <div style={{ maxWidth: 1152, margin: "-40px auto 0", padding: "0 24px 80px", position: "relative" }}>
        <Row gutter={24} align="top">

          {/* ─── Sidebar ─── */}
          <Col xs={0} lg={6}>
            <div
              style={{
                background: token.colorBgContainer,
                borderRadius: 16,
                padding: "20px 16px",
                border: `1px solid ${token.colorBorderSecondary}`,
                position: "sticky",
                top: 88,
              }}
            >
              <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 8px" }}>
                การตั้งค่า
              </Text>
              <Flex vertical gap={4} style={{ marginTop: 12 }}>
                {SECTIONS.map((s, i) => (
                  <Flex
                    key={i}
                    align="center"
                    gap={12}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      cursor: "pointer",
                      background: i === 0 ? `${token.colorPrimary}15` : "transparent",
                      color: i === 0 ? token.colorPrimary : token.colorText,
                      transition: "background 0.2s",
                    }}
                  >
                    <Flex
                      align="center"
                      justify="center"
                      style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: i === 0 ? token.colorPrimary : token.colorFillTertiary,
                        color: i === 0 ? "white" : token.colorTextSecondary,
                        fontSize: 14, flexShrink: 0,
                      }}
                    >
                      {s.icon}
                    </Flex>
                    <Text style={{ fontSize: 14, fontWeight: i === 0 ? 600 : 400, color: "inherit" }}>
                      {s.label}
                    </Text>
                  </Flex>
                ))}
              </Flex>

              {/* ─── Account info mini card ─── */}
              <div style={{
                marginTop: 20,
                padding: "14px 12px",
                borderRadius: 12,
                background: token.colorFillQuaternary,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}>
                <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  บัญชีของฉัน
                </Text>
                <Flex vertical gap={6} style={{ marginTop: 10 }}>
                  <Flex align="center" gap={8}>
                    <MailOutlined style={{ color: token.colorTextTertiary, fontSize: 12 }} />
                    <Text style={{ fontSize: 12 }} ellipsis={{ tooltip: user?.email }}>
                      {user?.email}
                    </Text>
                  </Flex>
                  <Flex align="center" gap={8}>
                    <SettingOutlined style={{ color: token.colorTextTertiary, fontSize: 12 }} />
                    <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
                      {user?.role === "EMPLOYER" ? "สถานศึกษา" : user?.role}
                    </Text>
                  </Flex>
                </Flex>
              </div>
            </div>
          </Col>

          {/* ─── Form Content ─── */}
          <Col xs={24} lg={18}>
            <AccountSettingForm />
          </Col>

        </Row>
      </div>
    </div>
  );
}
