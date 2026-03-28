"use client";

import {
  ArrowRightOutlined,
  CheckOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Space,
  Statistic,
  Typography,
  theme,
} from "antd";

const { Title, Text } = Typography;

// ข้อมูล Urgent Actions (จะดึงจาก API จริง)
const URGENT_ITEMS = [
  { title: "มีผู้สมัครใหม่ 5 คน", desc: "ตำแหน่งครูอังกฤษ", time: "2 ชม. ที่แล้ว" },
  { title: "ประกาศกำลังจะหมดอายุ", desc: "ตำแหน่งครูอนุบาล", time: "ใน 2 วัน" },
];

// ส่วนแสดงผลสำเร็จการรับสมัครและรายการด่วน
export const InsightsCard = () => {
  const { token } = theme.useToken();

  return (
    <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
      {/* Gradient Insight Card */}
      <Col xs={24} lg={16}>
        <Card
          variant="borderless"
          style={{
            borderRadius: 16,
            background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryHover} 100%)`,
          }}
        >
          <Row gutter={24} align="middle">
            <Col flex="auto">
              <Title level={3} style={{ color: token.colorWhite, margin: 0 }}>
                ความสำเร็จในการรับสมัคร <ThunderboltOutlined />
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 16 }}>
                ในเดือนนี้คุณได้รับผู้สมัครใหม่เพิ่มขึ้น 24% จากเดือนที่แล้ว
              </Text>
              <Flex gap={32} style={{ marginTop: 24 }}>
                <Statistic
                  title={<span style={{ color: "rgba(255,255,255,0.65)" }}>สัมภาษณ์แล้ว</span>}
                  value={12}
                  styles={{ content: { color: token.colorWhite } }}
                  suffix={<span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>คน</span>}
                />
                <Statistic
                  title={<span style={{ color: "rgba(255,255,255,0.65)" }}>ตอบรับเข้าทำงาน</span>}
                  value={4}
                  styles={{ content: { color: token.colorWhite } }}
                  suffix={<span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>คน</span>}
                />
              </Flex>
            </Col>
            <Col>
              <Progress
                type="circle"
                percent={75}
                strokeColor={token.colorWhite}
                railColor="rgba(255,255,255,0.2)"
                format={(percent) => (
                  <Flex vertical align="center" style={{ color: token.colorWhite }}>
                    <Text style={{ fontSize: 20, fontWeight: 700, color: token.colorWhite }}>
                      {percent}%
                    </Text>
                    <Text style={{ fontSize: 10, color: token.colorWhite }}>เป้าหมาย</Text>
                  </Flex>
                )}
              />
            </Col>
          </Row>
        </Card>
      </Col>

      {/* Urgent Action Card */}
      <Col xs={24} lg={8}>
        <Card
          title={<Space><CheckOutlined /> รีบด่วน (Urgent Action)</Space>}
          variant="borderless"
          style={{ borderRadius: 16, height: "100%" }}
        >
          <Flex vertical style={{ maxHeight: 200, overflowY: "auto" }}>
            {URGENT_ITEMS.map((item, index) => (
              <Flex
                key={index}
                justify="space-between"
                align="center"
                style={{
                  padding: "12px 0",
                  borderBottom: index < URGENT_ITEMS.length - 1
                    ? `1px solid ${token.colorBorderSecondary}`
                    : "none",
                }}
              >
                <Flex vertical>
                  <Text strong style={{ fontSize: 13 }}>{item.title}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.desc} • {item.time}
                  </Text>
                </Flex>
                <Button type="link" size="small" icon={<ArrowRightOutlined />} />
              </Flex>
            ))}
          </Flex>
        </Card>
      </Col>
    </Row>
  );
};
