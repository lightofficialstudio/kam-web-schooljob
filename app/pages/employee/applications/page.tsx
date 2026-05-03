"use client";

import { useAuthStore } from "@/app/stores/auth-store";
import { FileSearchOutlined } from "@ant-design/icons";
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
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>
      {/* ─── Page header ─── */}
      <div
        className="rounded-2xl px-6 py-5 mb-7 flex items-center gap-4"
        style={{
          background: `linear-gradient(135deg, #001e45 0%, #0a4a8a 60%, #11b6f5 100%)`,
        }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
        >
          <FileSearchOutlined />
        </div>
        <div>
          <Title level={4} style={{ color: "white", margin: 0, lineHeight: 1.2 }}>
            ใบสมัครงาน
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
            ติดตามสถานะใบสมัครงานของคุณทุกขั้นตอน
          </Text>
        </div>
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
