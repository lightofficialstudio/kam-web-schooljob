"use client";

import {
  ArrowRightOutlined,
  BellOutlined,
  CalendarOutlined,
  SolutionOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Statistic,
  Tag,
  Typography,
  theme,
} from "antd";
import { useJobReadStore } from "../_state/job-read-store";

const { Title, Text } = Typography;

// ใช้ค่าคงที่แทน token เพื่อป้องกัน SSR/Client hydration mismatch
const PRIMARY = "#11b6f5";
const PRIMARY_DARK = "#0878a8";

// รายการด่วนที่ฝ่ายบุคลากรต้องดำเนินการ (จะดึงจาก API จริง)
const URGENT_ITEMS = [
  {
    icon: <BellOutlined style={{ color: PRIMARY }} />,
    title: "มีผู้สมัครใหม่ 12 คน รอการตรวจสอบ",
    desc: "ครูสอนภาษาอังกฤษ",
    time: "2 ชม. ที่แล้ว",
    tag: { label: "ใหม่", color: "blue" },
  },
  {
    icon: <CalendarOutlined style={{ color: "#F59E0B" }} />,
    title: "ประกาศกำลังจะหมดอายุ",
    desc: "ครูสอนคณิตศาสตร์ (Part-time)",
    time: "ใน 3 วัน",
    tag: { label: "ด่วน", color: "orange" },
  },
  {
    icon: <SolutionOutlined style={{ color: "#10B981" }} />,
    title: "ผู้สมัคร 3 คนรอนัดสัมภาษณ์",
    desc: "ครูประจำชั้นอนุบาล 3",
    time: "เมื่อวาน",
    tag: { label: "รอดำเนินการ", color: "green" },
  },
];

