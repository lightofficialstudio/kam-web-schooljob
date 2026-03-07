"use client";

import { SolutionOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Space, Typography } from "antd";
import Link from "next/link";

const { Text } = Typography;

export default function Navbar() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #F1F5F9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 60px",
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
            color: "#1E293B",
          }}
        >
          KAM <span style={{ color: "#0066FF" }}>SCHOOLJOB</span>
        </Text>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
        <Space size={32}>
          <Link href="/jobs" style={{ textDecoration: "none" }}>
            <Text strong style={{ cursor: "pointer", color: "#475569" }}>
              ค้นหางาน
            </Text>
          </Link>
          <Link href="/resume" style={{ textDecoration: "none" }}>
            <Text strong style={{ cursor: "pointer", color: "#475569" }}>
              ฝากประวัติ
            </Text>
          </Link>
          <Link href="/employer" style={{ textDecoration: "none" }}>
            <Text strong style={{ cursor: "pointer", color: "#475569" }}>
              สำหรับสถานศึกษา
            </Text>
          </Link>
          <Link href="/blog" style={{ textDecoration: "none" }}>
            <Text strong style={{ cursor: "pointer", color: "#475569" }}>
              บทความ
            </Text>
          </Link>
        </Space>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
      </div>
    </div>
  );
}
