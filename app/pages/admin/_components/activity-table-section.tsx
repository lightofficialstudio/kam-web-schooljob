"use client";

import { FileTextOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Card, Flex, Table, Tag, Typography, theme } from "antd";
import type { ColumnsType } from "antd/es/table";

const { Text } = Typography;

interface ActivityItem {
  key: string;
  user: string;
  action: string;
  entity: string;
  status: "success" | "processing" | "warning" | "error";
  statusLabel: string;
  time: string;
}

const mockData: ActivityItem[] = [
  { key: "1", user: "Admin", action: "สร้างผู้ใช้", entity: "teacher@school.th", status: "success", statusLabel: "สำเร็จ", time: "5 นาทีก่อน" },
  { key: "2", user: "System", action: "Sync ฐานข้อมูล", entity: "PostgreSQL", status: "processing", statusLabel: "กำลังทำ", time: "12 นาทีก่อน" },
  { key: "3", user: "Admin", action: "ลบผู้ใช้", entity: "old@user.th", status: "error", statusLabel: "ลบแล้ว", time: "30 นาทีก่อน" },
  { key: "4", user: "System", action: "Backup", entity: "DB Snapshot", status: "success", statusLabel: "สำเร็จ", time: "1 ชม.ก่อน" },
  { key: "5", user: "Admin", action: "เปลี่ยนสิทธิ์", entity: "employer@co.th", status: "warning", statusLabel: "รอยืนยัน", time: "2 ชม.ก่อน" },
];

const columns: ColumnsType<ActivityItem> = [
  {
    title: "ผู้ดำเนินการ",
    dataIndex: "user",
    render: (user: string) => (
      <Flex align="center" gap={8}>
        <Avatar size={28} icon={<UserOutlined />} />
        <Text style={{ fontSize: 13 }}>{user}</Text>
      </Flex>
    ),
  },
  {
    title: "กิจกรรม",
    dataIndex: "action",
    render: (action: string, row) => (
      <Flex align="center" gap={6}>
        <FileTextOutlined style={{ opacity: 0.4 }} />
        <span>
          <Text style={{ fontSize: 13 }}>{action}</Text>
          <Text type="secondary" style={{ fontSize: 12, marginLeft: 6 }}>· {row.entity}</Text>
        </span>
      </Flex>
    ),
  },
  {
    title: "สถานะ",
    dataIndex: "status",
    render: (status: ActivityItem["status"], row) => (
      <Badge status={status} text={<Text style={{ fontSize: 12 }}>{row.statusLabel}</Text>} />
    ),
    filters: [
      { text: "สำเร็จ", value: "success" },
      { text: "กำลังทำ", value: "processing" },
      { text: "รอยืนยัน", value: "warning" },
      { text: "ลบ/ผิดพลาด", value: "error" },
    ],
    onFilter: (value, record) => record.status === value,
  },
  {
    title: "เวลา",
    dataIndex: "time",
    render: (t: string) => <Tag style={{ borderRadius: 100, fontSize: 11 }}>{t}</Tag>,
    align: "right",
  },
];

// ✨ [Activity Table Section]
export function ActivityTableSection() {
  const { token } = theme.useToken();

  return (
    <Card
      title={
        <Flex align="center" gap={8}>
          <FileTextOutlined style={{ color: token.colorPrimary }} />
          <Text strong>กิจกรรมล่าสุด</Text>
        </Flex>
      }
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Table
        dataSource={mockData}
        columns={columns}
        pagination={{ pageSize: 5, size: "small" }}
        size="small"
        rowClassName={(_, idx) => (idx % 2 === 1 ? "table-row-striped" : "")}
      />
    </Card>
  );
}
