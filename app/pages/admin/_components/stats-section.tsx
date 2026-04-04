"use client";

import {
  ApiOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  DatabaseOutlined,
  HomeOutlined,
  ProjectOutlined,
  SafetyOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Flex, Row, Statistic, Tag, Typography, theme } from "antd";

const { Text } = Typography;

// ✨ [type สำหรับ KPI card]
interface KpiCard {
  title: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
  color: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  trendLabel: string;
  bgToken: string;
}

// ✨ [KPI Cards Section — 4 primary + 4 secondary metrics]
export function StatsSection() {
  const { token } = theme.useToken();

  const cards: KpiCard[] = [
    {
      title: "ผู้ใช้ทั้งหมด",
      value: 2,
      suffix: "คน",
      icon: <UserOutlined style={{ fontSize: 20 }} />,
      color: token.colorPrimary,
      bgToken: token.colorPrimaryBg,
      trend: "up",
      trendValue: "+100%",
      trendLabel: "จากเดือนก่อน",
    },
    {
      title: "โรงเรียนที่ลงทะเบียน",
      value: 0,
      suffix: "แห่ง",
      icon: <HomeOutlined style={{ fontSize: 20 }} />,
      color: token.colorWarning,
      bgToken: token.colorWarningBg,
      trend: "neutral",
      trendValue: "0%",
      trendLabel: "ยังไม่มีข้อมูล",
    },
    {
      title: "ครูในระบบ",
      value: 1,
      suffix: "คน",
      icon: <TeamOutlined style={{ fontSize: 20 }} />,
      color: token.colorSuccess,
      bgToken: token.colorSuccessBg,
      trend: "up",
      trendValue: "+1",
      trendLabel: "ใหม่เดือนนี้",
    },
    {
      title: "งานที่เผยแพร่",
      value: 0,
      suffix: "รายการ",
      icon: <ProjectOutlined style={{ fontSize: 20 }} />,
      color: "#7c3aed",
      bgToken: "#ede9fe",
      trend: "neutral",
      trendValue: "0",
      trendLabel: "รอการลงประกาศ",
    },
    {
      title: "ผู้ดูแลระบบ",
      value: 1,
      suffix: "คน",
      icon: <SafetyOutlined style={{ fontSize: 20 }} />,
      color: token.colorError,
      bgToken: token.colorErrorBg,
      trend: "neutral",
      trendValue: "–",
      trendLabel: "คงที่",
    },
    {
      title: "ฐานข้อมูล",
      value: 1,
      suffix: "ฐาน",
      icon: <DatabaseOutlined style={{ fontSize: 20 }} />,
      color: "#db2777",
      bgToken: "#fce7f3",
      trend: "up",
      trendValue: "Online",
      trendLabel: "เชื่อมต่อแล้ว",
    },
    {
      title: "API Response",
      value: 145,
      suffix: "ms",
      icon: <ApiOutlined style={{ fontSize: 20 }} />,
      color: token.colorPrimary,
      bgToken: token.colorPrimaryBg,
      trend: "up",
      trendValue: "ดี",
      trendLabel: "< 200ms threshold",
    },
    {
      title: "เซสชันใช้งาน",
      value: 1,
      suffix: "session",
      icon: <UserOutlined style={{ fontSize: 20 }} />,
      color: token.colorInfo,
      bgToken: token.colorInfoBg,
      trend: "up",
      trendValue: "Active",
      trendLabel: "กำลังใช้งาน",
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {cards.map((card) => (
        <Col xs={24} sm={12} xl={6} key={card.title}>
          <Card
            style={{
              background: token.colorBgContainer,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
              height: "100%",
            }}
            styles={{ body: { padding: "20px 24px" } }}
          >
            <Flex justify="space-between" align="flex-start">
              <Flex vertical gap={8} style={{ flex: 1 }}>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: "0.3px",
                  }}
                >
                  {card.title.toUpperCase()}
                </Text>
                <Statistic
                  value={card.value}
                  suffix={
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      {card.suffix}
                    </Text>
                  }
                  styles={{
                    content: {
                      fontSize: 30,
                      fontWeight: 700,
                      color: card.color,
                      lineHeight: 1.1,
                    },
                  }}
                />
                <Flex align="center" gap={4}>
                  <Tag
                    color={
                      card.trend === "up"
                        ? "success"
                        : card.trend === "down"
                          ? "error"
                          : "default"
                    }
                    icon={
                      card.trend === "up" ? (
                        <ArrowUpOutlined />
                      ) : card.trend === "down" ? (
                        <ArrowDownOutlined />
                      ) : undefined
                    }
                    style={{ borderRadius: 100, fontSize: 11, margin: 0 }}
                  >
                    {card.trendValue}
                  </Tag>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {card.trendLabel}
                  </Text>
                </Flex>
              </Flex>

              {/* Icon circle */}
              <Flex
                align="center"
                justify="center"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: token.borderRadius,
                  background: card.bgToken,
                  color: card.color,
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </Flex>
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

import {
  AppstoreOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  FileOutlined,
  LineChartOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

// ✨ [type สำหรับ stat card แต่ละช่อง]
interface StatCard {
  title: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
  color: string;
  subIcon: React.ReactNode;
  subText: string;
  subColor: string;
}

// ✨ [Stats Section — แสดง KPI cards 2 แถว รองรับ light/dark]
export function StatsSection() {
  const { token } = theme.useToken();

  const stats: StatCard[] = [
    {
      title: "จำนวนผู้ใช้ทั้งหมด",
      value: 2,
      suffix: "คน",
      icon: <UserOutlined />,
      color: token.colorPrimary,
      subIcon: <CheckOutlined />,
      subText: "2 ยืนยันตัวตน",
      subColor: token.colorSuccess,
    },
    {
      title: "ผู้ดูแลระบบ",
      value: 1,
      suffix: "คน",
      icon: <SafetyOutlined />,
      color: token.colorError,
      subIcon: <CloseOutlined />,
      subText: "ไม่มีขอการอนุญาต",
      subColor: token.colorWarning,
    },
    {
      title: "โรงเรียน",
      value: 0,
      suffix: "แห่ง",
      icon: <HomeOutlined />,
      color: token.colorWarning,
      subIcon: <ClockCircleOutlined />,
      subText: "รอการตรวจสอบ",
      subColor: token.colorWarning,
    },
    {
      title: "ครู",
      value: 1,
      suffix: "คน",
      icon: <TeamOutlined />,
      color: token.colorInfo,
      subIcon: <CheckOutlined />,
      subText: "1 ใช้งานอยู่",
      subColor: token.colorInfo,
    },
    {
      title: "งานที่เผยแพร่",
      value: 0,
      suffix: "รายการ",
      icon: <ProjectOutlined />,
      color: token.colorPurple ?? "#722ed1",
      subIcon: <FileOutlined />,
      subText: "0 อยู่ระหว่างการพิจารณา",
      subColor: token.colorTextSecondary,
    },
    {
      title: "ฐานข้อมูล",
      value: 1,
      suffix: "ฐาน",
      icon: <DatabaseOutlined />,
      color: token.colorMagenta ?? "#eb2f96",
      subIcon: <CheckCircleOutlined />,
      subText: "เชื่อมต่อ",
      subColor: token.colorSuccess,
    },
    {
      title: "เซสชั่นใช้งาน",
      value: 1,
      suffix: "เซสชั่น",
      icon: <AppstoreOutlined />,
      color: token.colorSuccess,
      subIcon: <CheckOutlined />,
      subText: "ทำงานปกติ",
      subColor: token.colorSuccess,
    },
    {
      title: "API Response",
      value: 145,
      suffix: "ms",
      icon: <ApiOutlined />,
      color: token.colorPrimary,
      subIcon: <LineChartOutlined />,
      subText: "ปกติ",
      subColor: token.colorPrimary,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {stats.map((stat) => (
        <Col xs={24} sm={12} lg={6} key={stat.title}>
          <Card
            style={{
              background: token.colorBgContainer,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
            }}
          >
            <Statistic
              title={<Text type="secondary">{stat.title}</Text>}
              value={stat.value}
              prefix={
                <span style={{ color: stat.color, marginRight: 4 }}>
                  {stat.icon}
                </span>
              }
              suffix={stat.suffix}
              styles={{
                content: { fontSize: 28, fontWeight: 700, color: stat.color },
              }}
            />
            <Text
              style={{
                fontSize: 12,
                color: stat.subColor,
                marginTop: 8,
                display: "block",
              }}
            >
              {stat.subIcon}&nbsp;{stat.subText}
            </Text>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
