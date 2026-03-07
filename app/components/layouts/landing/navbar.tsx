"use client";

import { useTheme } from "@/app/contexts/theme-context";
import { useAuthStore } from "@/app/stores/auth-store";
import {
  LogoutOutlined,
  MoonOutlined,
  SolutionOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Space, Tooltip, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Text } = Typography;

interface NavbarProps {
  isDark: boolean;
}

export default function Navbar({ isDark }: NavbarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { toggleTheme } = useTheme();

  const userMenuItems = [
    {
      key: "profile",
      label: "โปรไฟล์ของฉัน",
      icon: <UserOutlined />,
      onClick: () => router.push("/profile"),
    },
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
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
        background: isDark
          ? "rgba(15, 23, 42, 0.85)"
          : "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: isDark ? "1px solid #1E293B" : "1px solid #F1F5F9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 60px",
        color: isDark ? "#F8FAFC" : "#1E293B",
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            background: "#0066FF",
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
              lineHeight: 1,
            }}
          >
            K
          </span>
        </div>
        <Text
          strong
          style={{
            fontSize: "18px",
            letterSpacing: "-0.5px",
            color: isDark ? "#F8FAFC" : "#1E293B",
          }}
        >
          KAM <span style={{ color: "#0066FF" }}>SCHOOLJOB</span>
        </Text>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
        <Space size={32}>
          <Link href="/jobs" style={{ textDecoration: "none" }}>
            <Text
              strong
              style={{
                cursor: "pointer",
                color: isDark ? "#CBD5E1" : "#475569",
              }}
            >
              ค้นหางาน
            </Text>
          </Link>
          <Link href="/resume" style={{ textDecoration: "none" }}>
            <Text
              strong
              style={{
                cursor: "pointer",
                color: isDark ? "#CBD5E1" : "#475569",
              }}
            >
              ฝากประวัติ
            </Text>
          </Link>
          <Link href="/employer" style={{ textDecoration: "none" }}>
            <Text
              strong
              style={{
                cursor: "pointer",
                color: isDark ? "#CBD5E1" : "#475569",
              }}
            >
              สำหรับสถานศึกษา
            </Text>
          </Link>
          <Link href="/blog" style={{ textDecoration: "none" }}>
            <Text
              strong
              style={{
                cursor: "pointer",
                color: isDark ? "#CBD5E1" : "#475569",
              }}
            >
              บทความ
            </Text>
          </Link>
        </Space>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* ✨ [Dark Mode Toggle] */}
        <Tooltip title={isDark ? "Light Mode" : "Dark Mode"}>
          <Button
            type="text"
            shape="circle"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            style={{
              fontWeight: 600,
              fontSize: "16px",
              color: isDark ? "#FDB022" : "#64748B",
            }}
          />
        </Tooltip>

        {user ? (
          <>
            {/* ✨ [แสดง user info เมื่อ login แล้ว] */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                paddingRight: "16px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#0066FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <Text strong style={{ display: "block", fontSize: "14px" }}>
                  {user.full_name}
                </Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {user.role === "TEACHER" ? "ครูผู้สอน" : "สถานศึกษา"}
                </Text>
              </div>
            </div>

            {/* ✨ [Dropdown menu สำหรับ logout] */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button
                type="text"
                shape="circle"
                icon={<UserOutlined />}
                style={{ fontWeight: 600, marginLeft: "8px" }}
              />
            </Dropdown>
          </>
        ) : (
          <>
            {/* ✨ [แสดง signin/signup buttons เมื่อยังไม่ login] */}
            <Link href="/pages/signin">
              <Button
                type="text"
                icon={<UserOutlined />}
                style={{ fontWeight: 600 }}
              >
                เข้าสู่ระบบ
              </Button>
            </Link>
            <Link href="/pages/signup">
              <Button
                type="primary"
                shape="round"
                icon={<SolutionOutlined />}
                style={{
                  height: "40px",
                  padding: "0 20px",
                  fontWeight: 600,
                  boxShadow: "0 4px 10px rgba(0, 102, 255, 0.2)",
                }}
              >
                สมัครงานครู
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
