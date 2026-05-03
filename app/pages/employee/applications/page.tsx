"use client";

import { useAuthStore } from "@/app/stores/auth-store";
import { Col, Row, Tabs, theme, Typography } from "antd";
import { useEffect, useState } from "react";
import { requestGetApplications } from "./_api/applications-api";
import { ApplicationCard } from "./_components/application-card";
import { ApplicationEmptyState } from "./_components/application-empty-state";
import { ApplicationStatsBar } from "./_components/application-stats-bar";
import {
  type ApplicationEntry,
  useApplicationsStore,
} from "./_stores/applications-store";

const { Title, Text } = Typography;

// ✨ Tab filter สำหรับกรองตาม status
const TAB_ITEMS = [
  { key: "all", label: "ทั้งหมด" },
  { key: "submitted", label: "รอพิจารณา" },
  { key: "interview", label: "นัดสัมภาษณ์" },
  { key: "accepted", label: "ผ่านการคัดเลือก" },
  { key: "rejected", label: "ไม่ผ่าน" },
];

export default function ApplicationsPage() {
  const { token } = theme.useToken();
  const { user } = useAuthStore();
  const { applications, isLoading, setApplications, setIsLoading } =
    useApplicationsStore();

  const [activeTab, setActiveTab] = useState("all");

  // ✨ โหลดใบสมัครเมื่อ mount
  useEffect(() => {
    if (!user?.user_id) return;
    setIsLoading(true);
    requestGetApplications(user.user_id)
      .then((res) => {
        setApplications(res.data?.data ?? []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user?.user_id]);

  // ✨ กรองตาม tab ที่เลือก
  const filtered: ApplicationEntry[] =
    activeTab === "all"
      ? applications
      : applications.filter((a) => a.status === activeTab);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px 64px" }}>
      {/* ─── Page header ─── */}
      <div style={{ marginBottom: 28 }}>
        <Title level={3} style={{ margin: 0, marginBottom: 4 }}>
          ใบสมัครงาน
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          ติดตามสถานะใบสมัครงานของคุณแบบ real-time
        </Text>
      </div>

      {/* ─── Stats bar ─── */}
      {!isLoading && applications.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <ApplicationStatsBar applications={applications} />
        </div>
      )}

      {/* ─── Tab filter ─── */}
      <div
        style={{
          background: token.colorBgContainer,
          borderRadius: 12,
          border: `1px solid ${token.colorBorderSecondary}`,
          marginBottom: 20,
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={TAB_ITEMS.map((t) => ({
            key: t.key,
            label: (
              <span style={{ padding: "0 4px" }}>
                {t.label}
                {t.key !== "all" && (
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: 11,
                      background: activeTab === t.key ? token.colorPrimaryBg : token.colorFillTertiary,
                      color: activeTab === t.key ? token.colorPrimary : token.colorTextTertiary,
                      border: `1px solid ${activeTab === t.key ? token.colorPrimaryBorder : token.colorBorderSecondary}`,
                      borderRadius: 10,
                      padding: "1px 7px",
                    }}
                  >
                    {applications.filter((a) => a.status === t.key).length}
                  </span>
                )}
                {t.key === "all" && (
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: 11,
                      background: activeTab === "all" ? token.colorPrimaryBg : token.colorFillTertiary,
                      color: activeTab === "all" ? token.colorPrimary : token.colorTextTertiary,
                      border: `1px solid ${activeTab === "all" ? token.colorPrimaryBorder : token.colorBorderSecondary}`,
                      borderRadius: 10,
                      padding: "1px 7px",
                    }}
                  >
                    {applications.length}
                  </span>
                )}
              </span>
            ),
          }))}
          style={{ padding: "0 16px" }}
        />
      </div>

      {/* ─── Application list ─── */}
      {isLoading ? (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Col key={i} xs={24}>
              <div
                style={{
                  height: 220,
                  borderRadius: 16,
                  background: token.colorFillTertiary,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            </Col>
          ))}
        </Row>
      ) : filtered.length === 0 ? (
        <ApplicationEmptyState filtered={activeTab !== "all"} />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((app) => (
            <Col key={app.id} xs={24}>
              <ApplicationCard app={app} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
