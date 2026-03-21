import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Form, message, Row, Upload } from "antd";
import React from "react";

interface ResumeUploadSectionProps {
  form: any;
}

export const ResumeUploadSection: React.FC<ResumeUploadSectionProps> = ({
  form,
}) => {
  const beforeUpload = (file: File) => {
    const isPDF = file.type === "application/pdf";
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isPDF) {
      message.error("คุณสามารถอัพโหลดไฟล์ PDF เท่านั้น");
      return false;
    }

    if (!isLt5M) {
      message.error("ขนาดไฟล์ต้องมีขนาดน้อยกว่า 5 MB");
      return false;
    }

    return false; // Prevent auto-upload
  };

  return (
    <div style={{ marginBottom: "24px" }}>
      <h3
        style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px" }}
      >
        เอกสารประกอบ
      </h3>

      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            label="แนบ Resume (PDF)"
            name="resumeFile"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
            rules={[
              {
                required: false, // Optional field
              },
            ]}
          >
            <Upload
              accept=".pdf"
              maxCount={1}
              beforeUpload={beforeUpload}
              listType="text"
              onRemove={() => {
                form.setFieldValue("resumeFile", null);
              }}
            >
              <Button icon={<UploadOutlined />} type="dashed">
                คลิกเพื่ออัพโหลด Resume (PDF)
              </Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>

      <div style={{ color: "#666", fontSize: "12px" }}>
        <p>• รองรับเฉพาะไฟล์ PDF</p>
        <p>• ขนาดไฟล์ต้องมีขนาดน้อยกว่า 5 MB</p>
      </div>
    </div>
  );
};
