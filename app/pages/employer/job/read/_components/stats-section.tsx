"use client";

import {
  ArrowUpOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic, Typography, theme } from "antd";
import { useJobReadStore } from "../_state/job-read-store";

const { Text } = Typography;

// ส่วนแสดงสถิติภาพรวม: งานที่เปิดรับ, ยอดเข้าชม, ผู้สมัคร, CV Rate
export const StatsSection = () => {
  const { token } = theme.useToken();
  const { jobs } = useJobReadStore();

  // คำนวณ Summary Metrics จาก Raw Data ใน Store โดยตรง
  const activeCount = jobs.filter((j) => j.status === "ACTIVE").length;
  const totalViews = jobs.reduce((sum, j) => sum + j.views, 0);
  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicants, 0);
  const avgConversionRate =
    jobs.length > 0
      ? (
          jobs.reduce((sum, j) => sum + parseFloat(j.conversionRate), 0) /
          jobs.length
        ).toFixed(1)
      : "0.0";

  return (
    <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
      <Col xs={12} md={6}>
        <Card variant="borderless" style={{ borderRadius: 12 }}>
          <Statistic
            title="งานที่กำลังเปิดรับ"
            value={activeCount}
            styles={{ content: { color: token.colorSuccess } }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
      <Col xs={12} md={6}>
        <Card variant="borderless" style={{ borderRadius: 12 }}>
          <Statistic
            title="ยอดเข้าชมรวมทั้งหมด"
            value={totalViews}
            prefix={<EyeOutlined />}
          />
        </Card>
      </Col>
      <Col xs={12} md={6}>
        <Card variant="borderless" style={{ borderRadius: 12 }}>
          <Statistic
            title="ผู้สมัครทั้งหมด"
            value={totalApplicants}
            prefix={<UserAddOutlined />}
            suffix={
              <Text type="success" style={{ fontSize: 14 }}>
                <ArrowUpOutlined /> 12%
              </Text>
            }
          />
        </Card>
      </Col>
      <Col xs={12} md={6}>
        <Card variant="borderless" style={{ borderRadius: 12 }}>
          <Statistic
            title="อัตราการสมัคร (CV Rate)"
            value={avgConversionRate}
            suffix="%"
            prefix={<BarChartOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};
