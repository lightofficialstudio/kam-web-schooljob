"use client";

import { Card, Col, Row, Statistic, Typography, theme } from "antd";
import { useUserManagementStore } from "../_state/user-management-store";

const { Text } = Typography;

// ✨ [Stats Section — แสดงสถิติจำนวน users แต่ละ role]
export function StatsSection() {
  const { token } = theme.useToken();
  const users = useUserManagementStore((s) => s.users);
  const countByRole = useUserManagementStore((s) => s.countByRole);

  const stats = [
    { title: "ผู้ใช้ทั้งหมด", value: users.length, color: token.colorText },
    { title: "ครู", value: countByRole("EMPLOYEE"), color: token.colorSuccess },
    {
      title: "โรงเรียน",
      value: countByRole("EMPLOYER"),
      color: token.colorPrimary,
    },
    { title: "ผู้ดูแล", value: countByRole("ADMIN"), color: token.colorError },
  ];

  return (
    <Row gutter={[16, 16]}>
      {stats.map((stat) => (
        <Col xs={24} sm={12} lg={6} key={stat.title}>
          <Card
            style={{
              background: token.colorBgContainer,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
            }}
          >
            <Statistic
              title={<Text type="secondary">{stat.title}</Text>}
              value={stat.value}
              styles={{
                content: { fontSize: 28, fontWeight: 700, color: stat.color },
              }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}
