import { UserOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select, Upload } from "antd";
import React from "react";

interface GenderDobPhotoSectionProps {
  form: any;
}

export const GenderDobPhotoSection: React.FC<GenderDobPhotoSectionProps> = ({
  form,
}) => {
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      return false;
    }

    if (!isLt2M) {
      return false;
    }

    return false;
  };

  return (
    <div className="py-2">
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="เพศ"
            name="gender"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกเพศ",
              },
            ]}
          >
            <Select
              placeholder="-- เลือกเพศ --"
              options={[
                { label: "ชาย", value: "male" },
                { label: "หญิง", value: "female" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            label="วันเกิด"
            name="dateOfBirth"
            rules={[
              {
                required: true,
                message: "กรุณาระบุวันเกิด",
              },
            ]}
          >
            <Input type="date" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="รูปโปรไฟล์"
            name="profileImageFile"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload
              accept="image/*"
              maxCount={1}
              beforeUpload={beforeUpload}
              listType="picture"
              onRemove={() => {
                form.setFieldValue("profileImageFile", null);
              }}
            >
              <Button icon={<UserOutlined />} type="dashed">
                อัพโหลดรูปโปรไฟล์
              </Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
