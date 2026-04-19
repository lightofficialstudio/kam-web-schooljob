import { Col, Form, Row, Select } from "antd";
import React from "react";

interface SkillsLocationSectionProps {
  form: ReturnType<typeof Form.useForm>[0];
}

export const SkillsLocationSection: React.FC<SkillsLocationSectionProps> = ({
  form,
}) => {
  return (
    <div className="py-2">
      {/* Skills Section */}
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item label="ภาษาที่พูดได้" name="languagesSpoken">
            <Select
              mode="multiple"
              placeholder="เช่น ไทย, อังกฤษ, จีน..."
              options={[
                { label: "ไทย", value: "thai" },
                { label: "อังกฤษ", value: "english" },
                { label: "จีน", value: "chinese" },
                { label: "ญี่ปุ่น", value: "japanese" },
                { label: "เกาหลี", value: "korean" },
                { label: "ฝรั่งเศส", value: "french" },
                { label: "สเปน", value: "spanish" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item label="ความสามารถด้าน IT" name="itSkills">
            <Select
              mode="multiple"
              placeholder="เช่น MsOffice, Google Classroom..."
              options={[
                { label: "Microsoft Office", value: "msoffice" },
                { label: "Google Workspace", value: "google_workspace" },
                { label: "Google Classroom", value: "google_classroom" },
                { label: "Zoom", value: "zoom" },
                { label: "Canva", value: "canva" },
                { label: "Coding", value: "coding" },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
