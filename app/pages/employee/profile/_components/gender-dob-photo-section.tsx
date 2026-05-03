"use client";

import { ModalComponent } from "@/app/components/modal/modal.component";
import { uploadFile } from "@/app/lib/storage";
import { CameraOutlined, CheckCircleFilled, UserOutlined } from "@ant-design/icons";
import { Avatar, Col, Form, type FormInstance, Input, Row, Select, theme } from "antd";
import React, { useRef, useState } from "react";
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
  const { profile, setProfile } = useProfileStore();

  const [modal, setModal] = useState<ModalState>(MODAL_CLOSED);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeModal = () => setModal(MODAL_CLOSED);

  // ✨ แสดง previewUrl ก่อน (ระหว่าง upload) → รูปที่บันทึกไว้ → null (ไม่มีรูป)
  const displayUrl = previewUrl ?? profile.profileImageUrl ?? null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // ✨ reset เพื่อให้เลือกไฟล์เดิมซ้ำได้

    // 🔐 ตรวจสอบประเภทไฟล์
    if (!ALLOWED_MIME.includes(file.type)) {
      setModal({
        open: true,
        type: "error",
        title: "ประเภทไฟล์ไม่ถูกต้อง",
        description: "รองรับเฉพาะไฟล์ JPEG, PNG และ WebP เท่านั้น",
      });
      return;
    }

    // 🔐 ตรวจสอบขนาดไฟล์ ≤ 10 MB
    if (file.size > MAX_FILE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setModal({
        open: true,
        type: "error",
        title: "ไฟล์มีขนาดใหญ่เกินไป",
        description: `ไฟล์ "${file.name}" มีขนาด ${sizeMB} MB เกินขีดจำกัด 10 MB`,
      });
      return;
    }

    // ✨ แสดง preview ทันทีก่อน upload จริง
    setPreviewUrl(URL.createObjectURL(file));

    // ✨ Upload จริงผ่าน async IIFE — ป้องกัน async event handler
    (async () => {
      setIsUploading(true);
      try {
        const result = await uploadFile("avatars", userId, file);
        form.setFieldValue("profileImageUrl", result.url);
        setProfile({ profileImageUrl: result.url });
        setPreviewUrl(result.url);
        // ✨ แสดง success state 1.8 วินาที
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1800);
      } catch (err: unknown) {
        const axiosErr = err as {
          response?: { data?: { message_th?: string } };
          message?: string;
        };
        setPreviewUrl(null);
        setModal({
          open: true,
          type: "error",
          title: "อัปโหลดรูปภาพไม่สำเร็จ",
          description:
            axiosErr?.response?.data?.message_th ??
            axiosErr?.message ??
            "เกิดข้อผิดพลาดในการอัปโหลด กรุณาลองใหม่",
          errorDetails: err,
        });
      } finally {
        setIsUploading(false);
      }
    })();
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
              rules={[{ required: true, message: "กรุณาเลือกเพศ" }]}
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
              rules={[{ required: true, message: "กรุณาระบุวันเกิด" }]}
            >
              <Input type="date" />
            </Form.Item>
          </Col>
        </Row>

        {/* ✨ Avatar Upload Zone — คลิกที่รูปเพื่ออัปโหลดได้เลย */}
        <Form.Item label="รูปโปรไฟล์" name="profileImageUrl">
          <div className="flex items-start gap-5">
            {/* ─── Hidden file input ─── */}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleFileChange}
            />

            {/* ─── Clickable Avatar Zone ─── */}
            <div
              className="group relative flex-shrink-0"
              style={{
                width: 112,
                height: 112,
                cursor: isUploading ? "wait" : "pointer",
              }}
              onClick={() => !isUploading && inputRef.current?.click()}
            >
              {/* Spinning ring ขณะ upload — อยู่นอก overflow-hidden */}
              {isUploading && (
                <div
                  className="absolute animate-spin rounded-full pointer-events-none"
                  style={{
                    inset: -5,
                    border: `4px solid ${token.colorPrimaryBg}`,
                    borderTopColor: token.colorPrimary,
                  }}
                />
              )}

              {/* Hover ring — scale in เมื่อ hover */}
              {!isUploading && !showSuccess && (
                <div
                  className="absolute rounded-full pointer-events-none
                    opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
                    transition-all duration-300"
                  style={{
                    inset: -5,
                    border: `2px dashed ${token.colorPrimary}`,
                  }}
                />
              )}

              {/* Success ring — แสดงเมื่ออัปโหลดสำเร็จ */}
              {showSuccess && (
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    inset: -4,
                    border: `3px solid #52c41a`,
                    boxShadow: `0 0 0 3px rgba(82,196,26,0.15)`,
                  }}
                />
              )}

              {/* ─── Avatar + Overlays (ถูก clip เป็นวงกลม) ─── */}
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Avatar
                  size={112}
                  icon={!displayUrl ? <UserOutlined /> : undefined}
                  src={displayUrl || undefined}
                  style={{
                    backgroundColor: token.colorFillTertiary,
                    border: `2px solid ${token.colorBorderSecondary}`,
                    fontSize: 42,
                    display: "block",
                  }}
                />

                {/* Hover overlay — camera icon + ข้อความ slide up */}
                {!isUploading && !showSuccess && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center
                      bg-transparent group-hover:bg-black/50
                      transition-all duration-300"
                  >
                    <span
                      className="transform translate-y-3 opacity-0
                        group-hover:translate-y-0 group-hover:opacity-100
                        transition-all duration-300 delay-75"
                      style={{ color: "white", fontSize: 22, lineHeight: 1 }}
                    >
                      <CameraOutlined />
                    </span>
                    <span
                      className="text-white text-xs font-medium mt-1.5
                        transform translate-y-3 opacity-0
                        group-hover:translate-y-0 group-hover:opacity-100
                        transition-all duration-300 delay-100"
                    >
                      เปลี่ยนรูป
                    </span>
                  </div>
                )}

                {/* Uploading overlay — spinner กลางรูป */}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                    <div
                      className="w-7 h-7 rounded-full animate-spin"
                      style={{
                        border: "3px solid rgba(255,255,255,0.25)",
                        borderTopColor: "white",
                      }}
                    />
                  </div>
                )}

                {/* Success overlay — checkmark + สีเขียวอ่อน */}
                {showSuccess && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(82,196,26,0.28)" }}
                  >
                    <CheckCircleFilled style={{ color: "white", fontSize: 32 }} />
                  </div>
                )}
              </div>
            </div>

            {/* ─── Info Panel ─── */}
            <div className="flex flex-col gap-2 pt-2 flex-1 min-w-0">
              <p
                className="text-sm font-semibold m-0"
                style={{ color: token.colorText }}
              >
                รูปโปรไฟล์ของคุณ
              </p>

              {/* ✨ Status text — สลับตาม state */}
              {isUploading ? (
                <p
                  className="text-xs m-0 animate-pulse"
                  style={{ color: token.colorPrimary }}
                >
                  กำลังอัปโหลด...
                </p>
              ) : showSuccess ? (
                <p
                  className="text-xs m-0 font-medium"
                  style={{ color: "#52c41a" }}
                >
                  ✓ อัปโหลดสำเร็จ — กด &apos;บันทึก&apos; เพื่อยืนยัน
                </p>
              ) : (
                <p
                  className="text-xs m-0"
                  style={{ color: token.colorTextSecondary }}
                >
                  คลิกที่รูปเพื่ออัปโหลดรูปภาพใหม่
                </p>
              )}

              {/* ─── Format pills + size badge ─── */}
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {["JPEG", "PNG", "WebP"].map((fmt) => (
                  <span
                    key={fmt}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: token.colorFillTertiary,
                      color: token.colorTextSecondary,
                      border: `1px solid ${token.colorBorderSecondary}`,
                    }}
                  >
                    {fmt}
                  </span>
                ))}
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: token.colorErrorBg,
                    color: token.colorError,
                    border: `1px solid ${token.colorErrorBorder}`,
                  }}
                >
                  สูงสุด 10 MB
                </span>
              </div>
            </div>
          </div>
        </Form.Item>
      </div>
    </>
  );
};
