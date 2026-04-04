"use client";

import { CheckOutlined, DesktopOutlined } from "@ant-design/icons";
import { Card, Col, Divider, Flex, Row, Space, Typography, theme } from "antd";

const { Text } = Typography;

// ✨ [System Info Section — แสดงข้อมูลเชิงเทคนิคของ server]
export function SystemInfoSection() {
  const { token } = theme.useToken();

  const infos = [
    { label: "Platform Version", value: "v1.0.0", color: token.colorText },
    {
      label: "Server Uptime",
      value: "99.9%",
      color: token.colorSuccess,
      prefix: <CheckOutlined />,
    },
    { label: "Last Backup", value: "2 ชั่วโมงที่แล้ว", color: token.colorText },
    { label: "Active Connections", value: "1", color: token.colorText },
    { label: "Database Size", value: "~2.5 MB", color: token.colorText },
    { label: "Avg Response Time", value: "145ms", color: token.colorPrimary },
  ];

  return (
    <Card
      title={
        <Space>
          <DesktopOutlined />
          <Text strong>ข้อมูลระบบ</Text>
        </Space>
      }
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Flex vertical gap={0}>
        {infos.map((info, i) => (
          <div key={info.label}>
            {i > 0 && <Divider style={{ margin: "10px 0" }} />}
            <Row justify="space-between" align="middle">
              <Col>
                <Text type="secondary">{info.label}</Text>
              </Col>
              <Col>
                <Text strong style={{ color: info.color }}>
                  {info.prefix && <>{info.prefix}&nbsp;</>}
                  {info.value}
                </Text>
              </Col>
            </Row>
          </div>
        ))}
      </Flex>
    </Card>
  );
}
