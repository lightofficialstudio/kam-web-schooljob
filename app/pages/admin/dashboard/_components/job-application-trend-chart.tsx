"use client";

// ✨ Job vs Applications Trend — Bar (งานใหม่) + Line (ผู้สมัคร) Combo
import { Card, Flex, Skeleton, Typography, theme } from "antd";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboardStore } from "../_state/dashboard-store";

const { Text } = Typography;

// ✨ สีหลัก — ห้ามใช้ #6366f1
const JOB_COLOR = "#0d8fd4";

// ✨ Custom Tooltip ภาษาไทย
const CustomTooltip = ({
  active,
  payload,
  label,
  token,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  token: ReturnType<typeof theme.useToken>["token"];
}) => {
  if (!active || !payload?.length) return null;
  const jobs = payload.find((p) => p.name === "jobs");
  const apps = payload.find((p) => p.name === "applications");
  const ratio = jobs?.value
    ? ((apps?.value ?? 0) / jobs.value).toFixed(1)
    : "—";

  return (
    <div
      style={{
        background: token.colorBgElevated,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadius,
        padding: "10px 14px",
        minWidth: 160,
        boxShadow: token.boxShadow,
      }}
    >
      <Text strong style={{ fontSize: 12, display: "block", marginBottom: 6 }}>
        {label}
      </Text>
      <Flex vertical gap={3}>
        <Flex justify="space-between" gap={16}>
          <Text style={{ fontSize: 11, color: token.colorTextSecondary }}>
            ประกาศงานใหม่
          </Text>
          <Text strong style={{ fontSize: 11, color: JOB_COLOR }}>
            {jobs?.value ?? 0}
          </Text>
        </Flex>
        <Flex justify="space-between" gap={16}>
          <Text style={{ fontSize: 11, color: token.colorTextSecondary }}>
            ผู้สมัครใหม่
          </Text>
          <Text strong style={{ fontSize: 11, color: token.colorSuccess }}>
            {apps?.value ?? 0}
          </Text>
        </Flex>
        <div
          style={{
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            marginTop: 4,
            paddingTop: 4,
          }}
        >
          <Flex justify="space-between" gap={16}>
            <Text style={{ fontSize: 11, color: token.colorTextSecondary }}>
              สมัคร/ประกาศ
            </Text>
            <Text strong style={{ fontSize: 11, color: token.colorWarning }}>
              {ratio}x
            </Text>
          </Flex>
        </div>
      </Flex>
    </div>
  );
};

export function JobApplicationTrendChart() {
  const { token } = theme.useToken();
  const { data, isLoading } = useDashboardStore();
  const chartData = data?.growthChart ?? [];

  // ✨ insight: เดือนที่ demand สูงสุด
  const peakMonth = chartData.reduce(
    (best, cur) => (cur.applications > best.applications ? cur : best),
    chartData[0] ?? { month: "—", applications: 0 },
  );
  const totalApps = chartData.reduce((s, d) => s + d.applications, 0);
  const totalJobs = chartData.reduce((s, d) => s + d.jobs, 0);

  return (
    <Card
      styles={{ body: { padding: "16px 20px 20px" } }}
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        overflow: "hidden",
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
                background: "linear-gradient(180deg, #0d8fd4, #5dd5fb)",
              }}
            />
            <Text strong style={{ fontSize: 14 }}>
              Supply vs Demand
            </Text>
          </Flex>
          <Text
            type="secondary"
            style={{ fontSize: 11, marginTop: 2, display: "block" }}
          >
            ประกาศงานใหม่ เทียบกับ ผู้สมัครรายเดือน
          </Text>
        </div>
        {!isLoading && totalJobs > 0 && (
          <Flex gap={6} wrap="wrap" justify="flex-end">
            <span
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 20,
                background: "rgba(17,182,245,0.1)",
                color: JOB_COLOR,
                border: `1px solid rgba(17,182,245,0.25)`,
              }}
            >
              {totalJobs} ประกาศ
            </span>
            <span
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 20,
                background: token.colorSuccessBg,
                color: token.colorSuccess,
                border: `1px solid ${token.colorSuccessBorder}`,
              }}
            >
              {totalApps} สมัคร
            </span>
          </Flex>
        )}
      </Flex>

      {isLoading ? (
        <Skeleton.Input active style={{ width: "100%", height: 220 }} />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart
            data={chartData}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="barJobGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d8fd4" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#5dd5fb" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={token.colorBorderSecondary}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: token.colorTextSecondary, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: token.colorTextSecondary, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip token={token} />}
              cursor={{ fill: `${token.colorFillSecondary}80` }}
            />
            <Bar
              dataKey="jobs"
              name="jobs"
              fill="url(#barJobGrad)"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
              isAnimationActive
              animationBegin={0}
              animationDuration={800}
            />
            <Line
              dataKey="applications"
              name="applications"
              stroke={token.colorSuccess}
              strokeWidth={2.5}
              dot={{ fill: token.colorSuccess, r: 3.5, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              type="monotone"
              isAnimationActive
              animationBegin={400}
              animationDuration={800}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}

      {/* Legend + Insight */}
      <Flex justify="space-between" align="center" style={{ marginTop: 10 }}>
        <Flex gap={16}>
          {[
            { color: JOB_COLOR, label: "ประกาศงานใหม่" },
            { color: token.colorSuccess, label: "ผู้สมัครใหม่", line: true },
          ].map((item) => (
            <Flex key={item.label} align="center" gap={5}>
              {item.line ? (
                <div
                  style={{
                    width: 16,
                    height: 2,
                    background: item.color,
                    borderRadius: 1,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: item.color,
                  }}
                />
              )}
              <Text type="secondary" style={{ fontSize: 11 }}>
                {item.label}
              </Text>
            </Flex>
          ))}
        </Flex>
        {peakMonth && peakMonth.applications > 0 && (
          <Text style={{ fontSize: 10, color: token.colorTextTertiary }}>
            สูงสุด:{" "}
            <Text strong style={{ fontSize: 10 }}>
              {peakMonth.month}
            </Text>
          </Text>
        )}
      </Flex>
    </Card>
  );
}
