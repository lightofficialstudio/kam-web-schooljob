"use client";

import { ThunderboltOutlined } from "@ant-design/icons";
import { Card, Col, Form, Input, InputNumber, Row, Select, Space, theme } from "antd";
import { useEffect, useState } from "react";
import { type ConfigOption, requestFetchConfigOptions } from "../_api/job-post-api";

// ส่วนกรอกข้อมูลพื้นฐานของตำแหน่งงาน: ชื่อ, รูปแบบ, จำนวน, วิชา, ระดับชั้น
export const BasicInfoSection = () => {
  const { token } = theme.useToken();
  const form = Form.useFormInstance();

  // ✨ ดึง job_category จาก config — root = กลุ่มวิชา, children = วิชาย่อย
  const [categoryOptions, setCategoryOptions] = useState<ConfigOption[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  useEffect(() => {
    requestFetchConfigOptions("job_category").then(setCategoryOptions);
  }, []);

  // ✨ root items (parentValue = null) คือ กลุ่มวิชา
  const groupOptions = categoryOptions.filter((o) => o.parentValue === null);

  // ✨ children ของ group ที่เลือก
  const subjectOptions = selectedGroup
    ? categoryOptions.filter((o) => o.parentValue === selectedGroup)
    : categoryOptions.filter(() => false);

  const handleGroupChange = (value: string, _option: unknown) => {
    setSelectedGroup(value);
    // ✨ reset วิชาที่สอนเมื่อเปลี่ยนกลุ่ม
    form.setFieldValue("subjects", undefined);
  };

  return (
    <Card
      title={
        <Space>
          <ThunderboltOutlined style={{ color: token.colorPrimary }} />
          ข้อมูลตำแหน่งงาน
        </Space>
      }
      variant="borderless"
      style={{ borderRadius: 16, border: `1px solid ${token.colorBorderSecondary}` }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Form.Item
            label="ตำแหน่งงาน"
            name="title"
            rules={[{ required: true, message: "กรุณาระบุตำแหน่งงาน" }]}
            tooltip="เช่น ครูภาษาอังกฤษ, ครูสอนศิลปะ"
          >
            <Input size="large" placeholder="ระบุตำแหน่งงาน" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="รูปแบบงาน"
            name="employmentType"
            rules={[{ required: true, message: "กรุณาเลือกรูปแบบงาน" }]}
          >
            <Select size="large" placeholder="เลือกรูปแบบงาน">
              <Select.Option value="FULL_TIME">งานเต็มเวลา (Full-time)</Select.Option>
              <Select.Option value="PART_TIME">งานพาร์ทไทม์ (Part-time)</Select.Option>
              <Select.Option value="CONTRACT">สัญญาจ้าง</Select.Option>
              <Select.Option value="INTERNSHIP">ฝึกงาน</Select.Option>
              <Select.Option value="STUDENT_TEACHER">นักศึกษาฝึกสอน</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="จำนวนที่รับ (คน)"
            name="vacancyCount"
            rules={[{ required: true, message: "กรุณาระบุจำนวนที่รับ" }]}
          >
            <InputNumber size="large" min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        {/* ✨ กลุ่มวิชา → วิชาที่สอน (Cascading จาก job_category config) */}
        <Col xs={24} md={8}>
          <Form.Item label="กลุ่มวิชา" name="subjectGroup">
            <Select
              size="large"
              placeholder="เลือกกลุ่มวิชา"
              loading={categoryOptions.length === 0}
              onChange={handleGroupChange}
              options={groupOptions.map((o) => ({ label: o.label, value: o.value }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="วิชาที่สอน"
            name="subjects"
            rules={[{ required: true, message: "กรุณาเลือกวิชาที่สอน" }]}
          >
            <Select
              size="large"
              placeholder={selectedGroup ? "เลือกวิชาที่สอน" : "เลือกกลุ่มวิชาก่อน"}
              disabled={!selectedGroup}
              options={subjectOptions.map((o) => ({ label: o.label, value: o.value }))}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="ระดับชั้นที่สอน" name="grades">
            <Select mode="multiple" size="large" placeholder="เลือกระดับชั้น" style={{ width: "100%" }}>
              <Select.Option value="อนุบาล">อนุบาล</Select.Option>
              <Select.Option value="ประถมศึกษา">ประถมศึกษา</Select.Option>
              <Select.Option value="มัธยมต้น">มัธยมต้น</Select.Option>
              <Select.Option value="มัธยมปลาย">มัธยมปลาย</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};
