"use client";

import { CheckCircleFilled } from "@ant-design/icons";
import { Card, Col, Flex, Space, Typography, theme as antTheme } from "antd";
import { useTheme } from "@/app/contexts/theme-context";

const { Title, Text, Paragraph } = Typography;

const FEATURES = [
  { text: "ระบบจับคู่ตามวิชาเอกที่แม่นยำ" },
  { text: "สมัครงานง่ายในคลิกเดียว" },
  { text: "ลงประกาศงานฟรีสำหรับโรงเรียน" },
];

// แผงด้านซ้าย — แสดงแบรนด์และจุดเด่นของแพลตฟอร์ม
export const BrandingPanel = () => {
  const { token } = antTheme.useToken();
  const { mode } = useTheme();
  const isDark = mode === "dark";

  return (
    <Col
      xs={0}
      lg={8}
      style={{
        padding: "60px 40px",
        background: isDark ? "#1A202C" : "#f8fbff",
        borderRight: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Flex vertical justify="center" style={{ height: "100%" }} gap={48}>
        <Flex vertical gap={24}>
          <Card
            size="small"
            variant="borderless"
            style={{
              width: 54,
              height: 54,
              padding: 0,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#11b6f5",
            }}
          >
            <Title level={2} style={{ margin: 0, color: "#fff" }}>
              S
            </Title>
          </Card>
          <Title level={1}>
            ก้าวสู่ <br /> อนาคตใหม่
          </Title>
          <Paragraph style={{ fontSize: 17, marginTop: 0 }}>
            แพลตฟอร์มที่เชื่อมต่อครูคุณภาพ <br />
            กับสถานศึกษาชั้นนำทั่วประเทศ
          </Paragraph>
        </Flex>

        <Flex vertical gap={24}>
          {FEATURES.map((item, i) => (
            <Space key={i} align="start">
              <CheckCircleFilled style={{ fontSize: 20, color: token.colorPrimary }} />
              <Text style={{ fontSize: 16 }}>{item.text}</Text>
            </Space>
          ))}
        </Flex>
      </Flex>
    </Col>
  );
};
