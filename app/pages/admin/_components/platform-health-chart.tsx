"use client";

// ✨ Platform Health Score — Radial gauge แสดง composite KPI 4 ตัว เชิงธุรกิจ
import { Card, Flex, Skeleton, Tooltip, Typography, theme } from "antd";
import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { useDashboardStore } from "../_state/dashboard-store";

const { Text } = Typography;

// ✨ Gauge card เดี่ยว — แสดง score + label + insight
const GaugeCard = ({
  label,
  value,
  maxValue = 100,
  color,
  icon,
  insight,
  unit = "%",
  token,
}: {
  label: string;
  value: number;
  maxValue?: number;
  color: string;
  icon: string;
  insight: string;
  unit?: string;
  token: ReturnType<typeof theme.useToken>["token"];
}) => {
  const pct = Math.min((value / maxValue) * 100, 100);
  // ✨ คะแนน: 0-40 แดง, 41-70 เหลือง, 71+ เขียว
  const scoreColor = pct >= 71 ? "#22c55e" : pct >= 41 ? "#f5a623" : "#ef4444";
  const scoreBg =
    pct >= 71
      ? "rgba(34,197,94,0.1)"
      : pct >= 41
        ? "rgba(245,166,35,0.1)"
        : "rgba(239,68,68,0.1)";

  const gaugeData = [
    { name: "bg", value: 100, fill: token.colorFillSecondary },
    { name: "score", value: pct, fill: color },
  ];

  return (
    <Tooltip title={insight} placement="top">
      <div
        style={{
          flex: 1,
          padding: "12px 10px",
          borderRadius: 12,
          background: token.colorBgLayout,
          border: `1px solid ${token.colorBorderSecondary}`,
          textAlign: "center",
          cursor: "default",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          minWidth: 0,
        }}
        className="hover:scale-[1.02] hover:shadow-lg"
      >
        {/* ✨ Radial mini chart — ต้องมี width+height ชัดเจนเพื่อป้องกัน Recharts -1 warning */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 88,
            minWidth: 0,
          }}
        >
          <ResponsiveContainer width="100%" height={88}>
            <RadialBarChart
              cx="50%"
              cy="75%"
              innerRadius="60%"
              outerRadius="95%"
              startAngle={180}
              endAngle={0}
              data={gaugeData}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={4}
                isAnimationActive
                animationBegin={200}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            </RadialBarChart>
          </ResponsiveContainer>
          {/* ✨ center value */}
          <div
            style={{
              position: "absolute",
              bottom: 4,
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
            }}
          >
            <Text style={{ fontSize: 10 }}>{icon}</Text>
            <Text
              strong
              style={{ fontSize: 15, display: "block", lineHeight: 1.1, color }}
            >
              {unit === "%" ? `${pct.toFixed(0)}%` : `${value}${unit}`}
            </Text>
          </div>
        </div>

        {/* ✨ ป้ายคะแนน */}
        <div
          style={{
            display: "inline-block",
            padding: "1px 7px",
            borderRadius: 20,
            background: scoreBg,
            border: `1px solid ${scoreColor}40`,
            marginBottom: 5,
          }}
        >
          <Text style={{ fontSize: 9, color: scoreColor, fontWeight: 700 }}>
            {pct >= 71 ? "ดี" : pct >= 41 ? "ปานกลาง" : "ต้องแก้ไข"}
          </Text>
        </div>

        <Text
          style={{
            fontSize: 11,
            display: "block",
            fontWeight: 500,
            lineHeight: 1.3,
          }}
        >
          {label}
        </Text>
      </div>
    </Tooltip>
  );
};

