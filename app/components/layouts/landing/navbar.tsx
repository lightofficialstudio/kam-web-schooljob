"use client";

import { useTheme } from "@/app/contexts/theme-context";
import { useAuthStore } from "@/app/stores/auth-store";
import {
  CaretDownOutlined,
  KeyOutlined,
  LogoutOutlined,
  MoonOutlined,
  SettingOutlined,
  SolutionOutlined,
  SunOutlined,
  SwapOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Dropdown,
  Flex,
  Space,
  theme,
  Tooltip,
  Typography,
} from "antd";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Text } = Typography;

// ✨ รูปแบบข้อมูล delegated access จาก API
interface DelegatedSchool {
  id: string;
  schoolProfile: {
    id: string;
    schoolName: string;
    schoolType?: string | null;
    province: string;
    logoUrl?: string | null;
  };
  role: { name: string; color: string };
}

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { toggleTheme, mode } = useTheme();
  const { token } = theme.useToken();
  const isDark = mode === "dark";

  // ✨ [ตรวจสอบ scroll position เพื่อเปลี่ยนเป็น Floating Pill Navbar]
  const [scrolled, setScrolled] = useState(false);
  // ✨ [Delegated schools จาก DB]
  const [delegatedSchools, setDelegatedSchools] = useState<DelegatedSchool[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✨ ดึง delegated access เฉพาะ EMPLOYEE — EMPLOYER เจ้าของไม่มี delegated
  useEffect(() => {
    if (!user?.user_id || user.role === "EMPLOYER") return;
    axios
      .get(`/api/v1/employer/organization/delegated?user_id=${user.user_id}`)
      .then((res) => {
        if (res.data.status_code === 200 && Array.isArray(res.data.data)) {
          setDelegatedSchools(res.data.data);
        }
      })
      .catch(() => {/* ไม่แสดง error บน Navbar */});
  }, [user?.user_id, user?.role]);

  const userMenuItems = [
    {
      key: "profile",
      label: user?.role === "EMPLOYER" ? "โปรไฟล์โรงเรียน" : "โปรไฟล์ของฉัน",
      icon: <UserOutlined />,
      onClick: () => {
        if (user?.role === "EMPLOYER") {
          router.push("/pages/employer/profile");
        } else {
          router.push("/pages/employee/profile/");
        }
      },
    },
    {
      key: "account-settings",
      label: "ตั้งค่าบัญชี",
      icon: <SettingOutlined />,
      onClick: () => {
        if (user?.role === "EMPLOYER") {
          router.push("/pages/employer/account-setting");
        } else {
          router.push("/pages/employee/account-setting");
        }
      },
    },
    // ✨ [Delegated Access — แสดงเฉพาะเมื่อมีสิทธิ์ที่ได้รับมอบจริง]
    ...(delegatedSchools.length > 0
      ? [
          {
            key: "delegated-access",
            label: (
              <Flex align="center" justify="space-between" gap={8}>
                <span>การเข้าถึงของผู้รับมอบสิทธิ์</span>
                <Badge
                  count={delegatedSchools.length}
                  size="small"
                  color={token.colorPrimary}
                />
              </Flex>
            ),
            icon: <KeyOutlined />,
            onClick: () => router.push("/pages/employer/delegated-access"),
          },
        ]
      : []),
    { type: "divider" as const },
    {
      key: "logout",
      label: "ออกจากระบบ",
      icon: <LogoutOutlined />,
      onClick: () => {
        logout();
        router.push("/");
        router.refresh();
      },
      danger: true,
    },
  ];

  // ─── Dropdown items สำหรับ "เข้าถึงในฐานะ" — ดึงจาก DB จริง ──────────────
  const delegatedDropdownItems = [
    {
      key: "header",
      type: "group" as const,
      label: (
        <Flex align="center" gap={6}>
          <SwapOutlined style={{ color: token.colorTextSecondary, fontSize: 12 }} />
          <Text
            type="secondary"
            style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}
          >
            เข้าถึงในฐานะ
          </Text>
        </Flex>
      ),
      children: delegatedSchools.map((item) => ({
        key: item.id,
        label: (
          <Flex align="center" gap={10} style={{ padding: "2px 0" }}>
            <Avatar
              size={28}
              src={item.schoolProfile.logoUrl || undefined}
              style={{
                backgroundColor: item.role.color || token.colorPrimary,
                fontSize: 10,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {!item.schoolProfile.logoUrl && item.schoolProfile.schoolName?.charAt(0)}
            </Avatar>
            <Flex vertical gap={1}>
              <Text style={{ fontSize: 13, fontWeight: 500 }}>
                {item.schoolProfile.schoolName}
              </Text>
              <Text type="secondary" style={{ fontSize: 11 }}>
                {item.role.name}
              </Text>
            </Flex>
          </Flex>
        ),
        onClick: () => router.push(`/pages/employer/job/read`),
      })),
    },
    { type: "divider" as const },
    {
      key: "view-all",
      label: (
        <Flex align="center" gap={6}>
          <KeyOutlined style={{ fontSize: 12 }} />
          <Text style={{ fontSize: 13 }}>ดูสิทธิ์ทั้งหมด</Text>
        </Flex>
      ),
      onClick: () => router.push("/pages/employer/delegated-access"),
    },
  ];

  return (
    // ✨ [Outer wrapper — fixed full-width, จัด layout ให้ pill ลอยตรงกลาง]
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? "12px 24px" : "0",
        transition: "padding 0.4s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: scrolled ? "860px" : "100%",
          margin: "0 auto",
          pointerEvents: "auto",

          // ── Pill shape เมื่อ scroll ──
          borderRadius: scrolled ? "100px" : "0px",
          padding: scrolled ? "8px 20px" : "12px 60px",

          // ── Background ──
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          backgroundColor: scrolled
            ? isDark
              ? "rgba(10, 15, 30, 0.82)"
              : "rgba(255, 255, 255, 0.82)"
            : isDark
              ? "rgba(10, 15, 30, 0.70)"
              : "rgba(255, 255, 255, 0.70)",

          // ── Border — ใช้แยก 4 ด้านเพื่อหลีกเลี่ยง shorthand conflict ──
          borderTopWidth: scrolled ? "1px" : "0px",
          borderRightWidth: scrolled ? "1px" : "0px",
          borderBottomWidth: "1px",
          borderLeftWidth: scrolled ? "1px" : "0px",
          borderStyle: "solid",
          borderColor: scrolled
            ? isDark
              ? "rgba(255,255,255,0.10)"
              : "rgba(17,182,245,0.20)"
            : token.colorBorderSecondary,

          // ── Shadow — เหมือน Dynamic Island ──
          boxShadow: scrolled
            ? isDark
              ? "0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)"
              : "0 8px 32px rgba(17,182,245,0.15), 0 2px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)"
            : "none",

          // ── Transition ──
          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <Space size="small">
            <Card
              size="small"
              variant="borderless"
              style={{
                width: scrolled ? "30px" : "36px",
                height: scrolled ? "30px" : "36px",
                padding: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: scrolled ? "50%" : "10px",
                backgroundColor: token.colorPrimary,
                transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                flexShrink: 0,
              }}
            >
              <Text
                strong
                style={{
                  fontSize: scrolled ? "14px" : "18px",
                  lineHeight: 1,
                  color: "#fff",
                  transition: "font-size 0.4s ease",
                }}
              >
                S
              </Text>
            </Card>
            {/* ซ่อน wordmark เมื่อ scrolled เพื่อประหยัดพื้นที่ pill */}
            <div
              style={{
                maxWidth: scrolled ? "0px" : "200px",
                overflow: "hidden",
                transition: "max-width 0.35s cubic-bezier(0.4,0,0.2,1)",
                whiteSpace: "nowrap",
              }}
            >
              <Text
                strong
                style={{
                  fontSize: "18px",
                  letterSpacing: "-0.5px",
                  color: token.colorText,
                  paddingLeft: 4,
                }}
              >
                SCHOOL <span style={{ color: token.colorPrimary }}>BOARD</span>
              </Text>
            </div>
          </Space>
        </Link>

        {/* Nav Links */}
        <Space
          size={scrolled ? 20 : 32}
          style={{ transition: "gap 0.4s ease" }}
        >
          {(!user || user.role === "EMPLOYEE") && (
            <>
              <Link href="/pages/job" style={{ textDecoration: "none" }}>
                <Text
                  strong
                  style={{ cursor: "pointer", fontSize: scrolled ? 13 : 14 }}
                >
                  ค้นหางาน
                </Text>
              </Link>
              {/* ✨ [ฝากประวัติ: ต้อง login ก่อน — พาไปหน้า signin พร้อม callback] */}
              <Text
                strong
                style={{ cursor: "pointer", fontSize: scrolled ? 13 : 14 }}
                onClick={() => {
                  if (user) {
                    router.push("/pages/employee/profile");
                  } else {
                    router.push(
                      "/pages/signin?redirect=%2Fpages%2Femployee%2Fprofile",
                    );
                  }
                }}
              >
                ฝากประวัติ
              </Text>
              <Link
                href="/pages/employee/school"
                style={{ textDecoration: "none" }}
              >
                <Text
                  strong
                  style={{ cursor: "pointer", fontSize: scrolled ? 13 : 14 }}
                >
                  โรงเรียน
                </Text>
              </Link>
              <Link href="/pages/blog" style={{ textDecoration: "none" }}>
                <Text
                  strong
                  style={{ cursor: "pointer", fontSize: scrolled ? 13 : 14 }}
                >
                  บทความ
                </Text>
              </Link>
            </>
          )}

          {user && user.role === "EMPLOYER" && (
            <>
              <Link
                href="/pages/employer/job/read"
                style={{ textDecoration: "none" }}
              >
                <Text
                  strong
                  style={{ cursor: "pointer", fontSize: scrolled ? 13 : 14 }}
                >
                  งานของฉัน
                </Text>
              </Link>
              <Link
                href="/pages/employer/job/post"
                style={{ textDecoration: "none" }}
              >
                <Text
                  strong
                  style={{ cursor: "pointer", fontSize: scrolled ? 13 : 14 }}
                >
                  ประกาศงาน
                </Text>
              </Link>
              <Link
                href="/pages/employer/school-management"
                style={{ textDecoration: "none" }}
              >
                <Text
                  strong
                  style={{ cursor: "pointer", fontSize: scrolled ? 13 : 14 }}
                >
                  จัดการโรงเรียน
                </Text>
              </Link>

              {/* ✨ [Delegated Access Dropdown — เข้าถึงในฐานะโรงเรียนอื่น] */}
              {delegatedSchools.length > 0 && (
                <Dropdown
                  menu={{ items: delegatedDropdownItems }}
                  placement="bottom"
                  trigger={["click"]}
                >
                  <Flex align="center" gap={5} style={{ cursor: "pointer" }}>
                    <SwapOutlined
                      style={{
                        fontSize: scrolled ? 12 : 13,
                        color: token.colorPrimary,
                      }}
                    />
                    <Text
                      strong
                      style={{
                        fontSize: scrolled ? 13 : 14,
                        color: token.colorPrimary,
                      }}
                    >
                      เข้าถึงในฐานะ
                    </Text>
                    <Badge
                      count={delegatedSchools.length}
                      size="small"
                      color={token.colorPrimary}
                      offset={[0, 0]}
                    />
                    <CaretDownOutlined
                      style={{ fontSize: 10, color: token.colorTextTertiary }}
                    />
                  </Flex>
                </Dropdown>
              )}

              <Link
                href="/pages/employer/profile"
                style={{ textDecoration: "none" }}
              >
                <Text
                  strong
                  style={{ cursor: "pointer", fontSize: scrolled ? 13 : 14 }}
                >
                  โปรไฟล์ของฉัน
                </Text>
              </Link>
              <Link href="/pages/blog" style={{ textDecoration: "none" }}>
                <Text
                  strong
                  style={{ cursor: "pointer", fontSize: scrolled ? 13 : 14 }}
                >
                  บทความ
                </Text>
              </Link>
            </>
          )}
        </Space>

        {/* Right actions */}
        <Space size={8} style={{ flexShrink: 0 }}>
          {/* ✨ [Dark Mode Toggle] */}
          <Tooltip title={mode === "dark" ? "Light Mode" : "Dark Mode"}>
            <Button
              type="text"
              shape="circle"
              icon={mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
              size={scrolled ? "small" : "middle"}
              style={{ fontSize: "16px" }}
            />
          </Tooltip>

          {user ? (
            <>
              {/* ✨ [แสดง user info เมื่อ login แล้ว — ย่อเมื่อ scrolled] */}
              <div
                style={{
                  maxWidth: scrolled ? "0px" : "220px",
                  overflow: "hidden",
                  transition: "max-width 0.35s cubic-bezier(0.4,0,0.2,1)",
                  whiteSpace: "nowrap",
                }}
              >
                <Flex align="center" gap={10} style={{ paddingRight: 8 }}>
                  <Avatar
                    size={32}
                    src={user.profile_image_url || undefined}
                    style={{ backgroundColor: token.colorPrimary }}
                  >
                    {!user.profile_image_url && user.full_name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Flex vertical gap={0}>
                    <Text strong style={{ fontSize: 13 }}>
                      {user.full_name}
                    </Text>
                    {/* ✨ แสดง role label ให้ทุก role เพื่อความชัดเจน */}
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {user.role === "EMPLOYER"
                        ? "โรงเรียน"
                        : user.role === "EMPLOYEE"
                          ? "ครูผู้สอน"
                          : "ผู้ดูแลระบบ"}
                    </Text>
                  </Flex>
                </Flex>
              </div>

              {/* ✨ [Avatar icon เมื่อ scrolled] */}
              {scrolled && (
                <Avatar
                  size={32}
                  src={user.profile_image_url || undefined}
                  style={{
                    backgroundColor: token.colorPrimary,
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  {!user.profile_image_url && user.full_name.charAt(0).toUpperCase()}
                </Avatar>
              )}

              {/* ✨ [Dropdown menu] */}
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Button
                  type="text"
                  shape="circle"
                  icon={<UserOutlined />}
                  size={scrolled ? "small" : "middle"}
                />
              </Dropdown>
            </>
          ) : (
            <>
              {/* ✨ [signin/signup — ย่อเมื่อ scrolled] */}
              <div
                style={{
                  maxWidth: scrolled ? "0px" : "140px",
                  overflow: "hidden",
                  transition: "max-width 0.35s cubic-bezier(0.4,0,0.2,1)",
                  whiteSpace: "nowrap",
                }}
              >
                <Link href="/pages/signin">
                  <Button
                    type="text"
                    icon={<UserOutlined />}
                    style={{ fontWeight: 600 }}
                  >
                    เข้าสู่ระบบ
                  </Button>
                </Link>
              </div>
              <Link href="/pages/signup">
                <Button
                  type="primary"
                  shape="round"
                  icon={<SolutionOutlined />}
                  size={scrolled ? "small" : "middle"}
                  style={{
                    height: scrolled ? "32px" : "40px",
                    padding: scrolled ? "0 14px" : "0 20px",
                    fontWeight: 600,
                    fontSize: scrolled ? 12 : 14,
                    transition: "all 0.4s ease",
                  }}
                >
                  สมัครงานครู
                </Button>
              </Link>
            </>
          )}
        </Space>
      </div>
    </div>
  );
}
