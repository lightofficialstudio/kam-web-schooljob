"use client";

import {
  ApiOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  DatabaseOutlined,
  FileOutlined,
  HomeOutlined,
  LineChartOutlined,
  ProjectOutlined,
  SafetyOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic, Typography, theme } from "antd";

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
