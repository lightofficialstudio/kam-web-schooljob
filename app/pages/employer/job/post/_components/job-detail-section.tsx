"use client";

import { FileTextOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Form, Input, Row, Select, Space, theme } from "antd";

const { Option } = Select;

// ส่วนกรอกรายละเอียดงานและเงื่อนไขผู้สมัคร
export const JobDetailSection = () => {
  const { token } = theme.useToken();

  return (
    <>
      <Card
        title={
          <Space>
            <FileTextOutlined style={{ color: token.colorWarning }} />
            รายละเอียดงาน
          </Space>
        }
        variant="borderless"
        style={{ borderRadius: 16, border: `1px solid ${token.colorBorderSecondary}` }}
      >
        <Form.Item
          label="รายละเอียดความรับผิดชอบ"
          name="description"
          rules={[{ required: true, message: "กรุณาระบุรายละเอียดงาน" }]}
        >
          <Input.TextArea rows={6} placeholder="รายละเอียดหน้าที่ความรับผิดชอบ และเนื้องานเบื้องต้น..." />
        </Form.Item>
      </Card>

      <Card
        title={
          <Space>
            <UserOutlined style={{ color: token.colorError }} />
            เงื่อนไขผู้สมัคร
          </Space>
        }
        variant="borderless"
        style={{ borderRadius: 16, border: `1px solid ${token.colorBorderSecondary}` }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item label="ระดับการศึกษา" name="educationLevel">
              <Select size="large" placeholder="เลือกวุฒิการศึกษา">
                <Option value="ไม่กำหนด">ไม่กำหนด</Option>
                <Option value="มัธยมศึกษา/ปวช">มัธยมศึกษา / ปวช.</Option>
                <Option value="ปริญญาตรีขึ้นไป">ปริญญาตรีขึ้นไป</Option>
                <Option value="ปริญญาโทขึ้นไป">ปริญญาโทขึ้นไป</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="ประสบการณ์สอน" name="experience">
              <Select size="large" placeholder="เลือกประสบการณ์">
                <Option value="ไม่กำหนด">ไม่กำหนด</Option>
                <Option value="น้อยกว่า 1 ปี">น้อยกว่า 1 ปี</Option>
                <Option value="1 - 3 ปี">1 - 3 ปี</Option>
                <Option value="3 - 5 ปี">3 - 5 ปี</Option>
                <Option value="5 - 10 ปี">5 - 10 ปี</Option>
                <Option value="มากกว่า 10 ปี">มากกว่า 10 ปี</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="ใบอนุญาตประกอบวิชาชีพครู" name="license">
              <Select size="large" placeholder="เลือกเงื่อนไข">
                <Option value="ไม่จำเป็นต้องมี">ไม่จำเป็นต้องมี</Option>
                <Option value="จำเป็นต้องมี">จำเป็นต้องมี</Option>
                <Option value="ยินดีรับผู้ที่กำลังดำเนินการ">ยินดีรับผู้ที่กำลังดำเนินการ</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="เพศ" name="gender">
              <Select size="large">
                <Option value="ไม่จำกัด">ไม่จำกัด</Option>
                <Option value="ชาย">ชาย</Option>
                <Option value="หญิง">หญิง</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="คุณสมบัติเพิ่มเติม" name="qualifications">
              <Input.TextArea placeholder="ระบุรายละเอียดเพิ่มเติม เช่น มีอัธยาศัยดี สอนสนุก รักเด็ก" />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </>
  );
};
