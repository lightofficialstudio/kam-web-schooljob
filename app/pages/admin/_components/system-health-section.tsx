"use client";

import {
  ApiOutlined,
  CheckCircleOutlined,
  ControlOutlined,
  DatabaseOutlined,
  FileOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Divider,
  Flex,
  Progress,
  Row,
  Space,
  Tag,
  Typography,
  theme,
} from "antd";

const { Text } = Typography;

// ✨ [System Health Section — แสดงสถานะระบบแต่ละส่วน]
export function SystemHealthSection() {
  const { token } = theme.useToken();

  const services = [
    {
      icon: <DatabaseOutlined style={{ color: token.colorPrimary }} />,
      label: "ฐานข้อมูล PostgreSQL",
      tagLabel: "เชื่อมต่อ",
      barColor: token.colorSuccess,
      percent: 100,
      barLabel: "ปกติ",
    },
    {
      icon: <ApiOutlined style={{ color: token.colorInfo }} />,
      label: "Next.js API Server",
      tagLabel: "ทำงาน",
      barColor: token.colorInfo,
      percent: 100,
      barLabel: "ใช้งานได้",
    },
    {
      icon: <SafetyOutlined style={{ color: token.colorWarning }} />,
      label: "ระบบยืนยันตัวตน",
      tagLabel: "ใช้งานอยู่",
      barColor: token.colorWarning,
      percent: 100,
      barLabel: "ปลอดภัย",
    },
    {
      icon: <FileOutlined style={{ color: token.colorError }} />,
      label: "พื้นที่เก็บข้อมูล",
      tagLabel: "45%",
      barColor: token.colorError,
      percent: 45,
      barLabel: "ใช้งาน",
    },
  ];

  return (
    <Card
      title={
        <Space>
          <ControlOutlined />
          <Text strong>สถานะระบบ</Text>
        </Space>
      }
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Flex vertical gap={0}>
        {services.map((svc, i) => (
          <div key={svc.label}>
            {i > 0 && <Divider style={{ margin: "12px 0" }} />}
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: 8 }}
            >
              <Col>
                <Space>
                  {svc.icon}
                  <Text strong>{svc.label}</Text>
                </Space>
              </Col>
              <Col>
                <Tag color="success" icon={<CheckCircleOutlined />}>
                  {svc.tagLabel}
                </Tag>
              </Col>
            </Row>
            <Progress
              percent={svc.percent}
              strokeColor={svc.barColor}
              format={(pct) => `${pct}% ${svc.barLabel}`}
            />
          </div>
        ))}
      </Flex>
    </Card>
  );
}
