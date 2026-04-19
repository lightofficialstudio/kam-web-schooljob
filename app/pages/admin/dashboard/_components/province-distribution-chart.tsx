"use client";

// ✨ Province Distribution — Bar chart แสดงการกระจายตัวของครู/โรงเรียนรายจังหวัด
import { Flex, Skeleton, Typography, theme } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboardStore } from "../_state/dashboard-store";

const { Text } = Typography;

// ✨ Custom Tooltip
const CustomTooltip = ({
  active,
  payload,
  label,
  token,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  token: ReturnType<typeof theme.useToken>["token"];
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: token.colorBgElevated,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: 10,
        padding: "8px 14px",
        boxShadow: token.boxShadowSecondary,
        fontSize: 12,
      }}
    >
      <Text strong style={{ fontSize: 13 }}>{label}</Text>
      <br />
      <Text type="secondary">{payload[0].value.toLocaleString()} คน</Text>
    </div>
  );
};

export function ProvinceDistributionChart() {
  const { token } = theme.useToken();
  const { data, isLoading } = useDashboardStore();

  const raw = data?.provinceDistribution ?? [];
  // ✨ top 15 จังหวัด เรียงจากมากไปน้อย
  const chartData = [...raw]
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const maxVal = chartData[0]?.count ?? 1;

  return (
    <div
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        padding: "20px 20px 16px",
        height: "100%",
      }}
    >
      <Flex align="center" gap={8} style={{ marginBottom: 16 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `${token.colorPrimary}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <EnvironmentOutlined style={{ color: token.colorPrimary, fontSize: 16 }} />
        </div>
        <div>
          <Text strong style={{ fontSize: 14 }}>
            การกระจายตัวรายจังหวัด
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Top 15 จังหวัดที่มีผู้ใช้งานมากที่สุด
          </Text>
        </div>
      </Flex>

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : chartData.length === 0 ? (
        <Flex justify="center" align="center" style={{ height: 220 }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            ยังไม่มีข้อมูลการกระจายตัว
          </Text>
        </Flex>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 8, left: -16, bottom: 40 }}
            barSize={18}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={token.colorBorderSecondary}
              vertical={false}
            />
            <XAxis
              dataKey="province"
              tick={{ fontSize: 10, fill: token.colorTextSecondary }}
              angle={-40}
              textAnchor="end"
              interval={0}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: token.colorTextSecondary }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<CustomTooltip token={token} />}
              cursor={{ fill: `${token.colorPrimary}08` }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={600}>
              {chartData.map((entry, i) => (
                <Cell
                  key={entry.province}
                  fill={
                    i === 0
                      ? token.colorPrimary
                      : i <= 2
                        ? `${token.colorPrimary}bb`
                        : `${token.colorPrimary}55`
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* ✨ Footer summary */}
      {!isLoading && chartData.length > 0 && (
        <Flex justify="flex-end" style={{ marginTop: 8 }}>
          <Text type="secondary" style={{ fontSize: 11 }}>
            รวมทั้งหมด {raw.length} จังหวัด ·{" "}
            {raw.reduce((s, p) => s + p.count, 0).toLocaleString()} คน
          </Text>
        </Flex>
      )}
    </div>
  );
}
