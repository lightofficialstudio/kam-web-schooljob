"use client";

import { Card, Flex, Typography, theme } from "antd";

const { Title, Text } = Typography;

// ✨ [Header Section — แสดงหัวข้อหน้า User Management]
export function HeaderSection() {
  const { token } = theme.useToken();

  return (
    <Card
      styles={{ body: { padding: "20px 24px" } }}
      style={{
        background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryActive} 100%)`,
        border: "none",
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Flex vertical gap={4}>
        <Title level={3} style={{ color: "#fff", margin: 0 }}>
          จัดการผู้ใช้
        </Title>
        <Text style={{ color: "rgba(255,255,255,0.80)", fontSize: 14 }}>
          ดูและจัดการผู้ใช้ที่ลงทะเบียนทั้งหมดในระบบ
        </Text>
      </Flex>
    </Card>
  );
}
