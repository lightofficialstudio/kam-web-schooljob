"use client";

import {
  ArrowUpOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  StopOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Empty,
  Input,
  Row,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Title, Text } = Typography;

// Mock Data สำหรับงานที่โพสต์
const MOCK_JOBS = [
  {
    key: "1",
    title: "ครูสอนภาษาอังกฤษ (Full-time)",
    subjects: ["ภาษาอังกฤษ", "Conversation"],
    grades: ["มัธยมต้น", "มัธยมปลาย"],
    publishedAt: "2026-03-01",
    expiresAt: "2026-03-31",
    status: "ACTIVE",
    views: 1240,
    applicants: 45,
    newApplicants: 12,
    conversionRate: "3.6%",
    salary: "25,000 - 35,000 บาท",
  },
  {
    key: "2",
    title: "ครูสอนคณิตศาสตร์ (Part-time)",
    subjects: ["คณิตศาสตร์", "Calculus"],
    grades: ["มัธยมปลาย"],
    publishedAt: "2026-02-15",
    expiresAt: "2026-03-15",
    status: "ACTIVE",
    views: 850,
    applicants: 18,
    newApplicants: 3,
    conversionRate: "2.1%",
    salary: "ตามตกลง",
  },
  {
    key: "3",
    title: "ครูประจำชั้นอนุบาล 3",
    subjects: ["ปฐมวัย"],
    grades: ["อนุบาล"],
    publishedAt: "2025-12-01",
    expiresAt: "2026-01-01",
    status: "CLOSED",
    views: 2100,
    applicants: 89,
    newApplicants: 0,
    conversionRate: "4.2%",
    salary: "18,000 - 22,000 บาท",
  },
];

export default function MyJobsPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: "รายละเอียดงาน",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: "16px", color: "#1890ff" }}>
            {text}
          </Text>
          <Space wrap>
            {record.subjects.map((s: string) => (
              <Tag key={s} color="blue" bordered={false}>
                {s}
              </Tag>
            ))}
          </Space>
          <Text type="secondary" size="small">
            ระดับชั้น: {record.grades.join(", ")}
          </Text>
        </Space>
      ),
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const config = {
          ACTIVE: {
            color: "green",
            text: "กำลังเปิดรับ",
            icon: <CheckCircleOutlined />,
          },
          CLOSED: {
            color: "default",
            text: "ปิดรับแล้ว",
            icon: <StopOutlined />,
          },
          DRAFT: {
            color: "orange",
            text: "ฉบับร่าง",
            icon: <ClockCircleOutlined />,
          },
        };
        const current = config[status as keyof typeof config];
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
      render: (record: any) => (
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="ยอดเข้าชม"
              value={record.views}
              prefix={<EyeOutlined />}
              valueStyle={{ fontSize: "16px" }}
            />
          </Col>
          <Col span={12}>
            <Badge count={record.newApplicants} offset={[10, 0]}>
              <Statistic
                title="ผู้สมัคร"
                value={record.applicants}
                prefix={<UserAddOutlined />}
                valueStyle={{ fontSize: "16px" }}
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
      width: 150,
      render: (date: string) => (
        <Space direction="vertical" size={0}>
          <Text size="small">{date}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            หมดอายุ: {MOCK_JOBS.find((j) => j.publishedAt === date)?.expiresAt}
          </Text>
        </Space>
      ),
    },
    {
      title: "จัดการ",
      key: "action",
      width: 180,
      render: () => (
        <Space size="middle">
          <Tooltip title="แก้ไขประกาศ">
            <Button icon={<EditOutlined />} />
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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f7f9",
        paddingBottom: "100px",
      }}
    >
      {/* Header section */}
      <div
        style={{
          backgroundColor: "white",
          padding: "24px 0",
          borderBottom: "1px solid #e5e7eb",
          marginBottom: "32px",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}
        >
          <Breadcrumb
            items={[
              { title: <Link href="/pages/admin">แดชบอร์ด</Link> },
              { title: "การจัดการงาน" },
              { title: "งานของฉัน" },
            ]}
          />
          <Row
            justify="space-between"
            align="middle"
            style={{ marginTop: "16px" }}
          >
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                งานของฉัน (My Job Listings)
              </Title>
              <Text type="secondary">
                จัดการและติดตามสถานะประกาศรับสมัครงานของคุณ
              </Text>
            </Col>
            <Col>
              <Link href="/pages/employer/job/create">
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  style={{
                    backgroundColor: "#e60278",
                    borderColor: "#e60278",
                    borderRadius: "8px",
                  }}
                >
                  ลงประกาศงานใหม่
                </Button>
              </Link>
            </Col>
          </Row>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Overall Statistics */}
        <Row gutter={24} style={{ marginBottom: "32px" }}>
          <Col span={6}>
            <Card variant="borderless" style={{ borderRadius: "12px" }}>
              <Statistic
                title="งานที่กำลังเปิดรับ"
                value={2}
                valueStyle={{ color: "#3f8600" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card variant="borderless" style={{ borderRadius: "12px" }}>
              <Statistic
                title="ยอดเข้าชมรวมทั้งหมด"
                value={4190}
                prefix={<EyeOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card variant="borderless" style={{ borderRadius: "12px" }}>
              <Statistic
                title="ผู้สมัครทั้งหมด"
                value={152}
                prefix={<UserAddOutlined />}
                suffix={
                  <Text type="success" style={{ fontSize: "14px" }}>
                    <ArrowUpOutlined /> 12%
                  </Text>
                }
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card variant="borderless" style={{ borderRadius: "12px" }}>
              <Statistic
                title="อัตราการสมัคร (CV Rate)"
                value={3.6}
                precision={1}
                suffix="%"
                prefix={<BarChartOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters & Search */}
        <Card
          variant="borderless"
          style={{ borderRadius: "12px", marginBottom: "24px" }}
        >
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Input
                placeholder="ค้นหาตามชื่อตำแหน่งงาน หรือวิชาที่สอน..."
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                size="large"
                style={{ borderRadius: "8px" }}
              />
            </Col>
            <Col>
              <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    key: "1",
                    label: `เปิดรับสมัคร (${MOCK_JOBS.filter((j) => j.status === "ACTIVE").length})`,
                  },
                  { key: "2", label: "ปิดรับสมัครแล้ว" },
                  { key: "3", label: "ฉบับร่าง" },
                ]}
              />
            </Col>
          </Row>
        </Card>

        {/* Job Table */}
        <Card
          variant="borderless"
          style={{ borderRadius: "12px", overflow: "hidden" }}
        >
          <Table
            columns={columns}
            dataSource={MOCK_JOBS}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="ไม่พบข้อมูลงานที่ประกาศ" />,
            }}
          />
        </Card>
      </div>
    </div>
  );
}
