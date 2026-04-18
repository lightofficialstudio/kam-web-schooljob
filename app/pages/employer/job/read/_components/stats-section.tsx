"use client";

import { SummaryCard } from "@/app/components/card/summary-card.component";
import {
  CheckCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  UserAddOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Card, Col, Flex, Row, Typography, theme } from "antd";
import { useJobReadStore } from "../_state/job-read-store";

const { Text } = Typography;

const PRIMARY = "#11b6f5";

// ✨ สถิติภาพรวมสำหรับฝ่ายบุคลากร: งานที่เปิดรับ, ผู้สมัครใหม่, ยอดเข้าชม, ใกล้หมดอายุ
export const StatsSection = () => {
  const { jobs, isLoading } = useJobReadStore();
  const { token } = theme.useToken();

  const activeCount = jobs.filter((j) => j.status === "ACTIVE").length;
  const totalNewApplicants = jobs.reduce((sum, j) => sum + j.newApplicants, 0);
  const totalViews = jobs.reduce((sum, j) => sum + j.views, 0);
  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicants, 0);

  // ✨ นับตำแหน่งที่ใกล้หมดอายุ (เหลือน้อยกว่า 7 วัน)
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
      icon: <CheckCircleOutlined style={{ fontSize: 22 }} />,
      color: token.colorSuccess,
      unit: "ตำแหน่ง",
    },
    {
      title: "ผู้สมัครใหม่",
      value: totalNewApplicants,
      icon: <UserAddOutlined style={{ fontSize: 22 }} />,
      color: PRIMARY,
      unit: "คน",
    },
    {
      title: "ยอดผู้สมัครทั้งหมด",
      value: totalApplicants,
      icon: <FileTextOutlined style={{ fontSize: 22 }} />,
      color: token.colorInfo,
      unit: "คน",
    },
    {
      title: "ยอดเข้าชมประกาศ",
      value: totalViews,
      icon: <EyeOutlined style={{ fontSize: 22 }} />,
      color: token.colorWarning,
      unit: "ครั้ง",
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {STATS.map((stat) => (
        <Col xs={12} md={6} key={stat.title}>
          <SummaryCard
            title={stat.title}
            value={stat.value}
            unit={stat.unit}
            icon={stat.icon}
            color={stat.color}
            isLoading={isLoading}
          />
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
