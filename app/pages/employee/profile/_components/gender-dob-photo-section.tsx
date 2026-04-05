"use client";

import {
  CameraOutlined,
  ExclamationCircleFilled,
  UserOutlined,
  WarningFilled,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Flex,
  Form,
  type FormInstance,
  Input,
  Row,
  Select,
  Typography,
  Upload,
  theme,
} from "antd";
import type { RcFile } from "antd/es/upload";
import React, { useState } from "react";
import { uploadFile } from "@/app/lib/storage";
import { useProfileStore } from "../_stores/profile-store";

const { Text } = Typography;

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

interface GenderDobPhotoSectionProps {
  form: FormInstance;
  userId: string;
}

export const GenderDobPhotoSection: React.FC<GenderDobPhotoSectionProps> = ({
  form,
  userId,
}) => {
  const { token } = theme.useToken();
  const { setProfile } = useProfileStore();

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleBeforeUpload = (file: RcFile): boolean => {
    setUploadError(null);

    // 🔐 ตรวจสอบประเภทไฟล์
    if (!ALLOWED_MIME.includes(file.type)) {
      setUploadError(
        `ประเภทไฟล์ไม่ถูกต้อง — รองรับเฉพาะ JPEG, PNG และ WebP เท่านั้น`
      );
      return false;
    }

    // 🔐 ตรวจสอบขนาดไฟล์ ≤ 10 MB
    if (file.size > MAX_FILE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setUploadError(
        `ไฟล์ "${file.name}" มีขนาด ${sizeMB} MB — เกินขีดจำกัด 10 MB กรุณาลดขนาดไฟล์แล้วลองใหม่`
      );
      return false;
    }

    // ✨ แสดง preview ก่อน upload
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // ✨ Upload จริงผ่าน async IIFE — ป้องกัน Ant Design auto-upload
    (async () => {
      setIsUploading(true);
      try {
        const result = await uploadFile("avatars", userId, file);
        // ✅ อัปเดต form field และ store
        form.setFieldValue("profileImageUrl", result.url);
        setProfile({ profileImageUrl: result.url });
        console.log("✅ [GenderDobPhotoSection] อัปโหลดรูปโปรไฟล์สำเร็จ:", result.url);
      } catch (err) {
        console.error("❌ [GenderDobPhotoSection] upload error:", err);
        setUploadError("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ กรุณาลองใหม่อีกครั้ง");
        setPreviewUrl(null);
      } finally {
        setIsUploading(false);
      }
    })();

    return false; // ป้องกัน Ant Design auto-upload
  };

  return (
    <div className="py-2">
      {/* ─── Error Banner ─── */}
      {uploadError && (
        <Flex
          align="flex-start"
          gap={10}
          style={{
            padding: "12px 16px",
            borderRadius: token.borderRadius,
            border: `1.5px solid ${token.colorError}`,
            backgroundColor: token.colorErrorBg,
            marginBottom: 16,
          }}
        >
          <ExclamationCircleFilled
            style={{ color: token.colorError, fontSize: 16, marginTop: 1, flexShrink: 0 }}
          />
          <Flex vertical gap={2} style={{ flex: 1 }}>
            <Text strong style={{ color: token.colorError, fontSize: 13 }}>
              ไม่สามารถอัปโหลดรูปได้
            </Text>
            <Text style={{ color: token.colorError, fontSize: 12 }}>
              {uploadError}
            </Text>
          </Flex>
          <Button
            type="text"
            size="small"
            style={{ marginLeft: "auto", color: token.colorError, flexShrink: 0, padding: "0 4px" }}
            onClick={() => setUploadError(null)}
          >
            ✕
          </Button>
        </Flex>
      )}

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
          <Form.Item label="รูปโปรไฟล์" name="profileImageUrl">
            <Flex align="center" gap={16}>
              {/* ─── Preview Avatar ─── */}
              <Avatar
                size={80}
                icon={<UserOutlined />}
                src={previewUrl ?? undefined}
                style={{
                  backgroundColor: token.colorBgLayout,
                  border: `2px solid ${token.colorBorderSecondary}`,
                  flexShrink: 0,
                }}
              />

              {/* ─── Upload Button ─── */}
              <Upload
                accept="image/jpeg,image/png,image/webp"
                maxCount={1}
                showUploadList={false}
                beforeUpload={handleBeforeUpload}
              >
                <Button
                  icon={<CameraOutlined />}
                  type="dashed"
                  loading={isUploading}
                  disabled={isUploading}
                >
                  {isUploading ? "กำลังอัปโหลด..." : "อัปโหลดรูปโปรไฟล์"}
                </Button>
              </Upload>
            </Flex>
          </Form.Item>

          {/* ─── ข้อกำหนดไฟล์ ─── */}
          <Flex
            vertical
            gap={4}
            style={{
              padding: "10px 14px",
              borderRadius: token.borderRadius,
              backgroundColor: token.colorFillQuaternary,
              border: `1px solid ${token.colorBorderSecondary}`,
              marginTop: -8,
            }}
          >
            <Flex align="center" gap={6}>
              <WarningFilled style={{ color: token.colorWarning, fontSize: 12 }} />
              <Text strong style={{ fontSize: 12, color: token.colorTextSecondary }}>
                ข้อกำหนดการอัปโหลด
              </Text>
            </Flex>
            <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
              • รองรับ <Text strong style={{ color: token.colorText }}>JPEG, PNG, WebP</Text> เท่านั้น
            </Text>
            <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
              • ขนาดไฟล์สูงสุด{" "}
              <Text strong style={{ color: token.colorError }}>10 MB</Text>
            </Text>
          </Flex>
        </Col>
      </Row>
    </div>
  );
};
