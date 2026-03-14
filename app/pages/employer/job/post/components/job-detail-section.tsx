"use client";

import { FileTextOutlined } from "@ant-design/icons";
import { Card, Col, Form, Input, Row, Select, Space, theme } from "antd";

const { Option } = Select;
const { TextArea } = Input;

export default function JobDetailSection() {
  const { token } = theme.useToken();

  return (
    <Card
      title={
        <Space>
          <FileTextOutlined style={{ color: token.colorWarning }} />{" "}
          รายละเอียดงาน
        </Space>
      }
      variant="borderless"
      style={{
        borderRadius: "16px",
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="คำอธิบายงาน"
            name="description"
            rules={[{ required: true, message: "กรุณาระบุรายละเอียดงาน" }]}
          >
            <TextArea
              rows={6}
              placeholder="ระบุรายละเอียดงาน หน้าที่ความรับผิดชอบ..."
              style={{ borderRadius: "12px" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="วุฒิการศึกษา"
            name="educationLevel"
            rules={[{ required: true, message: "กรุณาระบุวุฒิการศึกษา" }]}
          >
            <Select size="large" placeholder="เลือกวุฒิการศึกษา">
              <Option value="ปวช.">ปวช.</Option>
              <Option value="ปวส.">ปวส.</Option>
              <Option value="ปริญญาตรีขึ้นไป">ปริญญาตรีขึ้นไป</Option>
              <Option value="ปริญญาโท">ปริญญาโท</Option>
              <Option value="ปริญญาเอก">ปริญญาเอก</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="ประสบการณ์"
            name="experience"
            rules={[{ required: true, message: "กรุณาระบุประสบการณ์" }]}
          >
            <Select size="large" placeholder="ระบุประสบการณ์">
              <Option value="ยินดีรับนักศึกษาจบใหม่">
                ยินดีรับนักศึกษาจบใหม่
              </Option>
              <Option value="1-3 ปี">1-3 ปี</Option>
              <Option value="3-5 ปี">3-5 ปี</Option>
              <Option value="5 ปีขึ้นไป">5 ปีขึ้นไป</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="ใบอนุญาตประกอบวิชาชีพครู"
            name="license"
            rules={[{ required: true }]}
          >
            <Select size="large">
              <Option value="ต้องมี">ต้องมี</Option>
              <Option value="ไม่จำเป็น">ไม่จำเป็น</Option>
              <Option value="กำลังดำเนินการ">กำลังดำเนินการ</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="เพศ" name="gender" rules={[{ required: true }]}>
            <Select size="large">
              <Option value="ไม่จำกัด">ไม่จำกัด</Option>
              <Option value="ชาย">ชาย</Option>
              <Option value="หญิง">หญิง</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
