"use client";

// Sidebar card แสดงข้อมูลติดต่อ, badges, และ gallery ของโรงเรียน
import {
  BankOutlined,
  CheckCircleFilled,
  CrownOutlined,
  EditOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  LoadingOutlined,
  MailOutlined,
  PhoneOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Divider,
  Empty,
  Flex,
  message,
  Tag,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import type { RcFile } from "antd/es/upload";
import Image from "next/image";
import { useState } from "react";

import { uploadFile } from "@/app/lib/storage";
import { useAuthStore } from "@/app/stores/auth-store";
import type { SchoolProfile } from "../_state/school-profile.state";
import { useSchoolProfileState } from "../_state/school-profile.state";

const { Title, Text, Link } = Typography;

interface SchoolProfileSidebarProps {
  profile: SchoolProfile;
  onEditClick: () => void;
}

export const SchoolProfileSidebar: React.FC<SchoolProfileSidebarProps> = ({
  profile,
  onEditClick,
}) => {
  const { saveProfile, setProfile } = useSchoolProfileState();
  const { user } = useAuthStore();
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // ✨ อัปโหลดโลโก้โรงเรียนไป Supabase Storage แล้ว save URL ลง DB
  const handleLogoBeforeUpload = (file: RcFile): boolean => {
    const isImage = ["image/jpeg", "image/png", "image/webp"].includes(
      file.type,
    );
    if (!isImage) {
      message.error("รองรับเฉพาะไฟล์ JPG / PNG / WebP เท่านั้น");
      return false;
    }
    if (file.size / 1024 / 1024 > 2) {
      message.error("ขนาดไฟล์ต้องไม่เกิน 2MB");
      return false;
    }
    if (!user?.user_id) {
      message.error("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
      return false;
    }

    (async () => {
      setIsUploadingLogo(true);
      try {
        const result = await uploadFile("avatars", user.user_id, file);
        const updated = { ...profile, logoUrl: result.url };
        setProfile(updated);
        await saveProfile(updated, user.user_id);
        message.success("อัปโหลดโลโก้สำเร็จ");
        console.log("✅ [Sidebar] อัปโหลดโลโก้โรงเรียนสำเร็จ:", result.url);
      } catch (err) {
        console.error("❌ [Sidebar] อัปโหลดโลโก้ไม่สำเร็จ:", err);
        message.error("อัปโหลดโลโก้ไม่สำเร็จ กรุณาลองใหม่");
      } finally {
        setIsUploadingLogo(false);
      }
    })();

    return false; // ยับยั้ง Ant Design auto-upload
  };

  return (
    <Flex vertical gap={20}>
      {/* ─── Profile Card ─── */}
      <Card
        variant="borderless"
        styles={{ body: { padding: "28px 20px" } }}
        style={{ borderRadius: 16, overflow: "hidden" }}
      >
        <Flex vertical align="center" gap={16}>
          {/* Avatar + Upload overlay */}
          <div style={{ position: "relative" }}>
            <Avatar
              size={120}
              icon={!profile.logoUrl ? <BankOutlined /> : undefined}
              src={profile.logoUrl || undefined}
              style={{
                background: "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 100%)",
                border: "4px solid white",
                boxShadow: "0 4px 16px rgba(17,182,245,0.25)",
                fontSize: 40,
                color: "#fff",
              }}
            />
            <div
              style={{ position: "absolute", bottom: 2, right: 2, zIndex: 2 }}
            >
              <Tooltip title="เปลี่ยนโลโก้โรงเรียน">
                <Upload
                  name="file"
                  showUploadList={false}
                  beforeUpload={handleLogoBeforeUpload}
                  accept="image/jpeg,image/png,image/webp"
                  disabled={isUploadingLogo}
                >
                  <Button
                    type="primary"
                    shape="circle"
                    size="small"
                    loading={isUploadingLogo}
                    icon={
                      isUploadingLogo ? (
                        <LoadingOutlined style={{ fontSize: 12 }} />
                      ) : (
                        <EditOutlined style={{ fontSize: 12 }} />
                      )
                    }
                    style={{
                      width: 28,
                      height: 28,
                      minWidth: 28,
                      backgroundColor: "#001e45",
                      borderColor: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                    }}
                  />
                </Upload>
              </Tooltip>
            </div>
          </div>

          {/* Name + verification */}
          <Flex vertical align="center" gap={6}>
            <Title level={4} style={{ margin: 0, textAlign: "center" }}>
              {profile.name}
            </Title>
            <Flex gap={6} wrap="wrap" justify="center">
              <Tag icon={<CheckCircleFilled />} color="success" style={{ fontSize: 12 }}>
                ยืนยันตัวตนแล้ว
              </Tag>
              {profile.type && (
                <Tag color="blue" style={{ fontSize: 12 }}>{profile.type}</Tag>
              )}
              {/* ✨ แสดง Account Plan badge */}
              {profile.accountPlan && profile.accountPlan !== "basic" && (
                <Tag
                  icon={<CrownOutlined />}
                  color={profile.accountPlan === "enterprise" ? "purple" : "gold"}
                  style={{ fontSize: 12 }}
                >
                  {profile.accountPlan === "premium" ? "Premium" : profile.accountPlan === "enterprise" ? "Enterprise" : profile.accountPlan}
                </Tag>
              )}
            </Flex>
          </Flex>

          <Divider style={{ margin: "8px 0" }} />

          {/* Contact info using Descriptions */}
          <Descriptions
            column={1}
            size="small"
            style={{ width: "100%" }}
            styles={{
              label: { color: "var(--ant-color-text-secondary)", minWidth: 28 },
            }}
          >
            <Descriptions.Item label={<EnvironmentOutlined />}>
              <Text>
                {[profile.district, profile.location].filter(Boolean).join(", ")}
              </Text>
            </Descriptions.Item>
            {profile.website && (
              <Descriptions.Item label={<GlobalOutlined />}>
                <Link
                  href={`https://${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.website}
                </Link>
              </Descriptions.Item>
            )}
            <Descriptions.Item label={<MailOutlined />}>
              <Text copyable>{profile.email}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={<PhoneOutlined />}>
              <Text>{profile.phone}</Text>
            </Descriptions.Item>
          </Descriptions>

          {profile.levels && profile.levels.length > 0 && (
            <Flex gap={6} wrap="wrap" justify="center">
              {profile.levels.map((level) => (
                <Tag key={level} style={{ fontSize: 12 }}>
                  {level}
                </Tag>
              ))}
            </Flex>
          )}

          <Button
            block
            type="primary"
            size="large"
            icon={<EditOutlined />}
            onClick={onEditClick}
            style={{
              marginTop: 8,
              height: 48,
              borderRadius: 10,
              background: "#001e45",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            แก้ไขข้อมูลโรงเรียน
          </Button>
        </Flex>
      </Card>

      {/* ─── Gallery Card ─── */}
      {profile.gallery && profile.gallery.length > 0 ? (
        <Card
          title={
            <Flex align="center" gap={8}>
              <PictureOutlined style={{ color: "#11b6f5" }} />
              <span>ภาพถ่ายโรงเรียน</span>
            </Flex>
          }
          variant="borderless"
          style={{ borderRadius: 16 }}
        >
          <Flex vertical gap={12}>
            {profile.gallery.map((img, idx) => (
              <div
                key={idx}
                style={{
                  width: "100%",
                  height: 160,
                  position: "relative",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={img}
                  alt={`School photo ${idx + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 280px"
                />
              </div>
            ))}
          </Flex>
        </Card>
      ) : (
        <Card variant="borderless" style={{ borderRadius: 16 }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="ยังไม่มีภาพถ่ายโรงเรียน"
          />
        </Card>
      )}
    </Flex>
  );
};
