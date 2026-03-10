import { Col, Form, Input, Row } from "antd";
import React from "react";

interface BasicInfoSectionProps {
  form: any;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  return (
    <div className="py-2">
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="ชื่อ"
            name="firstName"
            rules={[
              {
                required: true,
                message: "กรุณาระบุชื่อ",
              },
              {
                pattern: /^[ก-๙a-zA-Z\s]+$/,
                message: "ชื่อต้องมี ตัวอักษรและพื้นที่ว่างเท่านั้น",
              },
            ]}
          >
            <Input placeholder="ระบุชื่อของคุณ" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label="นามสกุล"
            name="lastName"
            rules={[
              {
                required: true,
                message: "กรุณาระบุนามสกุล",
              },
              {
                pattern: /^[ก-๙a-zA-Z\s]+$/,
                message: "นามสกุลต้องมี ตัวอักษรและพื้นที่ว่างเท่านั้น",
              },
            ]}
          >
            <Input placeholder="ระบุนามสกุลของคุณ" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="เบอร์มือถือ"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "กรุณาระบุเบอร์มือถือ",
              },
              {
                pattern: /^[0-9-+()]{10,15}$/,
                message: "เบอร์มือถือไม่ถูกต้อง",
              },
            ]}
          >
            <Input placeholder="เช่น 081-234-5678" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
