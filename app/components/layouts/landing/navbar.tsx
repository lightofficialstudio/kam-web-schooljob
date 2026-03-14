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
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Flex,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Text } = Typography;

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { toggleTheme, mode } = useTheme();

  const userMenuItems = [
    {
      key: "profile",
      label: "โปรไฟล์ของฉัน",
      icon: <UserOutlined />,
      onClick: () => {
        if (user?.role === "EMPLOYER") {
          router.push("/pages/employer/profile");
        } else {
          router.push("/pages/teacher/profile/");
        }
      },
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
    <Row
      justify="space-between"
      align="middle"
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
        backdropFilter: "blur(12px)",
        padding: "12px 60px",
      }}
    >
      <Link
        href="/"
        style={{
          textDecoration: "none",
        }}
      >
        <Space size="small">
          <Card
            size="small"
            variant="borderless"
            style={{
              width: "36px",
              height: "36px",
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
              backgroundColor: "#1890ff",
            }}
          >
            <Text
              strong
              style={{ fontSize: "18px", lineHeight: 1, color: "#fff" }}
            >
              S
            </Text>
          </Card>
          <Text
            strong
            style={{
              fontSize: "18px",
              letterSpacing: "-0.5px",
            }}
          >
            SCHOOL <span>BOARD</span>
          </Text>
        </Space>
      </Link>

      <Space size={32}>
        {(!user || user.role === "EMPLOYEE") && (
          <>
            <Link href="/pages/job" style={{ textDecoration: "none" }}>
              <Text strong style={{ cursor: "pointer" }}>
                ค้นหางาน
              </Text>
            </Link>
            <Link
              href="/pages/teacher/profile"
              style={{ textDecoration: "none" }}
            >
              <Text strong style={{ cursor: "pointer" }}>
                ฝากประวัติ
              </Text>
            </Link>
            <Link href="/pages/blog" style={{ textDecoration: "none" }}>
              <Text strong style={{ cursor: "pointer" }}>
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
              <Text strong style={{ cursor: "pointer" }}>
                งานของฉัน
              </Text>
            </Link>
            <Link
              href="/pages/employer/job/post"
              style={{ textDecoration: "none" }}
            >
              <Text strong style={{ cursor: "pointer" }}>
                ประกาศงาน
              </Text>
            </Link>
            <Link
              href="/pages/employer/profile"
              style={{ textDecoration: "none" }}
            >
              <Text strong style={{ cursor: "pointer" }}>
                โปรไฟล์ของฉัน
              </Text>
            </Link>
            <Link href="/pages/blog" style={{ textDecoration: "none" }}>
              <Text strong style={{ cursor: "pointer" }}>
                บทความ
              </Text>
            </Link>
          </>
        )}
      </Space>

      <Space size={12}>
        {/* ✨ [Dark Mode Toggle] */}
        <Tooltip title={mode === "dark" ? "Light Mode" : "Dark Mode"}>
          <Button
            type="text"
            shape="circle"
            icon={mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            style={{
              fontWeight: 600,
              fontSize: "16px",
            }}
          />
        </Tooltip>

        {user ? (
          <>
            {/* ✨ [แสดง user info เมื่อ login แล้ว] */}
            <Flex align="center" gap={12} style={{ paddingRight: "16px" }}>
              <Avatar>{user.full_name.charAt(0).toUpperCase()}</Avatar>
              <Flex vertical gap={0}>
                <Text strong style={{ fontSize: "14px" }}>
                  {user.full_name}
                </Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {user.role === "EMPLOYEE" ? "ครูผู้สอน" : "สถานศึกษา"}
                </Text>
              </Flex>
            </Flex>

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
                }}
              >
                สมัครงานครู
              </Button>
            </Link>
          </>
        )}
      </Space>
    </Row>
  );
}
