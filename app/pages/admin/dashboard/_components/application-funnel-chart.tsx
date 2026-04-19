"use client";

// ✨ Application Funnel — แสดง conversion rate PENDING→INTERVIEW→ACCEPTED เชิงธุรกิจ
import { Card, Flex, Skeleton, Tooltip, Typography, theme } from "antd";
import { useDashboardStore } from "../_state/dashboard-store";

const { Text } = Typography;

// ✨ ข้อมูลแต่ละ stage ของ funnel
interface FunnelStage {
  key: string;
  label: string;
  subLabel: string;
  value: number;
  color: string;
  bgColor: string;
  insight: string;
}

export function ApplicationFunnelChart() {
  const { token } = theme.useToken();
  const { data, isLoading } = useDashboardStore();
  const apps = data?.stats.applications;

  // ✨ สร้าง funnel stages จาก API stats
  const total = apps
    ? apps.pending + apps.interview + apps.accepted + apps.rejected
    : 0;
  const stages: FunnelStage[] = [
    {
      key: "pending",
      label: "รับใบสมัคร",
      subLabel: "PENDING",
      value: apps?.pending ?? 0,
      color: "#11b6f5",
      bgColor: "rgba(17,182,245,0.12)",
      insight: "รอโรงเรียนพิจารณา",
    },
    {
      key: "interview",
      label: "นัดสัมภาษณ์",
      subLabel: "INTERVIEW",
      value: apps?.interview ?? 0,
      color: "#f5a623",
      bgColor: "rgba(245,166,35,0.12)",
      insight: "โรงเรียนสนใจผู้สมัคร",
    },
    {
      key: "accepted",
      label: "รับเข้าทำงาน",
      subLabel: "ACCEPTED",
      value: apps?.accepted ?? 0,
      color: "#22c55e",
      bgColor: "rgba(34,197,94,0.12)",
      insight: "จ้างงานสำเร็จ",
    },
    {
      key: "rejected",
      label: "ปฏิเสธ",
      subLabel: "REJECTED",
      value: apps?.rejected ?? 0,
      color: "#ef4444",
      bgColor: "rgba(239,68,68,0.10)",
      insight: "ไม่ผ่านการคัดเลือก",
    },
  ];

  // ✨ หา max value เพื่อคำนวณ bar width
  const maxValue = Math.max(...stages.map((s) => s.value), 1);

  // ✨ Conversion rate: pending → accepted
  const conversionRate = total > 0 ? ((apps?.accepted ?? 0) / total) * 100 : 0;

  // ✨ Response rate: โรงเรียนนำไปสัมภาษณ์ / รับทั้งหมด
  const responseRate =
    total > 0
      ? (((apps?.interview ?? 0) + (apps?.accepted ?? 0)) / total) * 100
      : 0;

  return (
    <Card
      styles={{ body: { padding: "16px 20px 20px" } }}
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        height: "100%",
      }}
    >
      {/* Header */}
      <Flex
        justify="space-between"
        align="flex-start"
        style={{ marginBottom: 16 }}
      >
        <div>
          <Flex align="center" gap={8}>
            <div
              style={{
                width: 4,
                height: 18,
                borderRadius: 2,
                background: "linear-gradient(180deg, #11b6f5, #22c55e)",
              }}
            />
            <Text strong style={{ fontSize: 14 }}>
              Application Funnel
            </Text>
          </Flex>
          <Text
            type="secondary"
            style={{ fontSize: 11, marginTop: 2, display: "block" }}
          >
            อัตราการเปลี่ยนสถานะผู้สมัครทุกขั้นตอน
          </Text>
        </div>
        {!isLoading && total > 0 && (
          <div
            style={{
              padding: "4px 10px",
              borderRadius: 20,
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.25)",
            }}
          >
            <Text style={{ fontSize: 10, color: "#22c55e", fontWeight: 600 }}>
              Hire Rate {conversionRate.toFixed(1)}%
            </Text>
          </div>
        )}
      </Flex>

      {isLoading ? (
        <Flex vertical gap={10}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton.Input
              key={i}
              active
              style={{ width: "100%", height: 44 }}
            />
          ))}
        </Flex>
      ) : (
        <Flex vertical gap={8}>
          {stages.map((stage, idx) => {
            const pct = maxValue > 0 ? (stage.value / maxValue) * 100 : 0;
            // ✨ rate เทียบกับ total
            const rateOfTotal = total > 0 ? (stage.value / total) * 100 : 0;
            return (
              <Tooltip
                key={stage.key}
                title={`${stage.insight} — ${rateOfTotal.toFixed(1)}% ของทั้งหมด`}
                placement="right"
              >
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: stage.bgColor,
                    border: `1px solid ${stage.color}30`,
                    cursor: "default",
                    transition: "transform 0.15s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  className="hover:scale-[1.01]"
                >
                  {/* ✨ bar fill animation */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${pct}%`,
                      background: `${stage.color}18`,
                      borderRadius: 10,
                      transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
                      transitionDelay: `${idx * 120}ms`,
                    }}
                  />
                  <Flex
                    justify="space-between"
                    align="center"
                    style={{ position: "relative" }}
                  >
                    <Flex align="center" gap={8}>
                      {/* ✨ สัญลักษณ์ลำดับ */}
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: stage.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <Text
                          strong
                          style={{
                            fontSize: 12,
                            display: "block",
                            lineHeight: 1.3,
                          }}
                        >
                          {stage.label}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            color: stage.color,
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                          }}
                        >
                          {stage.subLabel}
                        </Text>
                      </div>
                    </Flex>
                    <Flex align="baseline" gap={3}>
                      <Text
                        strong
                        style={{
                          fontSize: 20,
                          color: stage.color,
                          lineHeight: 1,
                        }}
                      >
                        {stage.value.toLocaleString()}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: token.colorTextSecondary,
                        }}
                      >
                        ({rateOfTotal.toFixed(0)}%)
                      </Text>
                    </Flex>
                  </Flex>
                </div>
              </Tooltip>
            );
          })}
        </Flex>
      )}

      {/* ✨ KPI summary ด้านล่าง */}
      {!isLoading && total > 0 && (
        <div
          style={{
            marginTop: 14,
            padding: "10px 12px",
            borderRadius: 10,
            background: token.colorFillQuaternary,
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Flex justify="space-around">
            <Flex vertical align="center" gap={1}>
              <Text strong style={{ fontSize: 16, color: "#11b6f5" }}>
                {responseRate.toFixed(1)}%
              </Text>
              <Text type="secondary" style={{ fontSize: 10 }}>
                Response Rate
              </Text>
            </Flex>
            <div style={{ width: 1, background: token.colorBorderSecondary }} />
            <Flex vertical align="center" gap={1}>
              <Text strong style={{ fontSize: 16, color: "#22c55e" }}>
                {conversionRate.toFixed(1)}%
              </Text>
              <Text type="secondary" style={{ fontSize: 10 }}>
                Hire Rate
              </Text>
            </Flex>
            <div style={{ width: 1, background: token.colorBorderSecondary }} />
            <Flex vertical align="center" gap={1}>
              <Text strong style={{ fontSize: 16, color: token.colorTextBase }}>
                {total.toLocaleString()}
              </Text>
              <Text type="secondary" style={{ fontSize: 10 }}>
                ทั้งหมด
              </Text>
            </Flex>
          </Flex>
        </div>
      )}
    </Card>
  );
}
