"use client";

import { EnvironmentOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Divider, Flex, Tag, theme, Typography } from "antd";

const { Title, Text, Paragraph } = Typography;

export default function JobTipsSidebar() {
  const { token } = theme.useToken();

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: "16px",
        background: token.colorBgContainer,
        position: "sticky",
        top: "100px",
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

        <Flex align="start" gap={12}>
          <div
            style={{
              padding: "8px",
              borderRadius: "10px",
              background: token.colorPrimaryBg,
              color: token.colorPrimary,
            }}
          >
            <UserOutlined />
          </div>
          <Flex vertical gap={4}>
            <Text strong>ระบุตำแหน่งที่ชัดเจน</Text>
            <Text type="secondary" style={{ fontSize: "13px" }}>
              เช่น "ครูสอนคณิตศาสตร์ (มัธยมปลาย)"
              จะได้รับความสนใจมากกว่าตำแหน่งทั่วไป
            </Text>
          </Flex>
        </Flex>

        <Flex align="start" gap={12}>
          <div
            style={{
              padding: "8px",
              borderRadius: "10px",
              background: token.colorSuccessBg,
              color: token.colorSuccess,
            }}
          >
            <EnvironmentOutlined />
          </div>
          <Flex vertical gap={4}>
            <Text strong>ข้อมูลสวัสดิการ</Text>
            <Text type="secondary" style={{ fontSize: "13px" }}>
              การระบุสวัสดิการที่ชัดเจนช่วยให้คนตัดสินใจสมัครได้ง่ายขึ้น 2 เท่า
            </Text>
          </Flex>
        </Flex>

        <Divider style={{ margin: 0 }} />

        <Flex vertical gap={12}>
          <Text strong>สถานะบัตรสมาชิก</Text>
          <Tag
            color="gold"
            style={{
              width: "fit-content",
              padding: "4px 12px",
              borderRadius: "8px",
            }}
          >
            Premium Account
          </Tag>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            คุณสามารถลงประกาศได้อีก 5 ตำแหน่ง (จากทั้งหมด 10 ตำแหน่ง)
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}
