"use client";

import { Card, Col, Form, Row, Select, Space, Switch, Typography, theme } from "antd";

const { Option } = Select;
const { Text } = Typography;

// ส่วนตั้งค่าประกาศ: ระยะเวลา, สถานะเปิด/ปิดรับสมัคร
export const PostSettingsSection = () => {
  const { token } = theme.useToken();

  return (
    <Card
      variant="borderless"
      style={{ borderRadius: 16, border: `1px solid ${token.colorBorderSecondary}` }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={12}>
          <Form.Item
            label="ระยะเวลาประกาศ"
            name="duration"
            rules={[{ required: true, message: "กรุณาเลือกระยะเวลา" }]}
          >
            <Select size="large">
              <Option value={30}>30 วัน</Option>
              <Option value={60}>60 วัน</Option>
              <Option value={90}>90 วัน</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="สถานะประกาศ"
            name="status"
            valuePropName="checked"
          >
            <Space size={12}>
              <Switch defaultChecked />
              <Text type="secondary">เปิด / ปิด การรับสมัคร</Text>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};
