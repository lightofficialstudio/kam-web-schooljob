"use client";

// ✨ Job Status Distribution — Donut chart: OPEN/CLOSED/DRAFT + province breakdown
import { Card, Flex, Skeleton, Typography, theme } from "antd";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useDashboardStore } from "../_state/dashboard-store";

const { Text } = Typography;

// ✨ สีของแต่ละ status
const STATUS_CONFIG = [
  { key: "open", label: "เปิดรับสมัคร", color: "#22c55e" },
  { key: "closed", label: "ปิดรับสมัคร", color: "#ef4444" },
  { key: "draft", label: "ฉบับร่าง", color: "#f5a623" },
];

// ✨ Custom Tooltip
const CustomTooltip = ({
  active,
  payload,
  token,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { color: string } }[];
  token: ReturnType<typeof theme.useToken>["token"];
}) => {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div
      style={{
        background: token.colorBgElevated,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadius,
        padding: "8px 12px",
        boxShadow: token.boxShadow,
      }}
    >
      <Flex align="center" gap={8}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: p.payload.color,
          }}
        />
        <Text strong style={{ fontSize: 12 }}>
          {p.name}
        </Text>
        <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
          {p.value} ประกาศ
        </Text>
      </Flex>
    </div>
  );
};

// ✨ Legend item
const LegendItem = ({
  color,
  label,
  value,
  total,
  token,
}: {
  color: string;
  label: string;
  value: number;
  total: number;
  token: ReturnType<typeof theme.useToken>["token"];
}) => {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <Flex align="center" gap={8} style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: 3,
          background: color,
          flexShrink: 0,
        }}
      />
      <Flex vertical gap={0} style={{ flex: 1, minWidth: 0 }}>
        <Flex justify="space-between">
          <Text style={{ fontSize: 11, color: token.colorTextSecondary }}>
            {label}
          </Text>
          <Text strong style={{ fontSize: 11 }}>
            {value}
          </Text>
        </Flex>
        {/* ✨ mini progress bar */}
        <div
          style={{
            height: 3,
            background: token.colorFillSecondary,
            borderRadius: 2,
            overflow: "hidden",
            marginTop: 2,
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: color,
              borderRadius: 2,
              transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
      </Flex>
    </Flex>
  );
};

export function JobStatusDonutChart() {
  const { token } = theme.useToken();
  const { data, isLoading } = useDashboardStore();
  const jobs = data?.stats.jobs;
  const provinces = data?.provinceDistribution ?? [];

  const total = (jobs?.open ?? 0) + (jobs?.closed ?? 0) + (jobs?.draft ?? 0);

  const pieData = [
    { name: "เปิดรับสมัคร", value: jobs?.open ?? 0, color: "#22c55e" },
    { name: "ปิดรับสมัคร", value: jobs?.closed ?? 0, color: "#ef4444" },
    { name: "ฉบับร่าง", value: jobs?.draft ?? 0, color: "#f5a623" },
  ].filter((d) => d.value > 0);

  // ✨ fill rate — เปอร์เซ็นต์งานที่ active
  const fillRate = total > 0 ? ((jobs?.open ?? 0) / total) * 100 : 0;

  // ✨ top 5 จังหวัด
  const topProvinces = provinces.slice(0, 5);

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
        style={{ marginBottom: 12 }}
      >
        <div>
          <Flex align="center" gap={8}>
            <div
              style={{
                width: 4,
                height: 18,
                borderRadius: 2,
                background: "linear-gradient(180deg, #22c55e, #11b6f5)",
              }}
            />
            <Text strong style={{ fontSize: 14 }}>
              Job Status Distribution
            </Text>
          </Flex>
          <Text
            type="secondary"
            style={{ fontSize: 11, marginTop: 2, display: "block" }}
          >
            สัดส่วนสถานะประกาศงาน + top จังหวัด
          </Text>
        </div>
        {!isLoading && total > 0 && (
          <div
            style={{
              padding: "3px 9px",
              borderRadius: 20,
              background: "rgba(17,182,245,0.1)",
              border: "1px solid rgba(17,182,245,0.25)",
            }}
          >
            <Text style={{ fontSize: 10, color: "#11b6f5", fontWeight: 600 }}>
              Fill Rate {fillRate.toFixed(0)}%
            </Text>
          </div>
        )}
      </Flex>

      {isLoading ? (
        <Skeleton.Input active style={{ width: "100%", height: 200 }} />
      ) : total === 0 ? (
        <Flex justify="center" align="center" style={{ height: 160 }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            ยังไม่มีข้อมูลประกาศงาน
          </Text>
        </Flex>
      ) : (
        <>
          {/* ✨ Donut + center label */}
          <div style={{ position: "relative" }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive
                  animationBegin={0}
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip token={token} />} />
              </PieChart>
            </ResponsiveContainer>
            {/* ✨ Center label */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                pointerEvents: "none",
              }}
            >
              <Text
                strong
                style={{ fontSize: 22, lineHeight: 1, display: "block" }}
              >
                {total}
              </Text>
              <Text type="secondary" style={{ fontSize: 10 }}>
                ประกาศ
              </Text>
            </div>
          </div>

          {/* ✨ Legend พร้อม mini progress */}
          <Flex vertical gap={7} style={{ marginTop: 8 }}>
            {STATUS_CONFIG.map((s) => (
              <LegendItem
                key={s.key}
                color={s.color}
                label={s.label}
                value={jobs?.[s.key as "open" | "closed" | "draft"] ?? 0}
                total={total}
                token={token}
              />
            ))}
          </Flex>

          {/* ✨ Top provinces */}
          {topProvinces.length > 0 && (
            <div
              style={{
                marginTop: 14,
                padding: "10px 12px",
                borderRadius: 10,
                background: token.colorFillQuaternary,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <Text
                type="secondary"
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Top จังหวัดที่มีงาน
              </Text>
              <Flex vertical gap={5}>
                {topProvinces.map((p, i) => {
                  const maxCount = topProvinces[0]?.count ?? 1;
                  const pct = (p.count / maxCount) * 100;
                  return (
                    <Flex key={p.province} align="center" gap={8}>
                      <Text
                        style={{
                          fontSize: 10,
                          color: token.colorTextSecondary,
                          width: 16,
                          textAlign: "right",
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </Text>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Flex
                          justify="space-between"
                          style={{ marginBottom: 2 }}
                        >
                          <Text style={{ fontSize: 11 }}>
                            {p.province || "ไม่ระบุ"}
                          </Text>
                          <Text
                            strong
                            style={{ fontSize: 11, color: token.colorPrimary }}
                          >
                            {p.count}
                          </Text>
                        </Flex>
                        <div
                          style={{
                            height: 3,
                            background: token.colorFillSecondary,
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: "100%",
                              background:
                                "linear-gradient(90deg, #0d8fd4, #5dd5fb)",
                              borderRadius: 2,
                              transition:
                                "width 0.8s cubic-bezier(0.4,0,0.2,1)",
                            }}
                          />
                        </div>
                      </div>
                    </Flex>
                  );
                })}
              </Flex>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
