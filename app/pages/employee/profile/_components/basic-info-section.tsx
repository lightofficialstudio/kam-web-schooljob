import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import React from "react";

interface BasicInfoSectionProps {
  form: any;
}

const GENDER_OPTIONS = [
  { value: "ชาย", label: "ชาย" },
  { value: "หญิง", label: "หญิง" },
  { value: "ไม่ระบุ", label: "ไม่ระบุ" },
];

const NATIONALITY_OPTIONS = [
  { value: "ไทย", label: "ไทย" },
  { value: "อเมริกัน", label: "อเมริกัน" },
  { value: "อังกฤษ", label: "อังกฤษ" },
  { value: "ญี่ปุ่น", label: "ญี่ปุ่น" },
  { value: "จีน", label: "จีน" },
  { value: "เกาหลี", label: "เกาหลี" },
  { value: "ฟิลิปปินส์", label: "ฟิลิปปินส์" },
  { value: "อื่นๆ", label: "อื่นๆ" },
];

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  return (
    <div className="py-2">
      {/* ─── ชื่อ - นามสกุล ─── */}
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="ชื่อ"
            name="firstName"
            rules={[
              { required: true, message: "กรุณาระบุชื่อ" },
              {
                pattern: /^[ก-๙a-zA-Z\s]+$/,
                message: "ชื่อต้องมีตัวอักษรและพื้นที่ว่างเท่านั้น",
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
              { required: true, message: "กรุณาระบุนามสกุล" },
              {
                pattern: /^[ก-๙a-zA-Z\s]+$/,
                message: "นามสกุลต้องมีตัวอักษรและพื้นที่ว่างเท่านั้น",
              },
            ]}
          >
            <Input placeholder="ระบุนามสกุลของคุณ" />
          </Form.Item>
        </Col>
      </Row>

      {/* ─── เพศ - วัน/เดือน/ปีเกิด ─── */}
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="เพศ"
            name="gender"
            rules={[{ required: true, message: "กรุณาเลือกเพศ" }]}
          >
            <Select placeholder="เลือกเพศ" options={GENDER_OPTIONS} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="วัน/เดือน/ปีเกิด"
            name="dateOfBirth"
            rules={[{ required: true, message: "กรุณาระบุวันเกิด" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="เลือกวันเกิด"
              format="DD/MM/YYYY"
            />
          </Form.Item>
        </Col>
      </Row>

      {/* ─── เบอร์มือถือ - สัญชาติ ─── */}
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="เบอร์มือถือ"
            name="phoneNumber"
            rules={[
              { required: true, message: "กรุณาระบุเบอร์มือถือ" },
              {
                pattern: /^[0-9\-+()]{10,15}$/,
                message: "เบอร์มือถือไม่ถูกต้อง",
              },
            ]}
          >
            <Input placeholder="เช่น 081-234-5678" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="สัญชาติ"
            name="nationality"
            rules={[{ required: true, message: "กรุณาระบุสัญชาติ" }]}
          >
            <Select
              placeholder="เลือกสัญชาติ"
              options={NATIONALITY_OPTIONS}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