export function PlatformHealthChart() {
  const { token } = theme.useToken();
  const { data, isLoading } = useDashboardStore();

  const apps = data?.stats.applications;
  const jobs = data?.stats.jobs;
  const users = data?.stats.users;

  // ✨ คำนวณ 4 metric หลัก
  const totalApps =
    (apps?.pending ?? 0) +
    (apps?.interview ?? 0) +
    (apps?.accepted ?? 0) +
    (apps?.rejected ?? 0);

  // 1. Hire Rate — accepted / total apps
  const hireRate =
    totalApps > 0 ? ((apps?.accepted ?? 0) / totalApps) * 100 : 0;

  // 2. Response Rate — (interview + accepted) / total apps
  const responseRate =
    totalApps > 0
      ? (((apps?.interview ?? 0) + (apps?.accepted ?? 0)) / totalApps) * 100
      : 0;

  // 3. Job Active Rate — OPEN / total jobs
  const totalJobs =
    (jobs?.open ?? 0) + (jobs?.closed ?? 0) + (jobs?.draft ?? 0);
  const jobActiveRate =
    totalJobs > 0 ? ((jobs?.open ?? 0) / totalJobs) * 100 : 0;

  // 4. School Engagement — EMPLOYER count / total users
  const schoolEngagement =
    users && users.total > 0 && users.byRole
      ? (users.byRole.EMPLOYER / users.total) * 100
      : 0;

  // ✨ composite Health Score เฉลี่ย 4 metric
  const healthScore =
    (hireRate + responseRate + jobActiveRate + schoolEngagement) / 4;

  // ✨ สี health score รวม
  const overallColor =
    healthScore >= 70 ? "#22c55e" : healthScore >= 40 ? "#f5a623" : "#ef4444";
  const overallLabel =
    healthScore >= 70
      ? "สุขภาพดี"
      : healthScore >= 40
        ? "พอใช้"
        : "ต้องปรับปรุง";

  const metrics = [
    {
      label: "Hire Rate",
      value: hireRate,
      color: "#22c55e",
      icon: "🎯",
      insight: `${hireRate.toFixed(1)}% ของผู้สมัครได้รับการจ้างงาน — ยิ่งสูงยิ่งดี`,
    },
    {
      label: "Response Rate",
      value: responseRate,
      color: "#11b6f5",
      icon: "💬",
      insight: `${responseRate.toFixed(1)}% โรงเรียนตอบรับหรือนัดสัมภาษณ์ผู้สมัคร`,
    },
    {
      label: "Job Active Rate",
      value: jobActiveRate,
      color: "#0d8fd4",
      icon: "📋",
      insight: `${jobActiveRate.toFixed(1)}% ของประกาศงานอยู่ในสถานะเปิดรับสมัคร`,
    },
    {
      label: "School Ratio",
      value: schoolEngagement,
      color: "#5dd5fb",
      icon: "🏫",
      insight: `โรงเรียนคิดเป็น ${schoolEngagement.toFixed(1)}% ของผู้ใช้ทั้งหมด`,
    },
  ];

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
        style={{ marginBottom: 14 }}
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
              Platform Health Score
            </Text>
          </Flex>
          <Text
            type="secondary"
            style={{ fontSize: 11, marginTop: 2, display: "block" }}
          >
            คะแนนสุขภาพ Platform จาก 4 KPI หลัก
          </Text>
        </div>
        {!isLoading && (
          <div
            style={{
              padding: "4px 12px",
              borderRadius: 20,
              background: `${overallColor}18`,
              border: `1px solid ${overallColor}40`,
            }}
          >
            <Text
              style={{ fontSize: 12, color: overallColor, fontWeight: 700 }}
            >
              {healthScore.toFixed(0)}% · {overallLabel}
            </Text>
          </div>
        )}
      </Flex>

      {isLoading ? (
        <Flex gap={8}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton.Input key={i} active style={{ flex: 1, height: 140 }} />
          ))}
        </Flex>
      ) : (
        <>
          {/* ✨ 4 gauge cards */}
          <Flex gap={8} wrap="wrap">
            {metrics.map((m) => (
              <GaugeCard key={m.label} {...m} token={token} />
            ))}
          </Flex>

          {/* ✨ Health insight bar */}
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 10,
              background: `${overallColor}0d`,
              border: `1px solid ${overallColor}30`,
            }}
          >
            <Flex
              justify="space-between"
              align="center"
              style={{ marginBottom: 6 }}
            >
              <Text
                style={{ fontSize: 11, fontWeight: 600, color: overallColor }}
              >
                Overall Health
              </Text>
              <Text strong style={{ fontSize: 13, color: overallColor }}>
                {healthScore.toFixed(1)}%
              </Text>
            </Flex>
            <div
              style={{
                height: 6,
                background: token.colorFillSecondary,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${healthScore}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, #0d8fd4, ${overallColor})`,
                  borderRadius: 4,
                  transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </div>
            <Text
              type="secondary"
              style={{ fontSize: 10, marginTop: 5, display: "block" }}
            >
              {healthScore >= 70
                ? "✅ Platform ทำงานได้ดี ธุรกิจเติบโตได้ราบรื่น"
                : healthScore >= 40
                  ? "⚠️ ควรตรวจสอบ Response Rate และ Hire Rate"
                  : "🚨 Platform ต้องการการปรับปรุงด่วน — ตรวจสอบการตอบสนองของโรงเรียน"}
            </Text>
          </div>
        </>
      )}
    </Card>
  );
}
