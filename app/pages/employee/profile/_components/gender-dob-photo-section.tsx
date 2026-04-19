"use client";

import { ModalComponent } from "@/app/components/modal/modal.component";
import { uploadFile } from "@/app/lib/storage";
import { CameraOutlined, UserOutlined, WarningFilled } from "@ant-design/icons";
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
import { useProfileStore } from "../_stores/profile-store";

// ✨ โครงสร้าง local modal state
interface ModalState {
  open: boolean;
  type: "success" | "error" | "confirm" | "delete";
  title: string;
  description: string;
  errorDetails?: unknown;
}

const MODAL_CLOSED: ModalState = {
  open: false,
  type: "success",
  title: "",
  description: "",
};

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

  const [modal, setModal] = useState<ModalState>(MODAL_CLOSED);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const closeModal = () => setModal(MODAL_CLOSED);

  const handleBeforeUpload = (file: RcFile): boolean => {
    // 🔐 ตรวจสอบประเภทไฟล์
    if (!ALLOWED_MIME.includes(file.type)) {
      setModal({
        open: true,
        type: "error",
        title: "ประเภทไฟล์ไม่ถูกต้อง",
        description:
          "รองรับเฉพาะไฟล์ JPEG, PNG และ WebP เท่านั้น กรุณาเลือกไฟล์ใหม่",
      });
      return false;
    }

    // 🔐 ตรวจสอบขนาดไฟล์ ≤ 10 MB
    if (file.size > MAX_FILE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setModal({
        open: true,
        type: "error",
        title: "ไฟล์มีขนาดใหญ่เกินไป",
        description: `ไฟล์ "${file.name}" มีขนาด ${sizeMB} MB เกินขีดจำกัด 10 MB กรุณาลดขนาดไฟล์แล้วลองใหม่`,
      });
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
        setModal({
          open: true,
          type: "success",
          title: "อัปโหลดรูปโปรไฟล์สำเร็จ",
          description:
            "รูปภาพของคุณถูกอัปโหลดเรียบร้อยแล้ว กด 'บันทึกข้อมูล' เพื่อยืนยันการเปลี่ยนแปลง",
        });
      } catch (err: unknown) {
        const axiosErr = err as {
          response?: { data?: { message_th?: string } };
          message?: string;
        };
        const description =
          axiosErr?.response?.data?.message_th ||
          axiosErr?.message ||
          "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ กรุณาลองใหม่อีกครั้ง";
        setPreviewUrl(null);
        setModal({
          open: true,
          type: "error",
          title: "อัปโหลดรูปภาพไม่สำเร็จ",
          description,
          errorDetails: err,
        });
      } finally {
        setIsUploading(false);
      }
    })();

    return false; // ป้องกัน Ant Design auto-upload
  };

  return (
    <>
      {/* ✨ Modal กลาง — ทุก state รายงานผ่านนี้ */}
      <ModalComponent
        open={modal.open}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        errorDetails={modal.errorDetails}
        onClose={closeModal}
        confirmLabel="ตกลง"
      />

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
                <WarningFilled
                  style={{ color: token.colorWarning, fontSize: 12 }}
                />
                <Text
                  strong
                  style={{ fontSize: 12, color: token.colorTextSecondary }}
                >
                  ข้อกำหนดการอัปโหลด
                </Text>
              </Flex>
              <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
                • รองรับ{" "}
                <Text strong style={{ color: token.colorText }}>
                  JPEG, PNG, WebP
                </Text>{" "}
                เท่านั้น
              </Text>
              <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
                • ขนาดไฟล์สูงสุด{" "}
                <Text strong style={{ color: token.colorError }}>
                  10 MB
                </Text>
              </Text>
            </Flex>
          </Col>
        </Row>
      </div>
    </>
  );
};
