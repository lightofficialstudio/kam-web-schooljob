import { Col, Form, Input, Row, Select } from "antd";
import React from "react";

interface TeachingInfoSectionProps {
  form: any;
}

const GRADE_OPTIONS = [
  { label: "อนุบาล", value: "kindergarten" },
  { label: "ประถมศึกษา", value: "primary" },
  { label: "มัธยมต้น", value: "junior_secondary" },
  { label: "มัธยมปลาย", value: "senior_secondary" },
];

const EXPERIENCE_OPTIONS = [
  { label: "ไม่มีประสบการณ์", value: "no_experience" },
  { label: "ฝึกสอน", value: "practicum" },
  { label: "น้อยกว่า 1 ปี", value: "less_than_1_year" },
  { label: "1-3 ปี", value: "1_to_3_years" },
  { label: "3-5 ปี", value: "3_to_5_years" },
  { label: "5-10 ปี", value: "5_to_10_years" },
  { label: "มากกว่า 10 ปี", value: "more_than_10_years" },
];

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

export const TeachingInfoSection: React.FC<TeachingInfoSectionProps> = ({
  form,
}) => {
  return (
    <div className="py-2">
      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            label="วิชาที่สอนได้"
            name="specialization"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกวิชาที่สอนได้",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="เลือกวิชาแขนงที่คุณสอน"
              options={SPECIALIZATION_OPTIONS}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            label="ระดับที่สอนได้"
            name="gradeCanTeach"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกระดับที่สอนได้",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="เลือกระดับที่สอนได้"
              options={GRADE_OPTIONS}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="ประสบการณ์สอน"
            name="teachingExperience"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกประสบการณ์สอน",
              },
            ]}
          >
            <Select
              placeholder="-- เลือกประสบการณ์ --"
              options={EXPERIENCE_OPTIONS}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item label="โรงเรียนล่าสุด" name="recentSchool">
            <Input placeholder="ชื่อโรงเรียน (ถ้ามี)" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
