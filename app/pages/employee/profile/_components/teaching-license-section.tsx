"use client";

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import {
  Button,
  Flex,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
  theme,
} from "antd";
import type { RcFile } from "antd/es/upload";
import React from "react";
import type { ResumeEntry } from "../_stores/profile-store";
import { useProfileStore } from "../_stores/profile-store";

const { Text } = Typography;

// Config สถานะใบประกอบวิชาชีพ
const LICENSE_STATUS_OPTIONS: {
  value: NonNullable<ReturnType<typeof useProfileStore.getState>["profile"]["licenseStatus"]>;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: "has_license",
    label: "มีใบอนุญาต",
    icon: <CheckCircleOutlined />,
    color: "#52c41a",
  },
  {
    value: "pending",
    label: "อยู่ระหว่างขอ",
    icon: <ClockCircleOutlined />,
    color: "#faad14",
  },
  {
    value: "no_license",
    label: "ไม่มีใบอนุญาต",
    icon: <CloseCircleOutlined />,
    color: "#ff4d4f",
  },
  {
    value: "not_required",
    label: "ตำแหน่งของฉันไม่ต้องใช้ใบอนุญาต",
    icon: <MinusCircleOutlined />,
    color: "#8c8c8c",
  },
];

// แปลงขนาดไฟล์ bytes → KB/MB
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Section สถานะใบประกอบวิชาชีพ + แนบไฟล์
export const TeachingLicenseSection: React.FC = () => {
  const { token } = theme.useToken();
  const { profile, setLicenseStatus, addLicenseAttachment, removeLicenseAttachment } =
    useProfileStore();

  const currentStatus = profile.licenseStatus ?? "";
  const attachments = profile.licenseAttachments ?? [];

  // แสดงส่วนแนบไฟล์เฉพาะเมื่อมีหรืออยู่ระหว่างขอใบอนุญาต
  const showAttachment = currentStatus === "has_license" || currentStatus === "pending";

  const handleBeforeUpload = (file: RcFile): boolean => {
    const isValidType = ["application/pdf", "image/jpeg", "image/png"].includes(file.type);
    const isUnder5MB = file.size / 1024 / 1024 < 5;

    if (!isValidType) {
      message.error("รองรับเฉพาะไฟล์ PDF, JPG, PNG เท่านั้น");
      return false;
    }
    if (!isUnder5MB) {
      message.error("ขนาดไฟล์ต้องไม่เกิน 5 MB");
      return false;
    }
    const isDuplicate = attachments.some((f) => f.fileName === file.name);
    if (isDuplicate) {
      message.warning(`ไฟล์ "${file.name}" ถูกแนบไปแล้ว`);
      return false;
    }

    const newFile: ResumeEntry = {
      id: `lic-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toLocaleDateString("th-TH"),
      file,
    };
    addLicenseAttachment(newFile);
    message.success(`แนบไฟล์ "${file.name}" สำเร็จ`);
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
                onClick={() => setLicenseStatus(opt.value)}
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
                  style={{
                    fontSize: 13,
                    color: isSelected ? opt.color : token.colorText,
                  }}
                >
                  {opt.label}
                </Text>
                {isSelected && (
                  <Tag
                    color={opt.color === "#52c41a" ? "success" : opt.color === "#faad14" ? "warning" : opt.color === "#ff4d4f" ? "error" : "default"}
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

      {/* ─── แนบไฟล์ใบประกอบวิชาชีพ (แสดงเฉพาะเมื่อมีหรืออยู่ระหว่างขอ) ─── */}
      {showAttachment && (
        <Flex vertical gap={10}>
          <Text strong style={{ fontSize: 13 }}>
            แนบไฟล์ใบประกอบวิชาชีพ
          </Text>

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
                      <Text strong style={{ fontSize: 13 }}>
                        {file.fileName}
                      </Text>
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
                      onClick={() => removeLicenseAttachment(file.id)}
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
          >
            <Button icon={<PlusOutlined />} type="dashed" block style={{ height: 40 }}>
              แนบไฟล์ใบประกอบวิชาชีพ (PDF, JPG, PNG)
            </Button>
          </Upload>

          <Text type="secondary" style={{ fontSize: 12 }}>
            • รองรับ PDF, JPG, PNG · ขนาดไม่เกิน 5 MB ต่อไฟล์
          </Text>
        </Flex>
      )}
    </Flex>
  );
};
