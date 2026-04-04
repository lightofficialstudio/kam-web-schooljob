"use client";

import { CalendarOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { Card, Space, Table, Tag, Typography, theme } from "antd";

const { Text } = Typography;

// ✨ [type สำหรับ activity row]
interface ActivityRecord {
  key: string;
  action: string;
  user: string;
  time: string;
  status: "success" | "info" | "error";
}

// ข้อมูล mock สำหรับ recent activities
const recentActivities: ActivityRecord[] = [
  {
    key: "1",
    action: "ผู้ใช้ใหม่ลงทะเบียน",
    user: "Demo User",
    time: "10 นาทีที่แล้ว",
    status: "success",
  },
  {
    key: "2",
    action: "เปลี่ยนแปลงการตั้งค่า",
    user: "Admin",
    time: "1 ชั่วโมงที่แล้ว",
    status: "info",
  },
  {
    key: "3",
    action: "สำเร็จการยืนยันการเชื่อมต่อฐานข้อมูล",
    user: "System",
    time: "2 ชั่วโมงที่แล้ว",
    status: "success",
  },
];

// ✨ [Activity Table Section — ตารางกิจกรรมล่าสุดในระบบ]
export function ActivityTableSection() {
  const { token } = theme.useToken();

  const statusColorMap: Record<ActivityRecord["status"], string> = {
    success: "success",
    info: "processing",
    error: "error",
  };

  const columns: TableColumnsType<ActivityRecord> = [
    { title: "กิจกรรม", dataIndex: "action", key: "action" },
    { title: "ผู้ใช้", dataIndex: "user", key: "user" },
    { title: "เวลา", dataIndex: "time", key: "time" },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (status: ActivityRecord["status"]) => (
        <Tag color={statusColorMap[status]}>{status.toUpperCase()}</Tag>
      ),
    },
  ];

  return (
    <Card
      title={
        <Space>
          <CalendarOutlined />
          <Text strong>กิจกรรมล่าสุด</Text>
        </Space>
      }
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
      styles={{ body: { padding: 0 } }}
    >
      <Table
        columns={columns}
        dataSource={recentActivities}
        pagination={false}
        size="small"
        rowClassName={(_, i) => (i % 2 === 1 ? "table-row-striped" : "")}
      />
    </Card>
  );
}
