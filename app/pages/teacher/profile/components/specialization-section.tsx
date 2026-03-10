import { Col, Form, Row, Select } from "antd";
import React from "react";

interface SpecializationSectionProps {
  form: any;
}

// ตัวเลือกวิชาเอก/วิชาที่สอน (อาจเปลี่ยนได้ตามความต้องการของระบบ)
const SPECIALIZATION_OPTIONS = [
  { label: "ภาษาไทย", value: "thai" },
  { label: "ภาษาอังกฤษ", value: "english" },
  { label: "คณิตศาสตร์", value: "math" },
  { label: "วิทยาศาสตร์", value: "science" },
  { label: "สังคมศึกษา", value: "social_studies" },
  { label: "พลศึกษา", value: "pe" },
  { label: "ศิลปะ", value: "art" },
  { label: "ดนตรี", value: "music" },
  { label: "หนังสือพิมพ์และสื่อ", value: "journalism" },
  { label: "เทคโนโลยีสารสนเทศ", value: "it" },
];

export const SpecializationSection: React.FC<SpecializationSectionProps> = ({
  form,
}) => {
  return (
    <div style={{ marginBottom: "24px" }}>
      <h3
        style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px" }}
      >
        วิชาเอก/วิชาที่สอน
      </h3>

      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            label="วิชาแขนง"
            name="specialization"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกวิชาแขนง",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="เลือกวิชาแขนงที่คุณสอน"
              options={SPECIALIZATION_OPTIONS}
              optionLabelProp="label"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
