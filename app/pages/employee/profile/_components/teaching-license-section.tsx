"use client";

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  FilePdfOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  WarningFilled,
} from "@ant-design/icons";
import {
  Button,
  Flex,
  Tag,
  Tooltip,
  Typography,
  Upload,
  theme,
} from "antd";
import type { RcFile } from "antd/es/upload";
import React, { useState } from "react";
import { uploadFile } from "@/app/lib/storage";
import { useAuthStore } from "@/app/stores/auth-store";
import type { ResumeEntry } from "../_stores/profile-store";
import { useProfileStore } from "../_stores/profile-store";

const { Text } = Typography;

const MAX_FILE_MB = 10;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;
const ALLOWED_MIME = ["application/pdf", "image/jpeg", "image/png"];

// Config สถานะใบประกอบวิชาชีพ
const LICENSE_STATUS_OPTIONS: {
  value: NonNullable<ReturnType<typeof useProfileStore.getState>["profile"]["licenseStatus"]>;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  { value: "has_license",  label: "มีใบอนุญาต",                          icon: <CheckCircleOutlined />,  color: "#52c41a" },
  { value: "pending",      label: "อยู่ระหว่างขอ",                        icon: <ClockCircleOutlined />,  color: "#faad14" },
  { value: "no_license",   label: "ไม่มีใบอนุญาต",                        icon: <CloseCircleOutlined />,  color: "#ff4d4f" },
  { value: "not_required", label: "ตำแหน่งของฉันไม่ต้องใช้ใบอนุญาต",     icon: <MinusCircleOutlined />,  color: "#8c8c8c" },
];

