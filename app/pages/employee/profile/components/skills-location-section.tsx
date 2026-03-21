import { Checkbox, Col, Form, Input, Row, Select } from "antd";
import React from "react";

interface SkillsLocationSectionProps {
  form: any;
}

const PROVINCE_OPTIONS = [
  { label: "กรุงเทพมหานคร", value: "bangkok" },
  { label: "นนทบุรี", value: "nonthaburi" },
  { label: "ปทุมธานี", value: "pathumthani" },
  { label: "สมุทรปราการ", value: "samutprakarn" },
  { label: "เชียงใหม่", value: "chiangmai" },
  { label: "เชียงราย", value: "chiangrai" },
  { label: "ขอนแก่น", value: "khonkaen" },
  { label: "นครราชสีมา", value: "nakhonratchasima" },
  { label: "ระยอง", value: "rayong" },
  { label: "สระแก้ว", value: "sakaeo" },
  { label: "ปีนัง (อื่นๆ)", value: "others" },
];

export const SkillsLocationSection: React.FC<SkillsLocationSectionProps> = ({
  form,
}) => {
  return (
    <div className="py-2">
      {/* Skills Section */}
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item label="ภาษาที่สอนได้" name="languagesSpoken">
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

      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item label="กิจกรรม / ทักษะพิเศษ" name="specialActivities">
            <Input.TextArea
              placeholder="เช่น ดนตรี, กีฬา, ศิลปะ, นวัตกรรมอื่นๆ..."
              rows={3}
            />
          </Form.Item>
        </Col>
      </Row>

      <hr style={{ margin: "24px 0" }} />

      {/* Work Location Section */}
      <h4
        style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "16px" }}
      >
        สถานที่ทำงาน
      </h4>

      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            label="จังหวัดที่ต้องการทำงาน"
            name="preferredProvinces"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกจังหวัดที่ต้องการทำงาน",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="เลือกจังหวัด"
              options={PROVINCE_OPTIONS}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            label="สามารถย้ายที่อยู่ได้"
            name="canRelocate"
            valuePropName="checked"
            rules={[
              {
                required: true,
                message: "กรุณาระบุว่าสามารถย้ายที่อยู่ได้หรือไม่",
              },
            ]}
          >
            <Checkbox>ฉันสามารถย้ายที่อยู่ได้</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
