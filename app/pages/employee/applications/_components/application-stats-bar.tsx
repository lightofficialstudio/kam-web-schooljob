"use client";

import { SummaryCard } from "@/app/components/card/summary-card.component";
import {
  CalendarOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ClockCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Col, Row, theme, Typography } from "antd";
import type { ApplicationEntry } from "../_stores/applications-store";

const { Text } = Typography;

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

  // ✨ อัตราผ่านการคัดเลือก: accepted / (accepted + rejected)
  const decided = counts.accepted + counts.rejected;
  const successRate = decided > 0 ? Math.round((counts.accepted / decided) * 100) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Row gutter={[12, 12]}>
        <Col xs={12} sm={12} md={12} lg={5}>
          <SummaryCard
            title="ส่งใบสมัครแล้ว"
            value={counts.total}
            unit="ใบ"
            icon={<FileTextOutlined />}
            color={token.colorPrimary}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={5}>
          <SummaryCard
            title="รอพิจารณา"
            value={counts.submitted}
            unit="ใบ"
            icon={<ClockCircleOutlined />}
            color="#2563eb"
          />
        </Col>
        <Col xs={12} sm={12} md={8} lg={4}>
          <SummaryCard
            title="นัดสัมภาษณ์"
            value={counts.interview}
            unit="ครั้ง"
            icon={<CalendarOutlined />}
            color="#ea580c"
          />
        </Col>
        <Col xs={12} sm={12} md={8} lg={5}>
          <SummaryCard
            title="ผ่านการคัดเลือก"
            value={counts.accepted}
            unit="ใบ"
            icon={<CheckCircleFilled />}
            color="#16a34a"
          />
        </Col>
        <Col xs={24} sm={24} md={8} lg={5}>
          <SummaryCard
            title="ไม่ผ่านการคัดเลือก"
            value={counts.rejected}
            unit="ใบ"
            icon={<CloseCircleFilled />}
            color="#dc2626"
          />
        </Col>
      </Row>

      {/* ─── Success rate banner ─── */}
      {successRate !== null && (
        <div
          style={{
            borderRadius: 12,
            padding: "12px 16px",
            background: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 12, color: token.colorTextSecondary, whiteSpace: "nowrap" }}>
            อัตราผ่านการคัดเลือก
          </Text>
          <div
            style={{
              flex: 1,
              height: 7,
              borderRadius: 999,
              background: token.colorFillSecondary,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${successRate}%`,
                borderRadius: 999,
                transition: "width 0.7s ease",
                background:
                  successRate >= 50
                    ? "linear-gradient(90deg, #16a34a 0%, #4ade80 100%)"
                    : "linear-gradient(90deg, #ea580c 0%, #fbbf24 100%)",
              }}
            />
          </div>
          <Text
            strong
            style={{
              fontSize: 14,
              color: successRate >= 50 ? "#16a34a" : "#ea580c",
              whiteSpace: "nowrap",
            }}
          >
            {successRate}%
          </Text>
          <Text style={{ fontSize: 11, color: token.colorTextTertiary, whiteSpace: "nowrap" }}>
            ({counts.accepted}/{decided} ครั้ง)
          </Text>
        </div>
      )}
    </div>
  );
};
