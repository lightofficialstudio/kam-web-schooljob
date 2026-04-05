"use client";

import {
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
  Skeleton,
  Statistic,
  Tag,
  Typography,
  theme,
} from "antd";
import { useJobReadStore } from "../_state/job-read-store";

const { Title, Text } = Typography;

const PRIMARY = "#11b6f5";
const PRIMARY_DARK = "#0878a8";

// ไอคอน + สี ตาม type ของ urgentJob
const URGENT_CONFIG = {
  new_applicants: {
    icon: <BellOutlined style={{ color: PRIMARY }} />,
    tagLabel: "ใหม่",
    tagColor: "blue",
    buildTitle: (count: number) => `มีผู้สมัครใหม่ ${count} คน รอการตรวจสอบ`,
    buildTime: () => "ล่าสุด 3 วัน",
  },
  expiring_soon: {
    icon: <CalendarOutlined style={{ color: "#F59E0B" }} />,
    tagLabel: "ด่วน",
    tagColor: "orange",
    buildTitle: (count: number) => `ประกาศจะหมดอายุในอีก ${count} วัน`,
    buildTime: () => "กำลังจะหมดอายุ",
  },
  pending_interview: {
    icon: <SolutionOutlined style={{ color: "#10B981" }} />,
    tagLabel: "รอดำเนินการ",
    tagColor: "green",
    buildTitle: (count: number) => `ผู้สมัคร ${count} คนรอนัดสัมภาษณ์`,
    buildTime: () => "กรุณาดำเนินการ",
  },
} as const;

// การ์ดภาพรวมกระบวนการรับสมัคร + รายการด่วน — ดึงข้อมูลจาก API จริง
export const InsightsCard = () => {
  const { pipeline, isPipelineLoading } = useJobReadStore();
  const { token } = theme.useToken();

  const totalApplicants = pipeline?.totalApplicants ?? 0;
  const interviewed = pipeline?.interview ?? 0;
  const accepted = pipeline?.accepted ?? 0;
  const totalVacancies = pipeline?.totalVacancies ?? 0;

  const hiringRate =
    totalVacancies > 0
      ? Math.min(Math.round((accepted / totalVacancies) * 100), 100)
      : 0;

  const urgentJobs = pipeline?.urgentJobs ?? [];

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
                  ภาพรวมกระบวนการคัดเลือกบุคลากรในปัจจุบัน
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
            {isPipelineLoading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
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
                        content: {
                          color: "#fff",
                          fontSize: 24,
                          fontWeight: 700,
                        },
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
                        content: {
                          color: "#fff",
                          fontSize: 24,
                          fontWeight: 700,
                        },
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
                      value={accepted}
                      suffix={
                        <span
                          style={{
                            fontSize: 13,
                            color: "rgba(255,255,255,0.65)",
                          }}
                        >
                          / {totalVacancies} คน
                        </span>
                      }
                      styles={{
                        content: {
                          color: "#fff",
                          fontSize: 24,
                          fontWeight: 700,
                        },
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
            )}
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
          {isPipelineLoading ? (
            <Skeleton
              active
              paragraph={{ rows: 4 }}
              style={{ padding: "12px 0" }}
            />
          ) : urgentJobs.length === 0 ? (
            <Flex align="center" justify="center" style={{ padding: "32px 0" }}>
              <Text type="secondary" style={{ fontSize: 13 }}>
                ไม่มีรายการรอดำเนินการ 🎉
              </Text>
            </Flex>
          ) : (
            <Flex vertical>
              {urgentJobs.slice(0, 4).map((item, index) => {
                const cfg = URGENT_CONFIG[item.type];
                return (
                  <Flex
                    key={`${item.jobId}-${item.type}`}
                    justify="space-between"
                    align="center"
                    style={{
                      padding: "14px 0",
                      borderBottom:
                        index < Math.min(urgentJobs.length, 4) - 1
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
                        {cfg.icon}
                      </Flex>
                      <Flex vertical gap={3}>
                        <Text strong style={{ fontSize: 13, lineHeight: 1.4 }}>
                          {cfg.buildTitle(item.count)}
                        </Text>
                        <Flex align="center" gap={6}>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {item.title}
                          </Text>
                          <Tag
                            color={cfg.tagColor}
                            style={{
                              fontSize: 10,
                              lineHeight: "16px",
                              margin: 0,
                              padding: "0 6px",
                            }}
                          >
                            {cfg.tagLabel}
                          </Tag>
                        </Flex>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {cfg.buildTime()}
                        </Text>
                      </Flex>
                    </Flex>
                    <Button type="text" size="small" />
                  </Flex>
                );
              })}
            </Flex>
          )}
        </Card>
      </Col>
    </Row>
  );
};
