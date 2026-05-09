"use client";

import { ThunderboltOutlined } from "@ant-design/icons";
import { Card, Col, Form, InputNumber, Row, Select, Space, theme } from "antd";
import { useEffect, useState } from "react";
import { type ConfigOption, requestFetchConfigOptions } from "../_api/job-post-api";

// ✨ positions ที่มี parentValue = "requires_subject" → แสดง subject fields
const REQUIRES_SUBJECT_MARKER = "requires_subject";

// ส่วนกรอกข้อมูลพื้นฐานของตำแหน่งงาน: ตำแหน่ง, รูปแบบ, จำนวน, วิชา, ระดับชั้น
export const BasicInfoSection = () => {
  const { token } = theme.useToken();
  const form = Form.useFormInstance();

  // ✨ ดึง job_position — root = ตำแหน่งทั่วไป, parentValue="requires_subject" = ตำแหน่งครู
  const [positionOptions, setPositionOptions] = useState<ConfigOption[]>([]);
  // ✨ ดึง job_category — root = กลุ่มวิชา, children = วิชาย่อย
  const [categoryOptions, setCategoryOptions] = useState<ConfigOption[]>([]);

  const [selectedPosition, setSelectedPosition] = useState<ConfigOption | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  useEffect(() => {
    requestFetchConfigOptions("job_position").then(setPositionOptions);
    requestFetchConfigOptions("job_category").then(setCategoryOptions);
  }, []);

  // ✨ ตำแหน่งที่แสดงใน dropdown (เฉพาะ active, ไม่รวม marker node)
  const selectablePositions = positionOptions.filter(
    (o) => o.value !== REQUIRES_SUBJECT_MARKER,
  );

  // ✨ position นี้ต้องการระบุวิชาหรือไม่
  const requiresSubject = selectedPosition?.parentValue === REQUIRES_SUBJECT_MARKER;

  // ✨ root items ของ job_category คือ กลุ่มวิชา
  const groupOptions = categoryOptions.filter((o) => o.parentValue === null);

  // ✨ วิชาย่อยของ group ที่เลือก
  const subjectOptions = selectedGroup
    ? categoryOptions.filter((o) => o.parentValue === selectedGroup)
    : categoryOptions.filter(() => false);

  const handlePositionChange = (value: string) => {
    const found = positionOptions.find((o) => o.value === value) ?? null;
    setSelectedPosition(found);
    // ✨ เก็บ label ของ position ไว้ใน hidden field สำหรับส่งเป็น title ไป API
    form.setFieldValue("titleLabel", found?.label ?? value);
    form.setFieldValue("subjectGroup", undefined);
    form.setFieldValue("subjects", undefined);
    setSelectedGroup("");
  };

  const handleGroupChange = (value: string, _option: unknown) => {
    setSelectedGroup(value);
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
        {/* ✨ ตำแหน่งงาน — ดึงจาก job_position config */}
        <Col xs={24} md={16}>
          <Form.Item
            label="ตำแหน่งงาน"
            name="title"
            rules={[{ required: true, message: "กรุณาเลือกตำแหน่งงาน" }]}
          >
            <Select
              size="large"
              placeholder="เลือกตำแหน่งงาน"
              loading={positionOptions.length === 0}
              onChange={handlePositionChange}
              options={selectablePositions.map((o) => ({ label: o.label, value: o.value }))}
            />
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

        {/* ✨ แสดง subject fields เฉพาะตำแหน่งที่มี parentValue = "requires_subject" */}
        {requiresSubject && (
          <>
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
          </>
        )}

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