// แปลงขนาดไฟล์ bytes → KB/MB
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Section สถานะใบประกอบวิชาชีพ + แนบไฟล์
export const TeachingLicenseSection: React.FC = () => {
  const { token } = theme.useToken();
  const { profile, setLicenseStatus, addLicenseAttachment, removeLicenseAttachment, saveProfile } =
    useProfileStore();
  const { user } = useAuthStore();

  const currentStatus = profile.licenseStatus ?? "";
  const attachments   = profile.licenseAttachments ?? [];
  const showAttachment = currentStatus === "has_license" || currentStatus === "pending";

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleBeforeUpload = (file: RcFile): boolean => {
    setUploadError(null);

    // 🔐 ตรวจประเภทไฟล์
    if (!ALLOWED_MIME.includes(file.type)) {
      setUploadError("ประเภทไฟล์ไม่รองรับ — อนุญาตเฉพาะ PDF, JPG, PNG เท่านั้น");
      return false;
    }

    // 🔐 ตรวจขนาดไฟล์ ≤ 10 MB
    if (file.size > MAX_FILE_BYTES) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      setUploadError(
        `ไฟล์ "${file.name}" มีขนาด ${sizeMB} MB — เกินขีดจำกัด ${MAX_FILE_MB} MB กรุณาบีบอัดไฟล์แล้วลองใหม่`
      );
      return false;
    }

    // 🔐 ป้องกันไฟล์ซ้ำ
    if (attachments.some((f) => f.fileName === file.name)) {
      setUploadError(`ไฟล์ "${file.name}" ถูกแนบไปแล้ว`);
      return false;
    }

    if (!user?.user_id) {
      setUploadError("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
      return false;
    }

    // ✨ Upload จริงไป Supabase Storage (licenses bucket) แล้ว save ลง DB
    (async () => {
      setIsUploading(true);
      try {
        const result = await uploadFile("licenses", user.user_id, file);

        const newFile: ResumeEntry = {
          id: `lic-${Date.now()}`,
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toLocaleDateString("th-TH"),
          url: result.url,
        };
        addLicenseAttachment(newFile);

        // ✅ บันทึก licenses ลง DB ทันที
        await saveProfile(user.user_id);
        console.log("✅ [TeachingLicenseSection] อัปโหลดและบันทึกใบประกอบฯ สำเร็จ:", result.url);
      } catch (err) {
        console.error("❌ [TeachingLicenseSection] upload error:", err);
        setUploadError(`อัปโหลดไฟล์ "${file.name}" ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง`);
      } finally {
        setIsUploading(false);
      }
    })();

    return false;
  };

  return (
    <Flex vertical gap={16}>
      {/* ─── ตัวเลือกสถานะ ─── */}
      <Flex vertical gap={8}>
        <Text strong style={{ fontSize: 13 }}>
          <SafetyCertificateOutlined style={{ marginRight: 6 }} />
          สถานะใบประกอบวิชาชีพ
        </Text>
        <Flex vertical gap={8}>
          {LICENSE_STATUS_OPTIONS.map((opt) => {
            const isSelected = currentStatus === opt.value;
            return (
              <Flex
                key={opt.value}
                align="center"
                gap={12}
                onClick={() => { setLicenseStatus(opt.value); setUploadError(null); }}
                style={{
                  padding: "12px 16px",
                  borderRadius: token.borderRadius,
                  border: `1.5px solid ${isSelected ? opt.color : token.colorBorderSecondary}`,
                  backgroundColor: isSelected ? `${opt.color}0f` : token.colorFillQuaternary,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: isSelected ? `${opt.color}20` : token.colorFillTertiary,
                    color: isSelected ? opt.color : token.colorTextSecondary,
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {opt.icon}
                </Flex>
                <Text
                  strong={isSelected}
                  style={{ fontSize: 13, color: isSelected ? opt.color : token.colorText }}
                >
                  {opt.label}
                </Text>
                {isSelected && (
                  <Tag
                    color={
                      opt.color === "#52c41a" ? "success"
                      : opt.color === "#faad14" ? "warning"
                      : opt.color === "#ff4d4f" ? "error"
                      : "default"
                    }
                    style={{ marginLeft: "auto", fontSize: 11 }}
                  >
                    เลือกอยู่
                  </Tag>
                )}
              </Flex>
            );
          })}
        </Flex>
      </Flex>

      {/* ─── แนบไฟล์ใบประกอบวิชาชีพ ─── */}
      {showAttachment && (
        <Flex vertical gap={10}>
          <Text strong style={{ fontSize: 13 }}>
            แนบไฟล์ใบประกอบวิชาชีพ
          </Text>

          {/* คำเตือน Error */}
          {uploadError && (
            <Flex
              align="flex-start"
              gap={10}
              style={{
                padding: "12px 16px",
                borderRadius: token.borderRadius,
                border: `1.5px solid ${token.colorError}`,
                backgroundColor: token.colorErrorBg,
              }}
            >
              <ExclamationCircleFilled
                style={{ color: token.colorError, fontSize: 16, marginTop: 1, flexShrink: 0 }}
              />
              <Flex vertical gap={2}>
                <Text strong style={{ color: token.colorError, fontSize: 13 }}>
                  ไม่สามารถแนบไฟล์ได้
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

          {/* รายการไฟล์ที่แนบแล้ว */}
          {attachments.length > 0 && (
            <Flex vertical gap={8}>
              {attachments.map((file) => (
                <Flex
                  key={file.id}
                  align="center"
                  justify="space-between"
                  style={{
                    padding: "10px 14px",
                    borderRadius: token.borderRadius,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    backgroundColor: token.colorFillQuaternary,
                  }}
                >
                  <Flex align="center" gap={10}>
                    <FilePdfOutlined style={{ fontSize: 20, color: "#ff4d4f", flexShrink: 0 }} />
                    <Flex vertical gap={2}>
                      <Text strong style={{ fontSize: 13 }}>{file.fileName}</Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {formatFileSize(file.fileSize)} · อัพโหลด {file.uploadedAt}
                      </Text>
                    </Flex>
                  </Flex>
                  <Tooltip title="ลบไฟล์นี้">
                    <Button
                      size="small"
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => { removeLicenseAttachment(file.id); setUploadError(null); }}
                    />
                  </Tooltip>
                </Flex>
              ))}
            </Flex>
          )}

          <Upload
            accept=".pdf,.jpg,.jpeg,.png"
            showUploadList={false}
            beforeUpload={handleBeforeUpload}
            multiple={false}
            disabled={isUploading}
          >
            <Button
              icon={<PlusOutlined />}
              type="dashed"
              block
              loading={isUploading}
              disabled={isUploading}
              style={{ height: 40 }}
              onClick={() => setUploadError(null)}
            >
              {isUploading ? "กำลังอัปโหลด..." : "แนบไฟล์ใบประกอบวิชาชีพ (PDF, JPG, PNG)"}
            </Button>
          </Upload>

          {/* ข้อกำหนดไฟล์ */}
          <Flex
            vertical
            gap={4}
            style={{
              padding: "10px 14px",
              borderRadius: token.borderRadius,
              backgroundColor: token.colorFillQuaternary,
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <Flex align="center" gap={6}>
              <WarningFilled style={{ color: token.colorWarning, fontSize: 12 }} />
              <Text strong style={{ fontSize: 12, color: token.colorTextSecondary }}>
                ข้อกำหนดการอัปโหลด
              </Text>
            </Flex>
            <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
              • รองรับไฟล์{" "}
              <Text strong style={{ color: token.colorText }}>PDF, JPG, PNG</Text>
            </Text>
            <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
              • ขนาดไฟล์สูงสุด{" "}
              <Text strong style={{ color: token.colorError }}>{MAX_FILE_MB} MB</Text>{" "}
              ต่อไฟล์
            </Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};
