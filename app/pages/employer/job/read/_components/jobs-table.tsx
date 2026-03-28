"use client";

import {
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
  StopOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import Link from "next/link";
import type { ReactNode } from "react";
import { useJobReadStore, type JobRecord } from "../_state/job-read-store";

const { Text } = Typography;

// ตาราง Job Listings พร้อมสถิติ, สถานะ และปุ่มจัดการ
export const JobsTable = () => {
  const { token } = theme.useToken();
  const { jobs, searchKeyword, activeTab } = useJobReadStore();

  // กรองตาม keyword และ tab สถานะ
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchKeyword ||
      job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.subjects.some((s) =>
        s.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
    const matchesTab = activeTab === "ALL" || job.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const columns = [
    {
      title: "รายละเอียดงาน",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: JobRecord) => (
        <Space orientation="vertical" size={4}>
          <Text strong style={{ fontSize: 16, color: token.colorPrimary }}>
            {text}
          </Text>
          <Space wrap>
            {record.subjects.map((s) => (
              <Tag key={s} color="#11b6f5" variant="filled">
                {s}
              </Tag>
            ))}
          </Space>
          <Text type="secondary" style={{ fontSize: 12 }}>
            ระดับชั้น: {record.grades.join(", ")}
          </Text>
        </Space>
      ),
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: string) => {
        const config: Record<string, { color: string; text: string; icon: ReactNode }> = {
          ACTIVE: { color: "green", text: "กำลังเปิดรับ", icon: <CheckCircleOutlined /> },
          CLOSED: { color: "default", text: "ปิดรับแล้ว", icon: <StopOutlined /> },
          DRAFT: { color: "orange", text: "ฉบับร่าง", icon: <ClockCircleOutlined /> },
        };
        const current = config[status];
        return (
          <Tag color={current.color} icon={current.icon}>
            {current.text}
          </Tag>
        );
      },
    },
    {
      title: "สถิติการเข้าชม",
      key: "stats",
      width: 250,
      render: (_: unknown, record: JobRecord) => (
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="ยอดเข้าชม"
              value={record.views}
              prefix={<EyeOutlined />}
              styles={{ content: { fontSize: 16 } }}
            />
          </Col>
          <Col span={12}>
            <Badge count={record.newApplicants} offset={[10, 0]}>
              <Statistic
                title="ผู้สมัคร"
                value={record.applicants}
                prefix={<UserAddOutlined />}
                styles={{ content: { fontSize: 16 } }}
              />
            </Badge>
          </Col>
        </Row>
      ),
    },
    {
      title: "วันที่ลงประกาศ",
      dataIndex: "publishedAt",
      key: "publishedAt",
      width: 160,
      render: (date: string, record: JobRecord) => (
        <Space orientation="vertical" size={0}>
          <Text style={{ fontSize: 14 }}>{date}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            หมดอายุ: {record.expiresAt}
          </Text>
        </Space>
      ),
    },
    {
      title: "จัดการ",
      key: "action",
      width: 180,
      render: (_: unknown, record: JobRecord) => (
        <Space size="middle">
          <Tooltip title="แก้ไขประกาศ">
            <Link href={`/pages/employer/job/post/${record.key}`}>
              <Button icon={<EditOutlined />} />
            </Link>
          </Tooltip>
          <Tooltip title="ดูสถิติเชิงลึก">
            <Button icon={<BarChartOutlined />} />
          </Tooltip>
          <Tooltip title="ปิดรับสมัคร">
            <Button danger icon={<StopOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      variant="borderless"
      style={{ borderRadius: 12, overflow: "hidden" }}
    >
      <Table
        columns={columns}
        dataSource={filteredJobs}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: <Empty description="ไม่พบข้อมูลงานที่ประกาศ" /> }}
      />
    </Card>
  );
};
