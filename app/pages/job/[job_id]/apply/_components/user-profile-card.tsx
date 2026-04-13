"use client";

import {
  EditOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  theme as antTheme,
  Avatar,
  Button,
  Card,
  Layout,
  Skeleton,
  Space,
  Typography,
} from "antd";
import Link from "next/link";
import { useApplyStore } from "../_state/apply-store";

const { Title, Text } = Typography;

export default function UserProfileCard() {
  const { token } = antTheme.useToken();
  const { profile, isLoadingProfile } = useApplyStore();

  if (isLoadingProfile) {
    return (
      <Card style={{ borderRadius: token.borderRadiusLG * 2, marginBottom: 40 }}>
        <Skeleton active avatar paragraph={{ rows: 3 }} />
      </Card>
    );
  }

  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "ไม่ระบุชื่อ";

  return (
    <Card
      variant="borderless"
      style={{
        background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorInfoActive} 100%)`,
        borderRadius: token.borderRadiusLG * 2,
        position: "relative",
        overflow: "hidden",
        marginBottom: 40,
        boxShadow: token.boxShadowSecondary,
      }}
      styles={{ body: { padding: 32 } }}
    >
      <Layout
        style={{
          position: "absolute",
          right: -50,
          bottom: -50,
          width: 200,
          height: 200,
          backgroundColor: token.colorError,
          borderRadius: "50%",
          opacity: 0.15,
        }}
      />
      <Layout
        style={{
          position: "absolute",
          right: 20,
          top: -30,
          width: 100,
          height: 100,
          backgroundColor: token.colorInfoActive,
          borderRadius: "50%",
          opacity: 0.3,
        }}
      />

      <Space orientation="vertical" style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <Space size={16} align="center">
          <Avatar
            size={56}
            src={profile?.profileImageUrl}
            icon={<UserOutlined />}
            style={{ border: `2px solid ${token.colorWhite}`, flexShrink: 0 }}
          />
          <Title
            level={4}
            style={{
              color: token.colorTextLightSolid,
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {fullName}
          </Title>
        </Space>

        <Space orientation="vertical" size={12} style={{ marginTop: 16 }}>
          {profile?.phoneNumber && (
            <Space align="center" size={12}>
              <PhoneOutlined style={{ color: token.colorTextLightSolid, opacity: 0.8 }} />
              <Text style={{ color: token.colorTextLightSolid, opacity: 0.9 }}>
                {profile.phoneNumber}
              </Text>
            </Space>
          )}
          {profile?.email && (
            <Space align="center" size={12}>
              <MailOutlined style={{ color: token.colorTextLightSolid, opacity: 0.8 }} />
              <Text style={{ color: token.colorTextLightSolid, opacity: 0.9 }}>
                {profile.email}
              </Text>
            </Space>
          )}
          {!profile?.phoneNumber && !profile?.email && (
            <Space align="center" size={12}>
              <EnvironmentOutlined style={{ color: token.colorTextLightSolid, opacity: 0.8 }} />
              <Text style={{ color: token.colorTextLightSolid, opacity: 0.9 }}>
                ยังไม่ได้กรอกข้อมูล
              </Text>
            </Space>
          )}
        </Space>

        <Space style={{ marginTop: 24 }}>
          <Link href="/pages/employee/profile">
            <Button
              ghost
              icon={<EditOutlined />}
              style={{
                borderRadius: token.borderRadius,
                fontWeight: 600,
                padding: "0 24px",
                borderColor: token.colorTextLightSolid,
                color: token.colorTextLightSolid,
              }}
            >
              แก้ไขโปรไฟล์
            </Button>
          </Link>
        </Space>
      </Space>
    </Card>
  );
}
