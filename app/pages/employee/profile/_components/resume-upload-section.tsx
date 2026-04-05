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
  Button,
  Flex,
  Modal,
  Tag,
  Tooltip,
  Typography,
  Upload,
  theme,
} from "antd";
import type { RcFile } from "antd/es/upload";
import React, { useState } from "react";
import { deleteFile, uploadFile } from "@/app/lib/storage";
import { useProfileStore } from "../_stores/profile-store";
import type { ResumeEntry } from "../_stores/profile-store";

// ✨ parse storage path จาก Supabase public URL
// URL รูปแบบ: .../storage/v1/object/public/resumes/{userId}/{filename}
const parseStoragePath = (url: string, bucket: string): string | null => {
  try {
    const marker = `/object/public/${bucket}/`;
    const idx = url.indexOf(marker);
    return idx !== -1 ? url.slice(idx + marker.length) : null;
  } catch {
    return null;
  }
};

const { Text } = Typography;

const MAX_FILE_MB = 10;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

// แปลงขนาดไฟล์ bytes → KB / MB อ่านง่าย
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface ResumeUploadSectionProps {
  userId: string;
}

// Section แนบเรซูเม่ — รองรับหลายไฟล์ และเลือกไฟล์ที่กำลังใช้งาน
export const ResumeUploadSection: React.FC<ResumeUploadSectionProps> = ({ userId }) => {
  const { token } = theme.useToken();
  const { profile, addResume, removeResume, setActiveResume, saveProfile } = useProfileStore();

  const resumes = profile.resumes ?? [];
  const activeResumeId = profile.activeResumeId ?? null;

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ✨ ลบเรซูเม่: ลบออกจาก Supabase Storage + ลบออกจาก DB ผ่าน saveProfile
  const handleDeleteResume = async (resume: ResumeEntry) => {
    setDeletingId(resume.id);
    try {
      // 1. ลบไฟล์จาก Storage (ถ้ามี url)
      if (resume.url) {
        const path = parseStoragePath(resume.url, "resumes");
        if (path) {
          await deleteFile("resumes", path);
        }
      }
      // 2. ลบออกจาก store (synchronous)
      removeResume(resume.id);
      // 3. บันทึกสถานะใหม่ลง DB
      await saveProfile(userId);
      setUploadError(null);
      console.log("✅ [ResumeUploadSection] ลบเรซูเม่สำเร็จ:", resume.fileName);
    } catch (err) {
      console.error("❌ [ResumeUploadSection] ลบเรซูเม่ไม่สำเร็จ:", err);
      setUploadError(`ลบไฟล์ "${resume.fileName}" ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง`);
    } finally {
      setDeletingId(null);
    }
  };

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

    // ✨ Upload จริงไป Supabase Storage แล้ว save ลง DB ผ่าน saveProfile
    (async () => {
      setIsUploading(true);
      try {
        const result = await uploadFile("resumes", userId, file);

        // ✅ เพิ่ม resume entry ใน store พร้อม url จาก Storage (synchronous)
        const newResume: ResumeEntry = {
          id: `resume-${Date.now()}`,
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toLocaleDateString("th-TH"),
          url: result.url,
        };
        addResume(newResume);

        // ✅ บันทึก resumes ลง DB ทันที
        await saveProfile(userId);
        console.log("✅ [ResumeUploadSection] อัปโหลดและบันทึกเรซูเม่สำเร็จ:", result.url);
      } catch (err) {
        console.error("❌ [ResumeUploadSection] upload error:", err);
        setUploadError(`อัปโหลดไฟล์ "${file.name}" ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง`);
      } finally {
        setIsUploading(false);
      }
    })();

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
                      loading={deletingId === resume.id}
                      disabled={deletingId === resume.id}
                      onClick={() => handleDeleteResume(resume)}
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
        disabled={isUploading}
      >
        <Button
          icon={<PlusOutlined />}
          type="dashed"
          block
          loading={isUploading}
          disabled={isUploading}
          style={{ height: 44 }}
          onClick={() => setUploadError(null)}
        >
          {isUploading ? "กำลังอัปโหลด..." : "แนบเรซูเม่ (PDF)"}
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
