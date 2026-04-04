"use client";

import {
  Card,
  Col,
  Flex,
  Row,
  Skeleton,
  Statistic,
  Typography,
  theme,
} from "antd";
import { useUserManagementStore } from "../_state/user-management-store";

const { Text } = Typography;

// ✨ [Stats Section — แสดงสถิติจำนวน users แต่ละ role]
export function StatsSection() {
  const { token } = theme.useToken();
  const users = useUserManagementStore((s) => s.users);
  const isLoading = useUserManagementStore((s) => s.isLoading);
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
            {isLoading ? (
              <Flex vertical gap={8}>
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 80, height: 16 }}
                />
                <Skeleton.Input
                  active
                  size="large"
                  style={{ width: 120, height: 36 }}
                />
              </Flex>
            ) : (
              <Statistic
                title={<Text type="secondary">{stat.title}</Text>}
                value={stat.value}
                styles={{
                  content: { fontSize: 28, fontWeight: 700, color: stat.color },
                }}
              />
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
}
