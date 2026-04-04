"use client";

import { Card, Flex, Typography, theme } from "antd";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const { Text } = Typography;

// ข้อมูล mock การกระจาย role
const roleData = [
  { name: "ครู (EMPLOYEE)", value: 1, key: "EMPLOYEE" },
  { name: "โรงเรียน (EMPLOYER)", value: 0, key: "EMPLOYER" },
  { name: "ผู้ดูแล (ADMIN)", value: 1, key: "ADMIN" },
];

// ✨ [Role Distribution Chart — Donut chart แสดงสัดส่วน role]
export function RoleDistributionChart() {
  const { token } = theme.useToken();

  const COLORS = [token.colorSuccess, token.colorWarning, token.colorError];
  const total = roleData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card
      title={
        <Flex vertical gap={2}>
          <Text strong>สัดส่วน Role ผู้ใช้</Text>
          <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
            การกระจายตามประเภทผู้ใช้งาน
          </Text>
        </Flex>
      }
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        height: "100%",
      }}
    >
      <Flex align="center" gap={24} wrap="wrap">
        {/* Donut */}
        <div style={{ width: 180, height: 180, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {roleData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: token.colorBgElevated,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  borderRadius: token.borderRadius,
                  fontSize: 13,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Centre label overlay using absolute — use Flex instead */}
        <Flex vertical gap={12} flex={1}>
          <Flex vertical align="center" gap={0} style={{ marginBottom: 4 }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: token.colorText,
                lineHeight: 1,
              }}
            >
              {total}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ผู้ใช้ทั้งหมด
            </Text>
          </Flex>

          {roleData.map((item, i) => (
            <Flex key={item.key} align="center" justify="space-between" gap={8}>
              <Flex align="center" gap={8}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: COLORS[i],
                    flexShrink: 0,
                  }}
                />
                <Text style={{ fontSize: 13 }}>{item.name}</Text>
              </Flex>
              <Text strong style={{ color: COLORS[i], fontSize: 15 }}>
                {item.value}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Card>
  );
}
