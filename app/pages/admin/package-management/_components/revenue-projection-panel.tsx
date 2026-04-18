"use client";

// ✨ Revenue Projection Panel — MRR ปัจจุบัน + Upside potential (Feature 3)
import {
  DollarOutlined,
  RiseOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Flex,
  Row,
  Statistic,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechTooltip } from "recharts";
import { PackageSummary, PackagePlanItem, usePackageStore } from "../_state/package-store";

const { Text } = Typography;

interface Props {
  plans: PackagePlanItem[];
}

export function RevenueProjectionPanel({ plans }: Props) {
  const { token } = theme.useToken();
  const { summary } = usePackageStore();

  if (plans.length === 0) return null;

  // ✨ คำนวณ MRR ปัจจุบัน
  const currentMRR = plans.reduce((sum, p) => {
    const count = (summary as PackageSummary)[p.plan] ?? 0;
    return sum + p.price * count;
  }, 0);

  // ✨ คำนวณ MRR ถ้า upgrade ทุก basic → plan ถัดไป
  const basicPlan = plans.find((p) => p.plan === "basic" || p.sortOrder === 0);
  const basicCount = basicPlan ? ((summary as PackageSummary)[basicPlan.plan] ?? 0) : 0;
  const premiumPlan = basicPlan?.upgradeTarget ? plans.find((p) => p.plan === basicPlan.upgradeTarget) : null;
  const upsideFromBasic = premiumPlan ? basicCount * (premiumPlan.price - (basicPlan?.price ?? 0)) : 0;

  // ✨ Revenue breakdown สำหรับ Pie chart
  const revenueData = plans
    .filter((p) => p.price > 0)
    .map((p) => {
      const count = (summary as PackageSummary)[p.plan] ?? 0;
      return { name: p.label, value: p.price * count, color: p.color, count };
    })
    .filter((d) => d.value > 0);

  const totalSchools = (summary as PackageSummary).total ?? 0;
  const paidSchools = plans
    .filter((p) => p.price > 0)
    .reduce((s, p) => s + ((summary as PackageSummary)[p.plan] ?? 0), 0);
  const conversionRate = totalSchools > 0 ? Math.round((paidSchools / totalSchools) * 100) : 0;

  // ✨ ARPU (Average Revenue Per User ที่จ่ายเงิน)
  const arpu = paidSchools > 0 ? Math.round(currentMRR / paidSchools) : 0;

  // ✨ Projected ARR
  const arr = currentMRR * 12;

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: 16,
        marginBottom: 24,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorBgLayout} 100%)`,
      }}
      title={
        <Flex align="center" gap={8}>
          <DollarOutlined style={{ color: "#22c55e", fontSize: 15 }} />
          <Text strong>Revenue Intelligence</Text>
          <Tag color="green" style={{ fontSize: 10, borderRadius: 20 }}>MRR · ARR · Upside</Tag>
        </Flex>
      }
    >
      <Row gutter={[16, 16]}>
        {/* ── KPI Cards ── */}
        <Col xs={24} md={14}>
          <Row gutter={[12, 12]}>
            {[
              {
                title: "MRR ปัจจุบัน",
                value: currentMRR,
                prefix: "฿",
                color: "#22c55e",
                icon: <DollarOutlined />,
                sub: `${paidSchools} โรงเรียนที่จ่ายเงิน`,
              },
              {
                title: "ARR (Projected)",
                value: arr,
                prefix: "฿",
                color: token.colorPrimary,
                icon: <RiseOutlined />,
                sub: "MRR × 12 เดือน",
              },
              {
                title: "Conversion Rate",
                value: conversionRate,
                suffix: "%",
                color: conversionRate >= 30 ? "#22c55e" : conversionRate >= 15 ? token.colorWarning : token.colorError,
                icon: <TrophyOutlined />,
                sub: `${paidSchools}/${totalSchools} โรงเรียน`,
              },
              {
                title: "ARPU (ผู้จ่าย)",
                value: arpu,
                prefix: "฿",
                color: "#a855f7",
                icon: <DollarOutlined />,
                sub: "ต่อโรงเรียนต่อเดือน",
              },
            ].map((kpi) => (
              <Col xs={12} key={kpi.title}>
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    background: token.colorBgContainer,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderTop: `3px solid ${kpi.color}`,
                  }}
                >
                  <Flex align="center" gap={6} style={{ marginBottom: 6 }}>
                    <span style={{ color: kpi.color, fontSize: 12 }}>{kpi.icon}</span>
                    <Text type="secondary" style={{ fontSize: 11 }}>{kpi.title}</Text>
                  </Flex>
                  <Statistic
                    value={kpi.value}
                    prefix={kpi.prefix ? <span style={{ fontSize: 14, color: kpi.color }}>{kpi.prefix}</span> : undefined}
                    suffix={kpi.suffix ? <span style={{ fontSize: 14, color: kpi.color }}>{kpi.suffix}</span> : undefined}
                    styles={{ content: { fontSize: 22, fontWeight: 700, color: kpi.color, lineHeight: 1.2 } }}
                    formatter={(v) => Number(v).toLocaleString()}
                  />
                  <Text type="secondary" style={{ fontSize: 10, marginTop: 2, display: "block" }}>{kpi.sub}</Text>
                </div>
              </Col>
            ))}
          </Row>

          {/* ── Upside Banner ── */}
          {upsideFromBasic > 0 && premiumPlan && basicPlan && (
            <div
              style={{
                marginTop: 12,
                padding: "12px 16px",
                borderRadius: 10,
                background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.03))",
                border: "1px solid rgba(34,197,94,0.25)",
              }}
            >
              <Flex justify="space-between" align="center">
                <Flex vertical gap={2}>
                  <Text strong style={{ fontSize: 13, color: "#22c55e" }}>
                    Upgrade Upside: +฿{upsideFromBasic.toLocaleString()}/เดือน
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    ถ้า {basicCount} โรงเรียน {basicPlan.label} → {premiumPlan.label} (฿{premiumPlan.price.toLocaleString()})
                  </Text>
                </Flex>
                <RiseOutlined style={{ color: "#22c55e", fontSize: 20 }} />
              </Flex>
            </div>
          )}
        </Col>

        {/* ── Revenue Pie ── */}
        <Col xs={24} md={10}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {revenueData.length > 0 ? (
              <>
                <Text type="secondary" style={{ fontSize: 12, marginBottom: 8 }}>Revenue Breakdown</Text>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={revenueData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={78}
                      paddingAngle={3}
                      dataKey="value"
                      isAnimationActive
                      animationBegin={0}
                      animationDuration={700}
                    >
                      {revenueData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <RechTooltip
                      formatter={(val: number, name: string) => [`฿${val.toLocaleString()}`, name]}
                      contentStyle={{
                        background: token.colorBgElevated,
                        border: `1px solid ${token.colorBorderSecondary}`,
                        borderRadius: token.borderRadius,
                        color: token.colorText,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <Flex gap={12} wrap="wrap" justify="center">
                  {revenueData.map((d) => (
                    <Flex key={d.name} align="center" gap={5}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                      <Text type="secondary" style={{ fontSize: 11 }}>{d.name} ({d.count})</Text>
                    </Flex>
                  ))}
                </Flex>
              </>
            ) : (
              <Flex vertical align="center" gap={8}>
                <DollarOutlined style={{ fontSize: 32, color: token.colorTextQuaternary }} />
                <Text type="secondary" style={{ fontSize: 12, textAlign: "center" }}>
                  ยังไม่มีโรงเรียนที่ชำระเงิน
                </Text>
              </Flex>
            )}
          </div>
        </Col>
      </Row>
    </Card>
  );
}
