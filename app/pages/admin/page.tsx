"use client";

import {
  ApiOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  ControlOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  FileOutlined,
  HomeOutlined,
  LineChartOutlined,
  ProjectOutlined,
  SafetyOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import {
  Card,
  Col,
  Divider,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
} from "antd";

/**
 * 📊 Admin Dashboard - Complete System Overview
 */
export default function AdminPage() {
  // Mock data for recent activities
  const recentActivities = [
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

  const activityColumns: TableColumnsType = [
    {
      title: "กิจกรรม",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "ผู้ใช้",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "เวลา",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const tagColor =
          status === "success"
            ? "green"
            : status === "info"
              ? "#11b6f5"
              : "red";
        return <Tag color={tagColor}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {/* ✨ [Welcome Header] */}
      <Col xs={24}>
        <Card
          style={{
            background: "linear-gradient(135deg, #11b6f5 0%, #0ea5e0 100%)",
            border: "none",
            color: "white",
            borderRadius: "8px",
          }}
        >
          <Row align="middle" gutter={16}>
            <Col>
              <DesktopOutlined style={{ fontSize: "32px", color: "white" }} />
            </Col>
            <Col>
              <h2
                style={{
                  color: "white",
                  marginBottom: "4px",
                  fontSize: "24px",
                  margin: 0,
                }}
              >
                แดชบอร์ดแอดมิน KAM School Job Platform
              </h2>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  marginBottom: 0,
                  fontSize: "14px",
                }}
              >
                ยินดีต้อนรับ! นี่คือศูนย์ควบคุมระบบของคุณ
              </p>
            </Col>
          </Row>
        </Card>
      </Col>

      {/* ✨ [Key Statistics - Row 1] */}
      <Col xs={24} sm={12} lg={6}>
        <Card style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
          <Statistic
            title="จำนวนผู้ใช้ทั้งหมด"
            value={2}
            prefix={<UserOutlined style={{ color: "#11b6f5" }} />}
            suffix="คน"
            valueStyle={{ color: "#11b6f5", fontSize: "28px", fontWeight: 600 }}
          />
          <div style={{ marginTop: "12px", fontSize: "12px" }}>
            <span style={{ color: "#95de64" }}>
              <CheckOutlined /> 2 ยืนยันตัวตน
            </span>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
          <Statistic
            title="ผู้ดูแลระบบ"
            value={1}
            prefix={<SafetyOutlined style={{ color: "#ff4d4f" }} />}
            suffix="คน"
            valueStyle={{ color: "#ff4d4f", fontSize: "28px", fontWeight: 600 }}
          />
          <div style={{ marginTop: "12px", fontSize: "12px" }}>
            <span style={{ color: "#ff7a45" }}>
              <CloseOutlined /> ไม่มีขอการอนุญาต
            </span>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
          <Statistic
            title="โรงเรียน"
            value={0}
            prefix={<HomeOutlined style={{ color: "#faad14" }} />}
            suffix="แห่ง"
            valueStyle={{ color: "#faad14", fontSize: "28px", fontWeight: 600 }}
          />
          <div style={{ marginTop: "12px", fontSize: "12px" }}>
            <span style={{ color: "#ffc53d" }}>
              <ClockCircleOutlined /> รอการตรวจสอบ
            </span>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
          <Statistic
            title="ครู"
            value={1}
            prefix={<TeamOutlined style={{ color: "#13c2c2" }} />}
            suffix="คน"
            valueStyle={{ color: "#13c2c2", fontSize: "28px", fontWeight: 600 }}
          />
          <div style={{ marginTop: "12px", fontSize: "12px" }}>
            <span style={{ color: "#2fd9d9" }}>
              <CheckOutlined /> 1 ใช้งานอยู่
            </span>
          </div>
        </Card>
      </Col>

      {/* ✨ [Statistics - Row 2] */}
      <Col xs={24} sm={12} lg={6}>
        <Card style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
          <Statistic
            title="งานที่เผยแพร่"
            value={0}
            prefix={<ProjectOutlined style={{ color: "#722ed1" }} />}
            suffix="รายการ"
            valueStyle={{ color: "#722ed1", fontSize: "28px", fontWeight: 600 }}
          />
          <div style={{ marginTop: "12px", fontSize: "12px" }}>
            <span style={{ color: "#b37feb" }}>
              <FileOutlined /> 0 อยู่ระหว่างการพิจารณา
            </span>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
          <Statistic
            title="ฐานข้อมูล"
            value={1}
            prefix={<DatabaseOutlined style={{ color: "#eb2f96" }} />}
            suffix="ฐาน"
            valueStyle={{ color: "#eb2f96", fontSize: "28px", fontWeight: 600 }}
          />
          <div style={{ marginTop: "12px", fontSize: "12px" }}>
            <span style={{ color: "#31274f" }}>
              <CheckCircleOutlined style={{ color: "#52c41a" }} /> เชื่อมต่อ
            </span>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
          <Statistic
            title="เซสชั่นใช้งาน"
            value={1}
            prefix={<AppstoreOutlined style={{ color: "#52c41a" }} />}
            suffix="เซสชั่น"
            valueStyle={{ color: "#52c41a", fontSize: "28px", fontWeight: 600 }}
          />
          <div style={{ marginTop: "12px", fontSize: "12px" }}>
            <span style={{ color: "#135200" }}>
              <CheckOutlined /> ทำงานปกติ
            </span>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
          <Statistic
            title="API Response"
            value={145}
            prefix={<ApiOutlined style={{ color: "#11b6f5" }} />}
            suffix="ms"
            valueStyle={{ color: "#11b6f5", fontSize: "28px", fontWeight: 600 }}
          />
          <div style={{ marginTop: "12px", fontSize: "12px" }}>
            <span style={{ color: "#11b6f5" }}>
              <LineChartOutlined /> ปกติ
            </span>
          </div>
        </Card>
      </Col>

      {/* ✨ [System Health Status] */}
      <Col xs={24} lg={12}>
        <Card
          title={
            <Space>
              <ControlOutlined style={{ fontSize: "18px" }} />
              <span>สถานะระบบ</span>
            </Space>
          }
          style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            {/* Database */}
            <div>
              <Row
                justify="space-between"
                align="middle"
                style={{ marginBottom: "8px" }}
              >
                <Col>
                  <Space>
                    <DatabaseOutlined
                      style={{ color: "#11b6f5", fontSize: "16px" }}
                    />
                    <span style={{ fontWeight: 500 }}>
                      ฐานข้อมูล PostgreSQL
                    </span>
                  </Space>
                </Col>
                <Col>
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    เชื่อมต่อ
                  </Tag>
                </Col>
              </Row>
              <Progress
                percent={100}
                strokeColor="#52c41a"
                format={(percent) => `${percent}% ปกติ`}
              />
            </div>

            <Divider style={{ margin: "0" }} />

            {/* API Server */}
            <div>
              <Row
                justify="space-between"
                align="middle"
                style={{ marginBottom: "8px" }}
              >
                <Col>
                  <Space>
                    <ApiOutlined
                      style={{ color: "#13c2c2", fontSize: "16px" }}
                    />
                    <span style={{ fontWeight: 500 }}>Next.js API Server</span>
                  </Space>
                </Col>
                <Col>
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    ทำงาน
                  </Tag>
                </Col>
              </Row>
              <Progress
                percent={100}
                strokeColor="#13c2c2"
                format={(percent) => `${percent}% ใช้งานได้`}
              />
            </div>

            <Divider style={{ margin: "0" }} />

            {/* Authentication */}
            <div>
              <Row
                justify="space-between"
                align="middle"
                style={{ marginBottom: "8px" }}
              >
                <Col>
                  <Space>
                    <SafetyOutlined
                      style={{ color: "#faad14", fontSize: "16px" }}
                    />
                    <span style={{ fontWeight: 500 }}>ระบบยืนยันตัวตน</span>
                  </Space>
                </Col>
                <Col>
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    ใช้งานอยู่
                  </Tag>
                </Col>
              </Row>
              <Progress
                percent={100}
                strokeColor="#faad14"
                format={(percent) => `${percent}% ปลอดภัย`}
              />
            </div>

            <Divider style={{ margin: "0" }} />

            {/* Storage */}
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: "8px" }}
            >
              <Col>
                <Space>
                  <FileOutlined
                    style={{ color: "#eb2f96", fontSize: "16px" }}
                  />
                  <span style={{ fontWeight: 500 }}>พื้นที่เก็บข้อมูล</span>
                </Space>
              </Col>
              <Col>
                <Tag color="#11b6f5">45%</Tag>
              </Col>
            </Row>
            <Progress
              percent={45}
              strokeColor="#eb2f96"
              format={(percent) => `${percent}% ใช้งาน`}
            />
          </Space>
        </Card>
      </Col>

      {/* ✨ [System Information Panel] */}
      <Col xs={24} lg={12}>
        <Card
          title={
            <Space>
              <DesktopOutlined style={{ fontSize: "18px" }} />
              <span>ข้อมูลระบบ</span>
            </Space>
          }
          style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}
        >
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            <Row justify="space-between">
              <Col>
                <span style={{ color: "rgba(0, 0, 0, 0.65)" }}>
                  Platform Version
                </span>
              </Col>
              <Col style={{ fontWeight: 600 }}>v1.0.0</Col>
            </Row>

            <Divider style={{ margin: "0" }} />

            <Row justify="space-between">
              <Col>
                <span style={{ color: "rgba(0, 0, 0, 0.65)" }}>
                  Server Uptime
                </span>
              </Col>
              <Col style={{ fontWeight: 600, color: "#52c41a" }}>
                <CheckOutlined /> 99.9%
              </Col>
            </Row>

            <Divider style={{ margin: "0" }} />

            <Row justify="space-between">
              <Col>
                <span style={{ color: "rgba(0, 0, 0, 0.65)" }}>
                  Last Backup
                </span>
              </Col>
              <Col style={{ fontWeight: 600 }}>2 ชั่วโมงที่แล้ว</Col>
            </Row>

            <Divider style={{ margin: "0" }} />

            <Row justify="space-between">
              <Col>
                <span style={{ color: "rgba(0, 0, 0, 0.65)" }}>
                  Active Connections
                </span>
              </Col>
              <Col style={{ fontWeight: 600 }}>1</Col>
            </Row>

            <Divider style={{ margin: "0" }} />

            <Row justify="space-between">
              <Col>
                <span style={{ color: "rgba(0, 0, 0, 0.65)" }}>
                  Database Size
                </span>
              </Col>
              <Col style={{ fontWeight: 600 }}>~2.5 MB</Col>
            </Row>

            <Divider style={{ margin: "0" }} />

            <Row justify="space-between">
              <Col>
                <span style={{ color: "rgba(0, 0, 0, 0.65)" }}>
                  Avg Response Time
                </span>
              </Col>
              <Col style={{ fontWeight: 600, color: "#11b6f5" }}>145ms</Col>
            </Row>
          </Space>
        </Card>
      </Col>

      {/* ✨ [Recent Activities Table] */}
      <Col xs={24}>
        <Card
          title={
            <Space>
              <CalendarOutlined style={{ fontSize: "18px" }} />
              <span>กิจกรรมล่าสุด</span>
            </Space>
          }
          style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}
        >
          <Table
            columns={activityColumns}
            dataSource={recentActivities}
            pagination={false}
            size="small"
          />
        </Card>
      </Col>

      {/* ✨ [Quick Links] */}
      <Col xs={24}>
        <Card
          title={
            <Space>
              <ProjectOutlined style={{ fontSize: "18px" }} />
              <span>การจัดการด่วน</span>
            </Space>
          }
          style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card
                hoverable
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  color: "white",
                  borderRadius: "8px",
                }}
              >
                <Row align="middle" gutter={8}>
                  <Col>
                    <TeamOutlined style={{ fontSize: "24px" }} />
                  </Col>
                  <Col flex="auto">
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>
                      จัดการผู้ใช้
                    </div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.8)",
                        margin: 0,
                      }}
                    >
                      ดูและจัดการผู้ใช้ทั้งหมด
                    </p>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                hoverable
                style={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  border: "none",
                  color: "white",
                  borderRadius: "8px",
                }}
              >
                <Row align="middle" gutter={8}>
                  <Col>
                    <LineChartOutlined style={{ fontSize: "24px" }} />
                  </Col>
                  <Col flex="auto">
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>
                      ดูรายงาน
                    </div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.8)",
                        margin: 0,
                      }}
                    >
                      การวิเคราะห์ระบบ
                    </p>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                hoverable
                style={{
                  background:
                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  border: "none",
                  color: "white",
                  borderRadius: "8px",
                }}
              >
                <Row align="middle" gutter={8}>
                  <Col>
                    <SafetyOutlined style={{ fontSize: "24px" }} />
                  </Col>
                  <Col flex="auto">
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>
                      ความปลอดภัย
                    </div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.8)",
                        margin: 0,
                      }}
                    >
                      ตั้งค่าความปลอดภัย
                    </p>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                hoverable
                style={{
                  background:
                    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                  border: "none",
                  color: "white",
                  borderRadius: "8px",
                }}
              >
                <Row align="middle" gutter={8}>
                  <Col>
                    <FileOutlined style={{ fontSize: "24px" }} />
                  </Col>
                  <Col flex="auto">
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>
                      ตั้งค่าระบบ
                    </div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.8)",
                        margin: 0,
                      }}
                    >
                      จัดการการตั้งค่า
                    </p>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}
