"use client";

import { Card, Flex, Typography, theme } from "antd";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const { Text } = Typography;

// ข้อมูล mock การเติบโตของ users รายเดือน
const monthlyGrowthData = [
  { month: "ต.ค.", users: 0, schools: 0, teachers: 0 },
  { month: "พ.ย.", users: 0, schools: 0, teachers: 0 },
  { month: "ธ.ค.", users: 0, schools: 0, teachers: 0 },
  { month: "ม.ค.", users: 1, schools: 0, teachers: 1 },
  { month: "ก.พ.", users: 1, schools: 0, teachers: 1 },
  { month: "มี.ค.", users: 2, schools: 0, teachers: 1 },
  { month: "เม.ย.", users: 2, schools: 0, teachers: 1 },
];

// ✨ [User Growth Chart — Area chart แสดงการเติบโตของ users]
export function UserGrowthChart() {
  const { token } = theme.useToken();

  return (
    <Card
      title={
        <Flex justify="space-between" align="center">
          <Flex vertical gap={2}>
            <Text strong>การเติบโตของผู้ใช้</Text>
            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
              จำนวนผู้ใช้สะสมรายเดือน (ย้อนหลัง 7 เดือน)
            </Text>
          </Flex>
        </Flex>
      }
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={monthlyGrowthData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={token.colorPrimary}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={token.colorPrimary}
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="gradTeachers" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={token.colorSuccess}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={token.colorSuccess}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={token.colorBorderSecondary}
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: token.colorTextSecondary, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: token.colorTextSecondary, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: token.colorBgElevated,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadius,
              color: token.colorText,
              fontSize: 13,
            }}
            labelStyle={{ color: token.colorText, fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="users"
            name="ผู้ใช้ทั้งหมด"
            stroke={token.colorPrimary}
            strokeWidth={2.5}
            fill="url(#gradUsers)"
            dot={{ fill: token.colorPrimary, r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Area
            type="monotone"
            dataKey="teachers"
            name="ครู"
            stroke={token.colorSuccess}
            strokeWidth={2.5}
            fill="url(#gradTeachers)"
            dot={{ fill: token.colorSuccess, r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <Flex gap={20} justify="center" style={{ marginTop: 8 }}>
        {[
          { color: token.colorPrimary, label: "ผู้ใช้ทั้งหมด" },
          { color: token.colorSuccess, label: "ครู" },
        ].map((item) => (
          <Flex key={item.label} align="center" gap={6}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: item.color,
              }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {item.label}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Card>
  );
}
