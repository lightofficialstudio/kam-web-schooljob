"use client";

import { Button, Card, Flex, Space, Typography, theme } from "antd";
import { useUserManagementStore } from "../_state/user-management-store";

const { Text } = Typography;

// ✨ [Bulk Action Section — แสดงเมื่อมีการเลือก rows และให้ดำเนินการกลุ่ม]
export function BulkActionSection() {
  const { token } = theme.useToken();
  const selectedRowKeys = useUserManagementStore((s) => s.selectedRowKeys);
  const users = useUserManagementStore((s) => s.users);

  if (selectedRowKeys.length === 0) return null;

  // ส่งออกข้อมูล users ที่เลือกเป็น CSV
  const handleExportSelectedCsv = () => {
    const selected = users.filter((u) => selectedRowKeys.includes(u.id));
    console.log("Export selected CSV:", selected);
  };

  // ส่งออกข้อมูล users ทั้งหมดเป็น CSV
  const handleExportAllCsv = () => {
    console.log("Export all CSV:", users);
  };

  return (
    <Card
      style={{
        background: token.colorPrimaryBg,
        border: `1px solid ${token.colorPrimaryBorder}`,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <Text>
          เลือก{" "}
          <Text strong style={{ color: token.colorPrimary }}>
            {selectedRowKeys.length}
          </Text>{" "}
          ผู้ใช้
        </Text>
        <Space>
          <Button danger onClick={() => {}}>
            ลบที่เลือก
          </Button>
          <Button onClick={handleExportAllCsv}>ส่งออก CSV (ทั้งหมด)</Button>
          <Button onClick={handleExportSelectedCsv}>
            ส่งออก CSV (ที่เลือก)
          </Button>
        </Space>
      </Flex>
    </Card>
  );
}
