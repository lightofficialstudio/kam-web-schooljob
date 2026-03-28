"use client";

// Sidebar card แสดงข้อมูลติดต่อ, badges, และ gallery ของโรงเรียน
import {
  BankOutlined,
  CheckCircleFilled,
  EditOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
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
  Typography,
  Upload,
} from "antd";
import Image from "next/image";

import type { SchoolProfile } from "../_state/school-profile.state";

const { Title, Text, Link } = Typography;

interface SchoolProfileSidebarProps {
  profile: SchoolProfile;
  onEditClick: () => void;
}

// Upload props สำหรับเปลี่ยนรูปโลโก้โรงเรียน
const buildUploadProps = (): UploadProps => ({
  name: "file",
  showUploadList: false,
  beforeUpload: (file) => {
    const isImage = ["image/jpeg", "image/png", "image/webp"].includes(
      file.type,
    );
    if (!isImage) {
      message.error("รองรับเฉพาะไฟล์ JPG / PNG / WebP เท่านั้น");
      return Upload.LIST_IGNORE;
    }
    if (file.size / 1024 / 1024 > 2) {
      message.error("ขนาดไฟล์ต้องไม่เกิน 2MB");
      return Upload.LIST_IGNORE;
    }
    return false; // ยับยั้ง auto-upload, จัดการเองผ่าน customRequest
  },
  customRequest: ({ onSuccess }) => {
    setTimeout(() => onSuccess?.("ok"), 800);
  },
  onChange: ({ file }) => {
    if (file.status === "done") {
      message.success("อัปโหลดรูปโลโก้สำเร็จ (จำลอง)");
    }
  },
});

export const SchoolProfileSidebar: React.FC<SchoolProfileSidebarProps> = ({
  profile,
  onEditClick,
}) => {
  const uploadProps = buildUploadProps();

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
              icon={<BankOutlined />}
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`}
              style={{
                backgroundColor: "#e60278",
                border: "4px solid white",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              }}
            />
            <div
              style={{ position: "absolute", bottom: 2, right: 2, zIndex: 2 }}
            >
              <Upload {...uploadProps}>
                <Button
                  type="primary"
                  shape="circle"
                  size="small"
                  icon={<EditOutlined style={{ fontSize: 12 }} />}
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
            </div>
          </div>

          {/* Name + verification */}
          <Flex vertical align="center" gap={6}>
            <Title level={4} style={{ margin: 0, textAlign: "center" }}>
              {profile.name}
            </Title>
            <Flex gap={6} wrap="wrap" justify="center">
              <Tag
                icon={<CheckCircleFilled />}
                color="success"
                style={{ fontSize: 12 }}
              >
                ยืนยันตัวตนแล้ว
              </Tag>
              <Tag color="blue" style={{ fontSize: 12 }}>
                {profile.type}
              </Tag>
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
              <Text>{profile.location}</Text>
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