// การ์ดภาพรวมกระบวนการรับสมัคร + รายการด่วน
export const InsightsCard = () => {
  const { jobs } = useJobReadStore();
  const { token } = theme.useToken();

  // คำนวณ Pipeline จาก Mock Data — ผู้ที่ได้รับการตอบรับ vs เป้าหมายที่ต้องการรับ
  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicants, 0);
  const interviewed = Math.floor(totalApplicants * 0.27); // ~27% เข้าสัมภาษณ์
  const hiredCount = 3;   // จำนวนผู้ที่ได้รับการตอบรับแล้ว
  const hiredTarget = 4;  // เป้าหมายที่ต้องการรับทั้งหมด
  const hiringRate = Math.round((hiredCount / hiredTarget) * 100); // 75%

  return (
    <Row gutter={[16, 16]}>
      {/* Hiring Pipeline Card */}
      <Col xs={24} lg={15}>
        <Card
          variant="borderless"
          style={{
            borderRadius: 16,
            background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`,
            boxShadow: `0 8px 24px ${PRIMARY}40`,
            height: "100%",
          }}
          styles={{ body: { padding: "28px 32px" } }}
        >
          <Flex vertical gap={20} style={{ height: "100%" }}>
            {/* Header */}
            <Flex justify="space-between" align="flex-start">
              <Flex vertical gap={4}>
                <Flex align="center" gap={8}>
                  <TrophyOutlined
                    style={{ color: "rgba(255,255,255,0.9)", fontSize: 18 }}
                  />
                  <Title level={4} style={{ margin: 0, color: "#fff" }}>
                    Pipeline การรับสมัคร <ThunderboltOutlined />
                  </Title>
                </Flex>
                <Text style={{ color: "rgba(255,255,255,0.72)", fontSize: 13 }}>
                  ภาพรวมกระบวนการคัดเลือกบุคลากรในเดือนนี้
                </Text>
              </Flex>
              <Progress
                type="circle"
                percent={hiringRate}
                size={80}
                strokeColor="#fff"
                railColor="rgba(255,255,255,0.2)"
                format={(percent) => (
                  <Flex vertical align="center">
                    <Text
                      style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}
                    >
                      {percent}%
                    </Text>
                    <Text
                      style={{
                        fontSize: 9,
                        color: "rgba(255,255,255,0.8)",
                        lineHeight: 1.2,
                        textAlign: "center",
                      }}
                    >
                      ได้ผู้สมัครแล้ว
                    </Text>
                  </Flex>
                )}
              />
            </Flex>

            {/* Pipeline Steps */}
            <Row gutter={24}>
              <Col span={8}>
                <Flex vertical gap={4}>
                  <Text
                    style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}
                  >
                    ผู้สมัครทั้งหมด
                  </Text>
                  <Statistic
                    value={totalApplicants}
                    suffix={
                      <span
                        style={{
                          fontSize: 13,
                          color: "rgba(255,255,255,0.65)",
                        }}
                      >
                        คน
                      </span>
                    }
                    styles={{
                      content: { color: "#fff", fontSize: 24, fontWeight: 700 },
                    }}
                  />
                  <Progress
                    percent={100}
                    showInfo={false}
                    strokeColor="rgba(255,255,255,0.4)"
                    railColor="rgba(255,255,255,0.15)"
                    size="small"
                  />
                </Flex>
              </Col>
              <Col span={8}>
                <Flex vertical gap={4}>
                  <Text
                    style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}
                  >
                    เข้าสัมภาษณ์
                  </Text>
                  <Statistic
                    value={interviewed}
                    suffix={
                      <span
                        style={{
                          fontSize: 13,
                          color: "rgba(255,255,255,0.65)",
                        }}
                      >
                        คน
                      </span>
                    }
                    styles={{
                      content: { color: "#fff", fontSize: 24, fontWeight: 700 },
                    }}
                  />
                  <Progress
                    percent={
                      totalApplicants > 0
                        ? Math.round((interviewed / totalApplicants) * 100)
                        : 0
                    }
                    showInfo={false}
                    strokeColor="rgba(255,255,255,0.7)"
                    railColor="rgba(255,255,255,0.15)"
                    size="small"
                  />
                </Flex>
              </Col>
              <Col span={8}>
                <Flex vertical gap={4}>
                  <Text
                    style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}
                  >
                    ได้ผู้สมัครแล้ว
                  </Text>
                  <Statistic
                    value={hiredCount}
                    suffix={
                      <span
                        style={{
                          fontSize: 13,
                          color: "rgba(255,255,255,0.65)",
                        }}
                      >
                        / {hiredTarget} คน
                      </span>
                    }
                    styles={{
                      content: { color: "#fff", fontSize: 24, fontWeight: 700 },
                    }}
                  />
                  <Progress
                    percent={hiringRate}
                    showInfo={false}
                    strokeColor="#fff"
                    railColor="rgba(255,255,255,0.15)"
                    size="small"
                  />
                </Flex>
              </Col>
            </Row>
          </Flex>
        </Card>
      </Col>

      {/* Urgent Actions Card */}
      <Col xs={24} lg={9}>
        <Card
          title={
            <Flex align="center" gap={8}>
              <BellOutlined style={{ color: "#F59E0B" }} />
              <Text strong style={{ fontSize: 14 }}>
                รายการรอดำเนินการ
              </Text>
            </Flex>
          }
          variant="borderless"
          style={{ borderRadius: 16, height: "100%" }}
          styles={{ body: { padding: "0 24px 16px" } }}
        >
          <Flex vertical>
            {URGENT_ITEMS.map((item, index) => (
              <Flex
                key={index}
                justify="space-between"
                align="center"
                style={{
                  padding: "14px 0",
                  borderBottom:
                    index < URGENT_ITEMS.length - 1
                      ? `1px solid ${token.colorBorderSecondary}`
                      : "none",
                }}
              >
                <Flex gap={10} align="flex-start">
                  <Flex
                    align="center"
                    justify="center"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: token.colorFillTertiary,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {item.icon}
                  </Flex>
                  <Flex vertical gap={3}>
                    <Text strong style={{ fontSize: 13, lineHeight: 1.4 }}>
                      {item.title}
                    </Text>
                    <Flex align="center" gap={6}>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {item.desc}
                      </Text>
                      <Tag
                        color={item.tag.color}
                        style={{
                          fontSize: 10,
                          lineHeight: "16px",
                          margin: 0,
                          padding: "0 6px",
                        }}
                      >
                        {item.tag.label}
                      </Tag>
                    </Flex>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {item.time}
                    </Text>
                  </Flex>
                </Flex>
                <Button
                  type="text"
                  size="small"
                  icon={<ArrowRightOutlined />}
                />
              </Flex>
            ))}
          </Flex>
        </Card>
      </Col>
    </Row>
  );
};
