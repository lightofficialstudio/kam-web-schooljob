"use client";

import { useTheme } from "@/app/contexts/theme-context";
import { useAuthStore } from "@/app/stores/auth-store";
import {
  FacebookOutlined,
  LineOutlined,
  MailOutlined,
  PhoneOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Card, Col, Divider, Flex, Row, Space, theme, Typography } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";

const { Text, Title, Paragraph } = Typography;

// ─── Link definitions ตาม role ───────────────────────────────────────────────

const LINKS_EMPLOYEE = [
  { label: "ค้นหาตำแหน่งงาน", href: "/pages/job" },
  { label: "โปรไฟล์ของฉัน", href: "/pages/employee/profile" },
  { label: "ใบสมัครงาน", href: "/pages/employee/applications" },
  { label: "ค้นหาโรงเรียน", href: "/pages/employee/school" },
  { label: "ตั้งค่าบัญชี", href: "/pages/employee/account-setting" },
];

const LINKS_EMPLOYER = [
  { label: "ประกาศรับสมัครงาน", href: "/pages/employer/job/post" },
  { label: "จัดการประกาศงาน", href: "/pages/employer/job/read" },
  { label: "โปรไฟล์โรงเรียน", href: "/pages/employer/profile" },
  { label: "จัดการสมาชิก", href: "/pages/employer/school-management" },
  { label: "ตั้งค่าบัญชี", href: "/pages/employer/account-setting" },
];

const LINKS_ADMIN = [
  { label: "แดชบอร์ด", href: "/pages/admin" },
  { label: "จัดการผู้ใช้", href: "/pages/admin/user-management" },
  { label: "จัดการงาน", href: "/pages/admin/job-management/read" },
  { label: "จัดการบทความ", href: "/pages/admin/blog" },
  { label: "แพ็กเกจ", href: "/pages/admin/package-management" },
];

const LINKS_GUEST = [
  { label: "ค้นหาตำแหน่งงาน", href: "/pages/job" },
  { label: "อ่านบทความ", href: "/pages/blog" },
  { label: "เข้าสู่ระบบ", href: "/pages/signin" },
  { label: "สมัครสมาชิก", href: "/pages/signup" },
];

// ─── Column title ตาม role ────────────────────────────────────────────────────

