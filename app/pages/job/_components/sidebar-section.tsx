"use client";

import { SafetyCertificateOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Flex,
  Space,
  Typography,
  theme as antTheme,
} from "antd";

const { Title, Text } = Typography;

// Sidebar ขวามือ: การค้นหาที่บันทึก, งานที่บันทึก, เคล็ดลับความปลอดภัย
export const SidebarSection = () => {
  const { token } = antTheme.useToken();

  return (
    <Flex vertical gap={24}>
      {/* Saved Searches */}
      <Card variant="borderless" style={{ borderRadius: token.borderRadiusLG }}>
        <Space align="center" style={{ marginBottom: 8 }}>
          <Title level={5} style={{ margin: 0 }}>
            การค้นหาที่บันทึกไว้
          </Title>
          <Badge
            count="พบกันเร็วๆนี้"
            style={{ backgroundColor: token.colorInfo, fontSize: 10 }}
          />
        </Space>
        <Text type="secondary" style={{ fontSize: 14, display: "block" }}>
          ใช้ปุ่มบันทึกการค้นหาด้านล่างผลการค้นหาเพื่อบันทึกและรับงานใหม่ทางอีเมล
        </Text>
      </Card>

      {/* Saved Jobs */}
      <Card variant="borderless" style={{ borderRadius: token.borderRadiusLG }}>
        <Space align="center" style={{ marginBottom: 8 }}>
          <Title level={5} style={{ margin: 0 }}>
            งานที่บันทึกไว้
          </Title>
          <Badge
            count="พบกันเร็วๆนี้"
            style={{ backgroundColor: token.colorInfo, fontSize: 10 }}
          />
        </Space>
        <Text type="secondary" style={{ fontSize: 14, display: "block" }}>
          คลิกไอคอนหัวใจในแต่ละประกาศงานเพื่อบันทึกไว้ดูภายหลังได้ในทุกอุปกรณ์ของคุณ
        </Text>
      </Card>

      {/* Safety Tip */}
      <Card
        variant="borderless"
        style={{
          backgroundColor: token.colorBgLayout,
          borderRadius: token.borderRadiusLG,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
        styles={{ body: { padding: 24 } }}
      >
        <Flex vertical gap={12}>
          <SafetyCertificateOutlined style={{ fontSize: 32, color: token.colorSuccess }} />
          <Text strong style={{ fontSize: 16 }}>ปลอดภัยไว้ก่อน!</Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            อย่าโอนเงินหรือให้ข้อมูลส่วนตัวที่สำคัญหากพบพิรุธในการรับสมัครงาน
          </Text>
          <Button type="link" style={{ padding: 0 }}>
            อ่านคำแนะนำเพิ่มเติม
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};
