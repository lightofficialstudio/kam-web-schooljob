"use client";

// ✨ หน้าตั้งค่าบัญชี Employer — layout 2 คอลัมน์: sidebar + content
import {
  BankOutlined,
  CrownOutlined,
  IdcardOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Col,
  Flex,
  Row,
  Tag,
  theme,
  Typography,
} from "antd";
import axios from "axios";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useAuthStore } from "@/app/stores/auth-store";
import AccountSettingForm from "./components/account-setting-form";

const { Title, Text } = Typography;

// ✨ section id ต้องตรงกับ id ที่ใส่ใน AccountSettingForm
const SECTIONS = [
  {
    id: "section-personal",
    icon: <UserOutlined />,
    label: "ข้อมูลส่วนตัว",
    color: "#11b6f5",
  },
  {
    id: "section-security",
    icon: <SafetyCertificateOutlined />,
    label: "ความปลอดภัย",
    color: "#52c41a",
  },
  {
    id: "section-account",
    icon: <IdcardOutlined />,
    label: "ข้อมูลบัญชี",
    color: "#fa8c16",
  },
  {
    id: "section-package",
    icon: <CrownOutlined />,
    label: "แพ็คเกจ",
    color: "#722ed1",
  },
];

export default function EmployerAccountSettingPage() {
  const { user } = useAuthStore();
  const { token } = theme.useToken();
  const [activeSection, setActiveSection] = useState("section-personal");
  const observerRef = useRef<IntersectionObserver | null>(null);
  // ✨ planLabel สำหรับ hero banner — โหลดจาก API แบบ fire-and-forget
  const [planLabel, setPlanLabel] = useState<string | null>(null);

  const initials = user?.full_name
    ? user.full_name.slice(0, 2).toUpperCase()
    : "?";

  // ✨ ดึง planLabel จาก API เพื่อแสดงใน hero banner
  useEffect(() => {
    if (!user?.user_id) return;
    axios
      .get(`/api/v1/employer/package/read?user_id=${user.user_id}`)
      .then((res) => {
        if (res.data?.data?.planLabel) setPlanLabel(res.data.data.planLabel);
      })
      .catch(() => {});
  }, [user?.user_id]);

  // ✨ IntersectionObserver — ติดตาม section ที่กำลังมองเห็นอยู่
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // ✨ เลือก section แรกที่ intersecting จาก top ลงล่าง
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  // ✨ scroll ไปยัง section เมื่อกด sidebar
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 96; // ความสูง navbar
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveSection(id);
  };

  return (
    <div style={{ minHeight: "100vh", background: token.colorBgLayout }}>
      {/* ─── Hero Banner ─── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #001e45 0%, #0a4a8a 55%, #11b6f5 100%)",
          padding: "40px 0 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(17,182,245,0.12)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: "30%",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1152,
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
          }}
        >
          <Breadcrumb
            style={{ marginBottom: 24 }}
            items={[
              {
                title: (
                  <Link
                    href="/pages/employer/profile"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    หน้าแรก
                  </Link>
                ),
              },
              { title: <span style={{ color: "white" }}>ตั้งค่าบัญชี</span> },
            ]}
          />
          <Flex align="center" gap={20}>
            <div style={{ position: "relative" }}>
              <Avatar
                size={72}
                src={user?.profile_image_url || undefined}
                style={{
                  background:
                    "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 100%)",
                  border: "3px solid rgba(255,255,255,0.3)",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {!user?.profile_image_url && initials}
              </Avatar>
              <div
                style={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: token.colorSuccess,
                  border: `2px solid ${token.colorBgLayout}`,
                }}
              />
            </div>
            <Flex vertical gap={4}>
              {/* ✨ full_name คือชื่อโรงเรียน (schoolName) */}
              <Title
                level={3}
                style={{ margin: 0, color: "white", lineHeight: 1.2 }}
              >
                {user?.full_name || "ชื่อโรงเรียน"}
              </Title>
              <Typography.Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                ตั้งค่าบัญชีผู้ดูแลระบบ
              </Typography.Text>
              <Flex gap={8} align="center" style={{ marginTop: 4 }}>
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
                  {planLabel ? `${planLabel} Plan` : "..."}
                </Tag>
              </Flex>
            </Flex>
          </Flex>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div
        style={{
          maxWidth: 1152,
          margin: "-40px auto 0",
          padding: "0 24px 80px",
          position: "relative",
          overflow: "visible",
        }}
      >
        {/* ✨ align="stretch" ทำให้ Col ยืดตามความสูง content — จำเป็นสำหรับ sticky */}
        <Row
          gutter={24}
          align="stretch"
          style={{ alignItems: "flex-start", overflow: "visible" }}
        >
          {/* ─── Sidebar ─── */}
          <Col
            xs={0}
            lg={6}
            style={{
              alignSelf: "flex-start",
              position: "sticky",
              top: 120,
              zIndex: 10,
            }}
          >
            <div
              style={{
                background: token.colorBgContainer,
                borderRadius: 16,
                padding: "20px 16px",
                border: `1px solid ${token.colorBorderSecondary}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              }}
            >
              <Text
                type="secondary"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "0 8px",
                }}
              >
                การตั้งค่า
              </Text>
              <Flex vertical gap={4} style={{ marginTop: 12 }}>
                {SECTIONS.map((s) => {
                  const isActive = activeSection === s.id;
                  return (
                    <Flex
                      key={s.id}
                      align="center"
                      gap={12}
                      onClick={() => handleScrollTo(s.id)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        cursor: "pointer",
                        background: isActive
                          ? `${token.colorPrimary}18`
                          : "transparent",
                        border: `1px solid ${isActive ? `${token.colorPrimary}40` : "transparent"}`,
                        transition: "all 0.2s",
                      }}
                    >
                      <Flex
                        align="center"
                        justify="center"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          flexShrink: 0,
                          background: isActive
                            ? token.colorPrimary
                            : token.colorFillTertiary,
                          color: isActive ? "white" : token.colorTextSecondary,
                          fontSize: 14,
                          transition: "all 0.2s",
                        }}
                      >
                        {s.icon}
                      </Flex>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: isActive ? 600 : 400,
                          color: isActive
                            ? token.colorPrimary
                            : token.colorText,
                          transition: "all 0.2s",
                        }}
                      >
                        {s.label}
                      </Text>
                      {/* ✨ Active indicator dot */}
                      {isActive && (
                        <div
                          style={{
                            marginLeft: "auto",
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: token.colorPrimary,
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </Flex>
                  );
                })}
              </Flex>

              {/* ─── Account info mini card ─── */}
              <div
                style={{
                  marginTop: 20,
                  padding: "14px 12px",
                  borderRadius: 12,
                  background: token.colorFillQuaternary,
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <Text
                  type="secondary"
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  บัญชีของฉัน
                </Text>
                <Flex vertical gap={6} style={{ marginTop: 10 }}>
                  <Flex align="center" gap={8}>
                    <MailOutlined
                      style={{ color: token.colorTextTertiary, fontSize: 12 }}
                    />
                    <Text
                      style={{ fontSize: 12 }}
                      ellipsis={{ tooltip: user?.email }}
                    >
                      {user?.email}
                    </Text>
                  </Flex>
                  <Flex align="center" gap={8}>
                    <SettingOutlined
                      style={{ color: token.colorTextTertiary, fontSize: 12 }}
                    />
                    <Text
                      style={{ fontSize: 12, color: token.colorTextSecondary }}
                    >
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
