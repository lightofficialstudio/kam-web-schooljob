"use client";

import { Col, Row, theme, Typography } from "antd";
import type { ApplicationEntry } from "../_stores/applications-store";

const { Text } = Typography;

interface StatItemProps {
  label: string;
  count: number;
  color: string;
  bg: string;
  border: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, count, color, bg, border }) => (
  <div
    style={{
      textAlign: "center",
      padding: "16px 12px",
      borderRadius: 12,
      background: bg,
      border: `1px solid ${border}`,
    }}
  >
    <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1.1 }}>
      {count}
    </div>
    <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
      {label}
    </Text>
  </div>
);

interface ApplicationStatsBarProps {
  applications: ApplicationEntry[];
}

export const ApplicationStatsBar: React.FC<ApplicationStatsBarProps> = ({
  applications,
}) => {
  const { token } = theme.useToken();

  const counts = {
    total: applications.length,
    submitted: applications.filter((a) => a.status === "submitted").length,
    interview: applications.filter((a) => a.status === "interview").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <Row gutter={[12, 12]}>
      <Col xs={12} sm={6} md={4} lg={4}>
        <StatItem
          label="ทั้งหมด"
          count={counts.total}
          color={token.colorPrimary}
          bg={token.colorPrimaryBg}
          border={token.colorPrimaryBorder}
        />
      </Col>
      <Col xs={12} sm={6} md={5} lg={5}>
        <StatItem
          label="รอพิจารณา"
          count={counts.submitted}
          color={token.colorInfoText}
          bg={token.colorInfoBg}
          border={token.colorInfoBorder}
        />
      </Col>
      <Col xs={12} sm={6} md={5} lg={5}>
        <StatItem
          label="นัดสัมภาษณ์"
          count={counts.interview}
          color={token.colorWarningText}
          bg={token.colorWarningBg}
          border={token.colorWarningBorder}
        />
      </Col>
      <Col xs={12} sm={6} md={5} lg={5}>
        <StatItem
          label="ผ่านการคัดเลือก"
          count={counts.accepted}
          color={token.colorSuccessText}
          bg={token.colorSuccessBg}
          border={token.colorSuccessBorder}
        />
      </Col>
      <Col xs={24} sm={24} md={5} lg={5}>
        <StatItem
          label="ไม่ผ่านการคัดเลือก"
          count={counts.rejected}
          color={token.colorErrorText}
          bg={token.colorErrorBg}
          border={token.colorErrorBorder}
        />
      </Col>
    </Row>
  );
};
