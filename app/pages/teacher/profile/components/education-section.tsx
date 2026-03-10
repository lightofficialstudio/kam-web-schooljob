import { FileOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select, Upload } from "antd";
import React from "react";

interface EducationSectionProps {
  form: any;
}

const EDUCATION_LEVELS = [
  { label: "ต่ำกว่ามัธยมศึกษา", value: "below_secondary" },
  { label: "มัธยมศึกษาตอนต้น", value: "junior_secondary" },
  { label: "มัธยมศึกษาตอนปลาย", value: "senior_secondary" },
  { label: "ปวช.", value: "vocational" },
  { label: "ปวท.", value: "advanced_vocational" },
  { label: "ปวส.", value: "higher_vocational" },
  { label: "อนุปริญญา", value: "associate_degree" },
  { label: "ปริญญาตรี", value: "bachelor" },
  { label: "ปริญญาโท", value: "master" },
  { label: "ปริญญาเอก", value: "doctorate" },
];

const TEACHING_LICENSE_OPTIONS = [
  { label: "มี", value: "have" },
  { label: "กำลังดำเนินการ", value: "processing" },
  { label: "ไม่มี", value: "no" },
];

export const EducationSection: React.FC<EducationSectionProps> = ({ form }) => {
  const beforeUpload = (file: File) => {
    const isPDF = file.type === "application/pdf";
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isPDF) {
      return false;
    }

    if (!isLt5M) {
      return false;
    }

    return false;
  };

  return (
    <div style={{ marginBottom: "24px" }}>
      <h3
        style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px" }}
      >
        ข้อมูลการศึกษา
      </h3>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="ระดับการศึกษา"
            name="educationLevel"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกระดับการศึกษา",
              },
            ]}
          >
            <Select
              placeholder="-- เลือกระดับการศึกษา --"
              options={EDUCATION_LEVELS}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label="สถาบัน"
            name="institution"
            rules={[
              {
                required: true,
                message: "กรุณาระบุสถาบัน",
              },
            ]}
          >
            <Input placeholder="ชื่อมหาวิทยาลัย/สถาบัน" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="สาขา"
            name="major"
            rules={[
              {
                required: true,
                message: "กรุณาระบุสาขา",
              },
            ]}
          >
            <Input placeholder="เช่น ครุศาสตร์" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item label="เกรดเฉลี่ย" name="gpa">
            <Input
              type="number"
              placeholder="เช่น 3.50"
              step="0.01"
              min="0"
              max="4"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="ใบอนุญาตประกอบวิชาชีพครู"
            name="teachingLicense"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกสถานะใบอนุญาต",
              },
            ]}
          >
            <Select
              placeholder="-- เลือกสถานะ --"
              options={TEACHING_LICENSE_OPTIONS}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label="แนบใบอนุญาตประกอบวิชาชีพ"
            name="licenseFile"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload
              accept=".pdf"
              maxCount={1}
              beforeUpload={beforeUpload}
              listType="text"
              onRemove={() => {
                form.setFieldValue("licenseFile", null);
              }}
            >
              <Button icon={<FileOutlined />} type="dashed">
                อัพโหลดใบอนุญาต (PDF)
              </Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
