"use client";

// Banner header สำหรับโปรไฟล์โรงเรียน — แสดง Avatar, ชื่อ, badges และปุ่มใส่ภาพพื้นหลัง
import {
  BankOutlined,
  CheckCircleFilled,
  EnvironmentOutlined,
  PictureOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  App,
  Avatar,
  Badge,
  Button,
  Flex,
  Modal,
  Tag,
  Typography,
  Upload,
} from "antd";
import type { RcFile } from "antd/es/upload";
import Image from "next/image";
import { useState } from "react";

import { useAuthStore } from "@/app/stores/auth-store";
import { requestUploadAndSaveSchoolCover } from "../_api/school-profile.api";
import type { SchoolProfile } from "../_state/school-profile.state";

const { Title } = Typography;

interface SchoolProfileHeaderProps {
  profile: SchoolProfile;
  onEditClick: () => void;
  onCoverUpdated: (url: string) => void;
}

export const SchoolProfileHeader: React.FC<SchoolProfileHeaderProps> = ({
  profile,
  onEditClick,
  onCoverUpdated,
}) => {
  const { message } = App.useApp();
  const user = useAuthStore((s) => s.user);

  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // ✨ เลือกไฟล์ก่อน — แสดง preview โดยไม่ upload ทันที
  const handleBeforeUpload = (file: RcFile) => {
    const isImage = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
    if (!isImage) {
      message.error("รองรับเฉพาะไฟล์ JPG, PNG, WebP เท่านั้น");
      return Upload.LIST_IGNORE;
    }
    if (file.size > 10 * 1024 * 1024) {
      message.error("ขนาดไฟล์ต้องไม่เกิน 10 MB");
      return Upload.LIST_IGNORE;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    return false; // ป้องกัน antd upload อัตโนมัติ
  };

  // ✨ upload จริงเมื่อกด "บันทึก"
  const handleSaveCover = async () => {
    if (!selectedFile || !user?.user_id) return;
    setIsUploading(true);
    try {
      const url = await requestUploadAndSaveSchoolCover(user.user_id, selectedFile);
      onCoverUpdated(url);
      message.success("อัปโหลดภาพพื้นหลังสำเร็จ");
      setIsCoverModalOpen(false);
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch {
      message.error("อัปโหลดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelModal = () => {
    setIsCoverModalOpen(false);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  // ✨ รูปพื้นหลัง — ใช้ coverImageUrl ถ้ามี ไม่งั้น gradient
  const coverStyle = profile.coverImageUrl
    ? {}
    : {
        background:
          "linear-gradient(135deg, #001e45 0%, #0a4a8a 60%, #11b6f5 100%)",
      };

  return (
    <>
      <div
        style={{
          ...coverStyle,
          paddingBottom: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ภาพพื้นหลังที่ user อัปโหลด */}
        {profile.coverImageUrl && (
          <Image
            src={profile.coverImageUrl}
            alt="ภาพพื้นหลังโรงเรียน"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
        )}

        {/* Overlay gradient ทับภาพเพื่อให้ text อ่านได้ */}
        {profile.coverImageUrl && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)",
            }}
          />
        )}

        {/* Decorative illustration (แสดงเฉพาะเมื่อยังไม่มี cover) */}
        {!profile.coverImageUrl && (
          <div
            style={{
              position: "absolute",
              right: 40,
              bottom: 0,
              width: 280,
              height: 220,
              opacity: 0.12,
              pointerEvents: "none",
            }}
          >
            <Image
              src="/images/flat/undraw_hiring_8szx.svg"
              alt=""
              fill
              style={{ objectFit: "contain", objectPosition: "bottom" }}
            />
          </div>
        )}

        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "40px 24px 0",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Top row — avatar + name + action */}
          <Flex align="flex-start" gap={20} wrap="wrap">
            <Badge
              count={
                <CheckCircleFilled style={{ color: "#52c41a", fontSize: 16 }} />
              }
              offset={[-8, 88]}
            >
              <Avatar
                size={100}
                icon={!profile.logoUrl ? <BankOutlined /> : undefined}
                src={profile.logoUrl || undefined}
                style={{
                  background:
                    "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 100%)",
                  border: "4px solid rgba(255,255,255,0.25)",
                  flexShrink: 0,
                  fontSize: 36,
                  color: "#fff",
                }}
              >
                {!profile.logoUrl && profile.name?.charAt(0)}
              </Avatar>
            </Badge>

            <Flex vertical gap={8} style={{ flex: 1, minWidth: 200 }}>
              <Title
                level={2}
                style={{ color: "white", margin: 0, lineHeight: 1.2 }}
              >
                {profile.name}
              </Title>
              <Flex gap={8} wrap="wrap">
                {profile.type && (
                  <Tag color="gold" style={{ fontSize: 13, margin: 0 }}>
                    {profile.type}
                  </Tag>
                )}
                {profile.affiliation && (
                  <Tag
                    color="default"
                    style={{
                      fontSize: 13,
                      margin: 0,
                      background: "rgba(255,255,255,0.12)",
                      borderColor: "rgba(255,255,255,0.25)",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {profile.affiliation.split(" ")[0]}
                  </Tag>
                )}
                <Tag
                  icon={<EnvironmentOutlined />}
                  color="default"
                  style={{
                    fontSize: 13,
                    margin: 0,
                    background: "rgba(255,255,255,0.15)",
                    borderColor: "rgba(255,255,255,0.3)",
                    color: "white",
                  }}
                >
                  {[profile.district, profile.location]
                    .filter(Boolean)
                    .join(", ")}
                </Tag>
              </Flex>
            </Flex>

            <Flex gap={8}>
              <Button
                icon={<PictureOutlined />}
                onClick={() => setIsCoverModalOpen(true)}
                style={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(6px)",
                  flexShrink: 0,
                }}
              >
                ใส่ภาพพื้นหลัง
              </Button>
            </Flex>
          </Flex>

          <div style={{ height: 32 }} />
        </div>
      </div>

      {/* Modal อัปโหลดภาพพื้นหลัง */}
      <Modal
        title="ใส่ภาพพื้นหลัง"
        open={isCoverModalOpen}
        onCancel={handleCancelModal}
        onOk={handleSaveCover}
        okText="บันทึก"
        cancelText="ยกเลิก"
        okButtonProps={{ disabled: !selectedFile, loading: isUploading }}
        width={560}
      >
        <Flex vertical gap={16} style={{ padding: "8px 0" }}>
          {/* Preview ภาพที่เลือก */}
          {previewUrl ? (
            <div
              style={{
                width: "100%",
                height: 200,
                borderRadius: 12,
                overflow: "hidden",
                position: "relative",
                background: "#f0f0f0",
              }}
            >
              <Image
                src={previewUrl}
                alt="preview"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          ) : profile.coverImageUrl ? (
            <div
              style={{
                width: "100%",
                height: 200,
                borderRadius: 12,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Image
                src={profile.coverImageUrl}
                alt="ภาพพื้นหลังปัจจุบัน"
                fill
                style={{ objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  fontSize: 12,
                  padding: "2px 8px",
                  borderRadius: 6,
                }}
              >
                ภาพปัจจุบัน
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: 200,
                borderRadius: 12,
                background: "linear-gradient(135deg, #001e45 0%, #11b6f5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PictureOutlined style={{ fontSize: 48, color: "rgba(255,255,255,0.4)" }} />
            </div>
          )}

          <Upload
            accept="image/jpeg,image/png,image/webp"
            showUploadList={false}
            beforeUpload={handleBeforeUpload}
          >
            <Button icon={<UploadOutlined />} block>
              {selectedFile ? "เปลี่ยนรูป" : "เลือกภาพพื้นหลัง"}
            </Button>
          </Upload>

          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            รองรับ JPG, PNG, WebP · ขนาดไม่เกิน 10 MB · แนะนำ 1200×400px ขึ้นไป
          </Typography.Text>
        </Flex>
      </Modal>
    </>
  );
};
