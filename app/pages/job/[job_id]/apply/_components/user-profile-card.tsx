"use client";

import {
  EditOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import {
  theme as antTheme,
  Button,
  Card,
  Layout,
  Space,
  Typography,
} from "antd";

const { Title, Text } = Typography;

export default function UserProfileCard() {
  const { token } = antTheme.useToken();

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
      {/* Decoration Elements using Layout instead of div */}
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

      <Space
        orientation="vertical"
        style={{ position: "relative", zIndex: 1, width: "100%" }}
      >
        <Title
          level={4}
          style={{
            color: token.colorTextLightSolid,
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          THANAT PROMPIRIYA
        </Title>
        <Space orientation="vertical" size={12} style={{ marginTop: 16 }}>
          <Space align="center" size={12}>
            <EnvironmentOutlined
              style={{ color: token.colorTextLightSolid, opacity: 0.8 }}
            />
            <Text style={{ color: token.colorTextLightSolid, opacity: 0.9 }}>
              Bang Sue, Bangkok
            </Text>
          </Space>
          <Space align="center" size={12}>
            <PhoneOutlined
              style={{ color: token.colorTextLightSolid, opacity: 0.8 }}
            />
            <Text style={{ color: token.colorTextLightSolid, opacity: 0.9 }}>
              +66 0646356524
            </Text>
          </Space>
          <Space align="center" size={12}>
            <MailOutlined
              style={{ color: token.colorTextLightSolid, opacity: 0.8 }}
            />
            <Text style={{ color: token.colorTextLightSolid, opacity: 0.9 }}>
              lightofficialstudio@gmail.com
            </Text>
          </Space>
        </Space>

        <Space style={{ marginTop: 24 }}>
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
        </Space>
      </Space>
    </Card>
  );
}
