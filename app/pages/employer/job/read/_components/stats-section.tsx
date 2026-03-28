"use client";

import {
  CheckCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  UserAddOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Card, Col, Flex, Row, Statistic, Typography, theme } from "antd";
import { useJobReadStore } from "../_state/job-read-store";

const { Text } = Typography;

const PRIMARY = "#11b6f5";

// สถิติภาพรวมสำหรับฝ่ายบุคลากร: งานที่เปิดรับ, ผู้สมัครใหม่, ยอดเข้าชม, ใกล้หมดอายุ
export const StatsSection = () => {
  const { jobs } = useJobReadStore();
  const { token } = theme.useToken();

  const activeCount = jobs.filter((j) => j.status === "ACTIVE").length;
  const totalNewApplicants = jobs.reduce((sum, j) => sum + j.newApplicants, 0);
  const totalViews = jobs.reduce((sum, j) => sum + j.views, 0);
  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicants, 0);

  // นับตำแหน่งที่ใกล้หมดอายุ (เหลือน้อยกว่า 7 วัน)
  const today = new Date();
  const expiringSoonCount = jobs.filter((j) => {
    if (j.status !== "ACTIVE") return false;
    const expires = new Date(j.expiresAt);
    const daysLeft = Math.ceil(
      (expires.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysLeft <= 7 && daysLeft >= 0;
  }).length;

  const STATS = [
    {
      title: "ตำแหน่งที่เปิดรับ",
      value: activeCount,
      icon: (
        <CheckCircleOutlined
          style={{ fontSize: 20, color: token.colorSuccess }}
        />
      ),
      color: token.colorSuccess,
      bg: token.colorSuccessBg,
      border: token.colorSuccessBorder,
      suffix: "ตำแหน่ง",
    },
    {
      title: "ผู้สมัครใหม่",
      value: totalNewApplicants,
      icon: <UserAddOutlined style={{ fontSize: 20, color: PRIMARY }} />,
      color: PRIMARY,
      bg: token.colorPrimaryBg,
      border: token.colorPrimaryBorder,
      suffix: "คน",
    },
    {
      title: "ยอดผู้สมัครทั้งหมด",
      value: totalApplicants,
      icon: (
        <FileTextOutlined style={{ fontSize: 20, color: token.colorInfo }} />
      ),
      color: token.colorInfo,
      bg: token.colorInfoBg,
      border: token.colorInfoBorder,
      suffix: "คน",
    },
    {
      title: "ยอดเข้าชมประกาศ",
      value: totalViews,
      icon: <EyeOutlined style={{ fontSize: 20, color: token.colorWarning }} />,
      color: token.colorWarning,
      bg: token.colorWarningBg,
      border: token.colorWarningBorder,
      suffix: "ครั้ง",
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {STATS.map((stat) => (
        <Col xs={12} md={6} key={stat.title}>
          <Card
            variant="borderless"
            style={{
              borderRadius: 14,
              border: `1px solid ${stat.border}`,
              backgroundColor: stat.bg,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
            styles={{ body: { padding: "20px 24px" } }}
          >
            <Flex vertical gap={12}>
              <Flex justify="space-between" align="center">
                <Text
                  style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}
                >
                  {stat.title}
                </Text>
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: token.colorBgContainer,
                    border: `1px solid ${stat.border}`,
                  }}
                >
                  {stat.icon}
                </Flex>
              </Flex>
              <Statistic
                value={stat.value}
                suffix={
                  <span
                    style={{ fontSize: 13, color: token.colorTextTertiary }}
                  >
                    {stat.suffix}
                  </span>
                }
                styles={{
                  content: {
                    fontSize: 28,
                    fontWeight: 700,
                    color: stat.color,
                    lineHeight: 1,
                  },
                  root: { marginBottom: 0 },
                }}
              />
            </Flex>
          </Card>
        </Col>
      ))}

      {/* Expiring Soon Warning — แสดงเฉพาะเมื่อมีประกาศใกล้หมดอายุ */}
      {expiringSoonCount > 0 && (
        <Col xs={24}>
          <Card
            variant="borderless"
            style={{
              borderRadius: 12,
              backgroundColor: token.colorWarningBg,
              border: `1px solid ${token.colorWarningBorder}`,
            }}
            styles={{ body: { padding: "12px 20px" } }}
          >
            <Flex align="center" gap={10}>
              <WarningOutlined
                style={{ color: token.colorWarning, fontSize: 16 }}
              />
              <Text style={{ fontSize: 14, color: token.colorWarningText }}>
                มี <b>{expiringSoonCount} ประกาศ</b> ที่จะหมดอายุภายใน 7 วัน —
                ตรวจสอบและต่ออายุเพื่อไม่ให้พลาดผู้สมัคร
              </Text>
            </Flex>
          </Card>
        </Col>
      )}
    </Row>
  );
};
