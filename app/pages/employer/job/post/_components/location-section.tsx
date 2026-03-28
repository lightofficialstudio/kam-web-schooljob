"use client";

import { EnvironmentOutlined } from "@ant-design/icons";
import { Alert, Card, Col, Form, Input, Row, Space, theme } from "antd";

// ส่วนกรอกสถานที่ทำงาน: จังหวัด, เขต, ที่อยู่
export const LocationSection = () => {
  const { token } = theme.useToken();

  return (
    <Card
      title={
        <Space>
          <EnvironmentOutlined style={{ color: token.colorError }} />
          สถานที่ทำงาน
        </Space>
      }
      variant="borderless"
      style={{ borderRadius: 16, border: `1px solid ${token.colorBorderSecondary}` }}
    >
      <Alert
        description="ระบบจะดึงข้อมูลเริ่มต้นจาก School Profile ของคุณ หากสถาบันมีหลายสาขา สามารถแก้ไขที่อยู่สำหรับประกาศนี้ได้โดยเฉพาะ"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="จังหวัด"
            name="province"
            rules={[{ required: true, message: "กรุณาระบุจังหวัด" }]}
          >
            <Input size="large" placeholder="ระบุจังหวัด" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="เขต/พื้นที่"
            name="area"
            rules={[{ required: true, message: "กรุณาระบุเขต/พื้นที่" }]}
          >
            <Input size="large" placeholder="ระบุเขต/พื้นที่" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="ที่อยู่สถาบัน (ระบุสาขาถ้ามี)"
            name="address"
            rules={[{ required: true, message: "กรุณาระบุที่อยู่" }]}
          >
            <Input.TextArea
              rows={2}
              placeholder="เช่น เลขที่ 123 อาคารเรียนสีขาว ถ.พหลโยธิน แขวงลาดยาว (สาขาจตุจักร)"
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};