const COL_TITLE: Record<string, string> = {
  EMPLOYEE: "เมนูสำหรับครู",
  EMPLOYER: "เมนูสำหรับโรงเรียน",
  ADMIN: "เมนูผู้ดูแลระบบ",
  GUEST: "เริ่มต้นใช้งาน",
};

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const { token } = theme.useToken();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const { user, isAuthenticated } = useAuthStore();

  // ✨ ป้องกัน hydration mismatch — รอ mount ก่อนอ่าน store
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const role = isMounted && isAuthenticated && user?.role ? user.role : "GUEST";

  const links =
    role === "EMPLOYEE"
      ? LINKS_EMPLOYEE
      : role === "EMPLOYER"
        ? LINKS_EMPLOYER
        : role === "ADMIN"
          ? LINKS_ADMIN
          : LINKS_GUEST;

  const colTitle = COL_TITLE[role];

  // ✨ column 2 — "สำหรับคนหางาน" แสดงเฉพาะ guest/employee
  const showJobSeekerCol = role === "GUEST" || role === "EMPLOYEE";
  // ✨ column 3 — "สำหรับสถานศึกษา" แสดงเฉพาะ guest/employer
  const showSchoolCol = role === "GUEST" || role === "EMPLOYER";

  return (
    <footer
      style={{
        padding: "80px 24px 40px 24px",
        backgroundColor: token.colorBgContainer,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        transition: "all 0.3s ease",
      }}
    >
      <Row gutter={[48, 32]} style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* ─── Brand ─── */}
        <Col xs={24} lg={8}>
          <Flex vertical gap={24} style={{ width: "100%" }}>
            <Space size="small">
              <Card
                size="small"
                variant="borderless"
                style={{
                  width: "32px",
                  height: "32px",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  backgroundColor: token.colorPrimary,
                }}
              >
                <Text strong style={{ fontSize: "16px", color: "#fff" }}>
                  S
                </Text>
              </Card>
              <Text strong style={{ fontSize: "18px", color: token.colorText }}>
                SCHOOL <span style={{ color: token.colorPrimary }}>BOARD</span>
              </Text>
            </Space>
            <Paragraph
              style={{ lineHeight: "1.8", color: token.colorTextSecondary }}
            >
              แพลตฟอร์มหางานสายการศึกษาอันดับ 1 ของไทย ครบทุกตำแหน่งงานครู
              ติวเตอร์ ธุรการ และบุคลากรทางการศึกษา
              เชื่อมโยงสถานศึกษาและผู้หางานด้วยเทคโนโลยีที่ทันสมัย
            </Paragraph>
            <Space size={16}>
              <FacebookOutlined
                style={{ fontSize: "20px", color: token.colorTextDescription }}
              />
              <YoutubeOutlined
                style={{ fontSize: "20px", color: token.colorTextDescription }}
              />
              <LineOutlined
                style={{ fontSize: "20px", color: token.colorTextDescription }}
              />
            </Space>
          </Flex>
        </Col>

        {/* ─── Column ตาม role ─── */}
        <Col xs={12} lg={4}>
          <Flex vertical gap={24} style={{ width: "100%" }}>
            <Title level={5} style={{ margin: 0, color: token.colorText }}>
              {colTitle}
            </Title>
            <Flex vertical gap={12}>
              {links.map((link) => (
                <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
                  <Text
                    style={{
                      cursor: "pointer",
                      color: token.colorTextSecondary,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = token.colorPrimary)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = token.colorTextSecondary)
                    }
                  >
                    {link.label}
                  </Text>
                </Link>
              ))}
            </Flex>
          </Flex>
        </Col>

        {/* ─── Column เสริม (guest เห็นทั้งสองฝั่ง) ─── */}
        {(showJobSeekerCol || showSchoolCol) && (
          <Col xs={12} lg={4}>
            <Flex vertical gap={24} style={{ width: "100%" }}>
              {showJobSeekerCol && role === "GUEST" && (
                <>
                  <Title level={5} style={{ margin: 0, color: token.colorText }}>
                    สำหรับสถานศึกษา
                  </Title>
                  <Flex vertical gap={12}>
                    {[
                      { label: "ประกาศรับสมัครงาน", href: "/pages/signup" },
                      { label: "แพ็กเกจสมาชิก", href: "/pages/signup" },
                      { label: "ค้นหาประวัติครู", href: "/pages/signup" },
                    ].map((link) => (
                      <Link key={link.label} href={link.href} style={{ textDecoration: "none" }}>
                        <Text
                          style={{ cursor: "pointer", color: token.colorTextSecondary }}
                          onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLElement).style.color = token.colorPrimary)
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLElement).style.color = token.colorTextSecondary)
                          }
                        >
                          {link.label}
                        </Text>
                      </Link>
                    ))}
                  </Flex>
                </>
              )}
            </Flex>
          </Col>
        )}

        {/* ─── ติดต่อเรา ─── */}
        <Col xs={24} lg={8}>
          <Flex vertical gap={24} style={{ width: "100%" }}>
            <Title level={5} style={{ margin: 0, color: token.colorText }}>
              ติดต่อเรา
            </Title>
            <Flex vertical gap={16} style={{ width: "100%" }}>
              <Space style={{ color: token.colorTextSecondary }}>
                <PhoneOutlined />
                <Text style={{ color: token.colorTextSecondary }}>
                  02-XXX-XXXX (ฝ่ายบริการลูกค้า)
                </Text>
              </Space>
              <Space style={{ color: token.colorTextSecondary }}>
                <MailOutlined />
                <Text style={{ color: token.colorTextSecondary }}>
                  support@schoolboard.com
                </Text>
              </Space>
              <Card
                size="small"
                variant="borderless"
                style={{
                  borderRadius: "12px",
                  backgroundColor: isDark
                    ? token.colorBgElevated
                    : token.colorFillAlter,
                }}
              >
                <Flex vertical gap={4}>
                  <Text strong style={{ color: token.colorText }}>
                    เวลาทำการ
                  </Text>
                  <Text
                    style={{
                      fontSize: "13px",
                      color: token.colorTextDescription,
                    }}
                  >
                    จันทร์ - ศุกร์ : 09:00 - 18:00 น.
                  </Text>
                </Flex>
              </Card>

              {/* ✨ แสดงชื่อ user ที่ login อยู่ */}
              {isMounted && isAuthenticated && user && (
                <Card
                  size="small"
                  variant="borderless"
                  style={{
                    borderRadius: "12px",
                    backgroundColor: `${token.colorPrimary}10`,
                    border: `1px solid ${token.colorPrimary}30`,
                  }}
                >
                  <Flex vertical gap={2}>
                    <Text strong style={{ color: token.colorText, fontSize: 13 }}>
                      {user.full_name || user.email}
                    </Text>
                    <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
                      {role === "EMPLOYEE"
                        ? "ครู / ผู้หางาน"
                        : role === "EMPLOYER"
                          ? "สถานศึกษา"
                          : "ผู้ดูแลระบบ"}
                    </Text>
                  </Flex>
                </Card>
              )}
            </Flex>
          </Flex>
        </Col>
      </Row>

      <Divider style={{ margin: "40px 0" }} />

      <Row
        justify="space-between"
        align="middle"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <Col>
          <Text style={{ fontSize: "13px", color: token.colorTextDescription }}>
            © {new Date().getFullYear()} SCHOOL BOARD. All rights reserved.
          </Text>
        </Col>
        <Col>
          <Space size={24}>
            <Text
              style={{
                fontSize: "13px",
                cursor: "pointer",
                color: token.colorTextDescription,
              }}
            >
              นโยบายความเป็นส่วนตัว
            </Text>
            <Text
              style={{
                fontSize: "13px",
                cursor: "pointer",
                color: token.colorTextDescription,
              }}
            >
              ข้อตกลงการใช้งาน
            </Text>
          </Space>
        </Col>
      </Row>
    </footer>
  );
}
