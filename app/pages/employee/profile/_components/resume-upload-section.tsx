"use client";

import {
  CheckCircleFilled,
  DeleteOutlined,
  ExclamationCircleFilled,
  FilePdfOutlined,
  PlusOutlined,
  WarningFilled,
} from "@ant-design/icons";
import {
  Alert,
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
import { useProfileStore } from "../_stores/profile-store";
import type { ResumeEntry } from "../_stores/profile-store";

const { Text } = Typography;

const MAX_FILE_MB = 10;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

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

  // state เก็บ error message เพื่อแสดง UI คำเตือน
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleBeforeUpload = (file: RcFile): boolean => {
    setUploadError(null);

    // 🔐 ตรวจประเภทไฟล์
    if (file.type !== "application/pdf") {
      setUploadError("ประเภทไฟล์ไม่ถูกต้อง — รองรับเฉพาะไฟล์ PDF เท่านั้น");
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
    if (resumes.some((r) => r.fileName === file.name)) {
      setUploadError(`ไฟล์ "${file.name}" ถูกแนบไปแล้ว`);
      return false;
    }

    const newResume: ResumeEntry = {
      id: `resume-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toLocaleDateString("th-TH"),
      file,
    };
    addResume(newResume);
    return false; // ป้องกัน auto-upload
  };

  return (
    <Flex vertical gap={16}>
      {/* ─── คำเตือน Error (แสดงเมื่อมี error) ─── */}
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
            <Text
              strong
              style={{ color: token.colorError, fontSize: 13 }}
            >
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
                      onClick={() => { removeResume(resume.id); setUploadError(null); }}
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
          onClick={() => setUploadError(null)}
        >
          แนบเรซูเม่ (PDF)
        </Button>
      </Upload>

      {/* ─── ข้อกำหนดไฟล์ ─── */}
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
          • รองรับเฉพาะไฟล์ <Text strong style={{ color: token.colorText }}>PDF</Text> เท่านั้น
        </Text>
        <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
          • ขนาดไฟล์สูงสุด{" "}
          <Text strong style={{ color: token.colorError }}>
            {MAX_FILE_MB} MB
          </Text>{" "}
          ต่อไฟล์
        </Text>
        <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
          • สามารถแนบได้หลายไฟล์ และเลือกเรซูเม่ที่กำลังใช้งาน
        </Text>
      </Flex>
    </Flex>
  );
};
