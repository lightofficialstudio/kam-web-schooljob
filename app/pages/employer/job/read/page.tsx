"use client";

import {
  ArrowRightOutlined,
  ArrowUpOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  StopOutlined,
  ThunderboltOutlined,
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
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  theme,
  Tooltip,
  Typography,
} from "antd";
import Link from "next/link";

const { Title, Text } = Typography;
const { useToken } = theme;

interface JobRecord {
  key: string;
  title: string;
  subjects: string[];
  grades: string[];
  publishedAt: string;
  expiresAt: string;
  status: string;
  views: number;
  applicants: number;
  newApplicants: number;
  conversionRate: string;
  salary: string;
}

// Mock Data สำหรับงานที่โพสต์
const MOCK_JOBS: JobRecord[] = [
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
  const { token } = useToken();

  const columns = [
    {
      title: "รายละเอียดงาน",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: JobRecord) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: "16px", color: token.colorPrimary }}>
            {text}
          </Text>
          <Space wrap>
            {record.subjects.map((s: string) => (
              <Tag key={s} color="blue" variant="filled">
                {s}
              </Tag>
            ))}
          </Space>
          <Text type="secondary" style={{ fontSize: "12px" }}>
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
      render: (record: JobRecord) => (
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="ยอดเข้าชม"
              value={record.views}
              prefix={<EyeOutlined />}
              styles={{ content: { fontSize: "16px" } }}
            />
          </Col>
          <Col span={12}>
            <Badge count={record.newApplicants} offset={[10, 0]}>
              <Statistic
                title="ผู้สมัคร"
                value={record.applicants}
                prefix={<UserAddOutlined />}
                styles={{ content: { fontSize: "16px" } }}
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
          <Text style={{ fontSize: "14px" }}>{date}</Text>
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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: token.colorBgLayout,
        paddingBottom: "100px",
      }}
    >
      {/* Header section */}
      <div
        style={{
          backgroundColor: token.colorBgContainer,
          padding: "24px 0",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
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
              <Link href="/pages/employer/job/post">
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  style={{
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
        {/* ✨ [New Section] Recruitment Insights Header */}
        <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
          <Col xs={24} lg={16}>
            <Card
              variant="borderless"
              style={{
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryHover} 100%)`,
                color: "#fff",
              }}
            >
              <Row gutter={24} align="middle">
                <Col flex="auto">
                  <Title level={3} style={{ color: "#fff", margin: 0 }}>
                    ความสำเร็จในการรับสมัคร <ThunderboltOutlined />
                  </Title>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      fontSize: "16px",
                    }}
                  >
                    ในเดือนนี้คุณได้รับผู้สมัครใหม่เพิ่มขึ้น 24% จากเดือนที่แล้ว
                  </Text>
                  <div style={{ marginTop: "24px" }}>
                    <Space size={32}>
                      <Statistic
                        title={
                          <span style={{ color: "rgba(255,255,255,0.65)" }}>
                            สัมภาษณ์แล้ว
                          </span>
                        }
                        value={12}
                        styles={{ content: { color: "#fff" } }}
                        suffix={
                          <span
                            style={{
                              fontSize: "14px",
                              color: "rgba(255,255,255,0.65)",
                            }}
                          >
                            คน
                          </span>
                        }
                      />
                      <Statistic
                        title={
                          <span style={{ color: "rgba(255,255,255,0.65)" }}>
                            ตอบรับเข้าทำงาน
                          </span>
                        }
                        value={4}
                        styles={{ content: { color: "#fff" } }}
                        suffix={
                          <span
                            style={{
                              fontSize: "14px",
                              color: "rgba(255,255,255,0.65)",
                            }}
                          >
                            คน
                          </span>
                        }
                      />
                    </Space>
                  </div>
                </Col>
                <Col>
                  <Progress
                    type="circle"
                    percent={75}
                    strokeColor="#fff"
                    railColor="rgba(255,255,255,0.2)"
                    format={(percent) => (
                      <div style={{ color: "#fff" }}>
                        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                          {percent}%
                        </div>
                        <div style={{ fontSize: "10px" }}>เป้าหมาย</div>
                      </div>
                    )}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card
              title={
                <Space>
                  <CheckOutlined /> รีบด่วน (Urgent Action)
                </Space>
              }
              variant="borderless"
              style={{ borderRadius: "16px", height: "100%" }}
            >
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {[
                  {
                    title: "มีผู้สมัครใหม่ 5 คน",
                    desc: "ตำแหน่งครูอังกฤษ",
                    time: "2 ชม. ที่แล้ว",
                  },
                  {
                    title: "ประกาศกำลังจะหมดอายุ",
                    desc: "ตำแหน่งครูอนุบาล",
                    time: "ใน 2 วัน",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "12px 0",
                      borderBottom:
                        index === 1
                          ? "none"
                          : `1px solid ${token.colorBorderSecondary}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "13px" }}>
                        {item.title}
                      </div>
                      <div
                        style={{
                          color: token.colorTextSecondary,
                          fontSize: "12px",
                        }}
                      >
                        {item.desc} • {item.time}
                      </div>
                    </div>
                    <Button
                      type="link"
                      size="small"
                      icon={<ArrowRightOutlined />}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Overall Statistics */}
        <Row gutter={24} style={{ marginBottom: "32px" }}>
          <Col span={6}>
            <Card variant="borderless" style={{ borderRadius: "12px" }}>
              <Statistic
                title="งานที่กำลังเปิดรับ"
                value={2}
                styles={{ content: { color: "#3f8600" } }}
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
        <Row gutter={24} align="middle" style={{ marginBottom: "24px" }}>
          <Col flex="auto">
            <Card variant="borderless" style={{ borderRadius: "12px" }}>
              <Row gutter={16} align="middle">
                <Col flex="auto">
                  <Input
                    placeholder="ค้นหาตามชื่อตำแหน่งงาน หรือวิชาที่สอน..."
                    prefix={
                      <SearchOutlined
                        style={{ color: token.colorTextPlaceholder }}
                      />
                    }
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
                        label: `เปิดรับสมัคร (${MOCK_JOBS.filter((j: JobRecord) => j.status === "ACTIVE").length})`,
                      },
                      { key: "2", label: "ปิดรับสมัครแล้ว" },
                      { key: "3", label: "ฉบับร่าง" },
                    ]}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              variant="borderless"
              style={{
                borderRadius: "12px",
                backgroundColor: token.colorWarningBg,
                border: `1px solid ${token.colorWarningBorder}`,
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
              styles={{ body: { padding: "12px 20px" } }}
            >
              <Space direction="vertical" size={2}>
                <Text type="warning" strong style={{ fontSize: "12px" }}>
                  <ThunderboltOutlined /> แนะนำด่วน
                </Text>
                <Text style={{ fontSize: "14px" }}>
                  เพิ่ม <b>&quot;สวัสดิการ&quot;</b> ในประกาศ <br />
                  เพื่อดึงดูดผู้สมัครเพิ่ม <b>30%</b>
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>

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
