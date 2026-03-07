"use client";

import { Badge, Button, Typography } from "antd";

const { Text } = Typography;

export default function Navbar() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #F1F5F9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 40px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            background: "#0066FF",
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: "20px",
              lineHeight: 1,
            }}
          >
            K
          </span>
        </div>
        <Text strong style={{ fontSize: "20px", letterSpacing: "-0.5px" }}>
          KAM SCHOOLJOB
        </Text>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        <Text strong style={{ cursor: "pointer" }}>
          คอร์สทั้งหมด
        </Text>
        <Text strong style={{ cursor: "pointer" }}>
          ติวเตอร์
        </Text>
        <Text strong style={{ cursor: "pointer" }}>
          โปรโมชัน
        </Text>
        <Button
          type="primary"
          shape="round"
          size="large"
          style={{ height: "44px", padding: "0 24px" }}
        >
          เข้าสู่ระบบ
        </Button>
      </div>
    </div>
  );
}
