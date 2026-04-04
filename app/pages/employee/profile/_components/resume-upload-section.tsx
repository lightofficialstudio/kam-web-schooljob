"use client";

import {
  CheckCircleFilled,
  DeleteOutlined,
  FilePdfOutlined,
  PlusOutlined,
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
import { useProfileStore } from "../_stores/profile-store";
import type { ResumeEntry } from "../_stores/profile-store";

const { Text } = Typography;

// แปลงขนาดไฟล์ bytes → KB / MB อ่านง่าย
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Section แนบเรซูเม่ — รองรับหลายไฟล์ และเลือกไฟล์ที่กำลังใช้งาน
export const ResumeUploadSection: React.FC = () => {
  const { token } = theme.useToken();
  const { profile, addResume, removeResume, setActiveResume } = useProfileStore();

  const resumes = profile.resumes ?? [];
  const activeResumeId = profile.activeResumeId ?? null;

  // ตรวจสอบไฟล์ก่อน upload — รองรับเฉพาะ PDF ไม่เกิน 5 MB
  const handleBeforeUpload = (file: RcFile): boolean => {
    const isPDF = file.type === "application/pdf";
    const isUnder5MB = file.size / 1024 / 1024 < 5;

    if (!isPDF) {
      message.error("รองรับเฉพาะไฟล์ PDF เท่านั้น");
      return false;
    }
    if (!isUnder5MB) {
      message.error("ขนาดไฟล์ต้องไม่เกิน 5 MB");
      return false;
    }

    const isDuplicate = resumes.some((r) => r.fileName === file.name);
    if (isDuplicate) {
      message.warning(`ไฟล์ "${file.name}" ถูกแนบไปแล้ว`);
      return false;
    }

    // สร้าง ResumeEntry แล้วเพิ่มเข้า store ทันที
    const newResume: ResumeEntry = {
      id: `resume-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toLocaleDateString("th-TH"),
      file,
    };
    addResume(newResume);
    message.success(`แนบไฟล์ "${file.name}" สำเร็จ`);
    return false; // ป้องกัน auto-upload
  };

  return (
    <Flex vertical gap={16}>
      {/* ─── รายการเรซูเม่ที่แนบแล้ว ─── */}
      {resumes.length > 0 && (
        <Flex vertical gap={10}>
          {resumes.map((resume) => {
            const isActive = resume.id === activeResumeId;
            return (
              <Flex
                key={resume.id}
                align="center"
                justify="space-between"
                style={{
                  padding: "12px 16px",
                  borderRadius: token.borderRadius,
                  border: `1.5px solid ${isActive ? token.colorPrimary : token.colorBorderSecondary}`,
                  backgroundColor: isActive
                    ? `${token.colorPrimary}0d`
                    : token.colorFillQuaternary,
                }}
              >
                {/* ซ้าย: ไอคอน + ชื่อไฟล์ + ขนาด */}
                <Flex align="center" gap={10}>
                  <FilePdfOutlined
                    style={{ fontSize: 22, color: "#ff4d4f", flexShrink: 0 }}
                  />
                  <Flex vertical gap={2}>
                    <Flex align="center" gap={8}>
                      <Text strong style={{ fontSize: 13 }}>
                        {resume.fileName}
                      </Text>
                      {isActive && (
                        <Tag
                          icon={<CheckCircleFilled />}
                          color="processing"
                          style={{ fontSize: 11, margin: 0 }}
                        >
                          กำลังใช้งาน
                        </Tag>
                      )}
                    </Flex>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {formatFileSize(resume.fileSize)} · อัพโหลด {resume.uploadedAt}
                    </Text>
                  </Flex>
                </Flex>

                {/* ขวา: ปุ่ม set active + ลบ */}
                <Flex gap={8} align="center">
                  {!isActive && (
                    <Button
                      size="small"
                      type="default"
                      style={{ fontSize: 12 }}
                      onClick={() => setActiveResume(resume.id)}
                    >
                      ตั้งเป็นที่ใช้งาน
                    </Button>
                  )}
                  <Tooltip title="ลบไฟล์นี้">
                    <Button
                      size="small"
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeResume(resume.id)}
                    />
                  </Tooltip>
                </Flex>
              </Flex>
            );
          })}
        </Flex>
      )}

      {/* ─── ปุ่มเพิ่มเรซูเม่ ─── */}
      <Upload
        accept=".pdf"
        showUploadList={false}
        beforeUpload={handleBeforeUpload}
        multiple={false}
      >
        <Button
          icon={<PlusOutlined />}
          type="dashed"
          block
          style={{ height: 44 }}
        >
          แนบเรซูเม่ (PDF)
        </Button>
      </Upload>

      {/* ─── หมายเหตุ ─── */}
      <Flex vertical gap={2}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          • รองรับเฉพาะไฟล์ PDF · ขนาดไม่เกิน 5 MB ต่อไฟล์
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          • สามารถแนบได้หลายไฟล์ และเลือกว่าไฟล์ไหนคือเรซูเม่ที่กำลังใช้งาน
        </Text>
      </Flex>
    </Flex>
  );
};
