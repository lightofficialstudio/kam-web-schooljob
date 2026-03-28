"use client";

import { EnvironmentOutlined, UserOutlined } from "@ant-design/icons";
import {
  Badge,
  Card,
  Divider,
  Flex,
  Space,
  Tag,
  Typography,
  theme,
} from "antd";

const { Title, Text, Paragraph } = Typography;

interface JobTipsSidebarProps {
  isEdit?: boolean;
}

// Sidebar สำหรับแสดงคำแนะนำการลงประกาศ และสถานะบัญชี
export const JobTipsSidebar = ({ isEdit = false }: JobTipsSidebarProps) => {
  const { token } = theme.useToken();

  return (
    <Flex vertical gap={24} style={{ position: "sticky", top: 120 }}>
      {/* Rocket Card — แสดงเฉพาะตอนสร้างใหม่ */}
      {!isEdit && (
        <Card
          variant="borderless"
          style={{
            borderRadius: 24,
            background: "linear-gradient(135deg, #001e45 0%, #003370 100%)",
            overflow: "hidden",
          }}
        >
          <Flex vertical gap={8} style={{ padding: 10 }}>
            <Title level={4} style={{ color: token.colorWhite, margin: 0 }}>
              มาสร้างประกาศงานที่น่าสนใจกันเถอะ! 🚀
            </Title>
            <Paragraph
              style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, margin: 0 }}
            >
              การระบุรายละเอียดวิชาและระดับชั้นที่ชัดเจน
              จะช่วยให้คุณพบครูที่ตรงใจได้เร็วขึ้นถึง 2 เท่า
            </Paragraph>
            <img
              src="https://illustrations.popsy.co/amber/launching-soon.svg"
              alt="Success Illustration"
              style={{ width: "100%", height: "auto", marginTop: 20 }}
            />
          </Flex>
        </Card>
      )}

      {/* Tips Card */}
      <Card
        variant="borderless"
        style={{
          borderRadius: 16,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Flex vertical gap={24}>
          <Flex vertical gap={8}>
            <Title level={4} style={{ margin: 0 }}>
              เทคนิคการลงประกาศ
            </Title>
            <Text type="secondary">
              ทำตามคำแนะนำเพื่อดึงดูดผู้สมัครที่มีคุณภาพ
            </Text>
          </Flex>

          <Space align="start">
            <Flex
              align="center"
              justify="center"
              style={{
                padding: 8,
                borderRadius: 10,
                background: token.colorPrimaryBg,
                color: token.colorPrimary,
                flexShrink: 0,
              }}
            >
              <UserOutlined />
            </Flex>
            <Flex vertical gap={4}>
              <Text strong>ระบุตำแหน่งที่ชัดเจน</Text>
              <Text type="secondary" style={{ fontSize: 13 }}>
                เช่น "ครูสอนคณิตศาสตร์ (มัธยมปลาย)"
                จะได้รับความสนใจมากกว่าตำแหน่งทั่วไป
              </Text>
            </Flex>
          </Space>

          <Space align="start">
            <Flex
              align="center"
              justify="center"
              style={{
                padding: 8,
                borderRadius: 10,
                background: token.colorSuccessBg,
                color: token.colorSuccess,
                flexShrink: 0,
              }}
            >
              <EnvironmentOutlined />
            </Flex>
            <Flex vertical gap={4}>
              <Text strong>ข้อมูลสวัสดิการ</Text>
              <Text type="secondary" style={{ fontSize: 13 }}>
                การระบุสวัสดิการที่ชัดเจนช่วยให้คนตัดสินใจสมัครได้ง่ายขึ้น 2 เท่า
              </Text>
            </Flex>
          </Space>

          <Divider style={{ margin: 0 }} />

          <Flex vertical gap={12}>
            <Text strong>สถานะบัตรสมาชิก</Text>
            <Tag
              color="gold"
              style={{ width: "fit-content", padding: "4px 12px", borderRadius: 8 }}
            >
              Premium Account
            </Tag>
            <Text type="secondary" style={{ fontSize: 12 }}>
              คุณสามารถลงประกาศได้อีก 5 ตำแหน่ง (จากทั้งหมด 10 ตำแหน่ง)
            </Text>
          </Flex>

          <Space align="start">
            <Badge status="success" />
            <Text type="secondary" style={{ fontSize: 14 }}>
              เข้าถึงเครือข่ายครูคุณภาพทั่วประเทศ
            </Text>
          </Space>
          <Space align="start">
            <Badge status="success" />
            <Text type="secondary" style={{ fontSize: 14 }}>
              ระบบคัดกรองผู้สมัครอัตโนมัติ
            </Text>
          </Space>
        </Flex>
      </Card>
    </Flex>
  );
};
