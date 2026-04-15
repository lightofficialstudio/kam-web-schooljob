"use client";

// ✨ Stats Section — สถิติจาก summary ที่ merge Supabase + Prisma
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  RiseOutlined,
  StopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Flex,
  Row,
  Skeleton,
  Statistic,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import { useUserManagementStore } from "../_state/user-management-store";

const { Text } = Typography;

export function StatsSection() {
  const { token } = theme.useToken();
  const { summary, isLoading, total } = useUserManagementStore();

  const stats = [
    {
      title: "User ทั้งหมด",
      value: summary?.total ?? total,
      icon: <TeamOutlined />,
      color: token.colorPrimary,
      sub: `ครู ${summary?.byRole.EMPLOYEE ?? 0} · โรงเรียน ${summary?.byRole.EMPLOYER ?? 0} · Admin ${summary?.byRole.ADMIN ?? 0}`,
    },
    {
      title: "Active",
      value: summary?.byStatus.active ?? 0,
      icon: <CheckCircleOutlined />,
      color: "#52c41a",
      sub: "ยืนยันอีเมลแล้ว + ไม่ถูกแบน",
    },
    {
      title: "ยังไม่ยืนยันอีเมล",
      value: summary?.byStatus.unverified ?? 0,
      icon: <ExclamationCircleOutlined />,
      color: "#fa8c16",
      sub: "ต้องการการยืนยัน",
    },
    {
      title: "ถูกแบน",
      value: summary?.byStatus.banned ?? 0,
      icon: <StopOutlined />,
      color: token.colorError,
      sub: "ไม่สามารถเข้าสู่ระบบ",
    },
    {
      title: "ใหม่ 7 วัน",
      value: summary?.newLast7Days ?? 0,
      icon: <RiseOutlined />,
      color: "#722ed1",
      sub: `30 วัน: ${summary?.newLast30Days ?? 0} คน`,
    },
  ];

  return (
    <Row gutter={[12, 12]}>
      {stats.map((s) => (
        <Col xs={12} sm={8} md={24 / stats.length} key={s.title}>
          <Card
            style={{
              background: token.colorBgContainer,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
              borderTop: `3px solid ${s.color}`,
            }}
            styles={{ body: { padding: "14px 18px" } }}
          >
            {isLoading ? (
              <Flex vertical gap={6}>
                <Skeleton.Input active size="small" style={{ width: 80, height: 14 }} />
                <Skeleton.Input active size="large" style={{ width: 100, height: 32 }} />
              </Flex>
            ) : (
              <Flex vertical gap={4}>
                <Flex align="center" gap={6}>
                  <Text style={{ color: s.color, fontSize: 16 }}>{s.icon}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{s.title}</Text>
                </Flex>
                <Statistic
                  value={s.value}
                  styles={{ content: { fontSize: 26, fontWeight: 700, color: s.color } }}
                />
                <Tooltip title={s.sub}>
                  <Text type="secondary" style={{ fontSize: 11 }} ellipsis>
                    {s.sub}
                  </Text>
                </Tooltip>
              </Flex>
            )}
          </Card>
        </Col>
      ))}

      {/* ─── Provider breakdown ─── */}
      {summary && Object.keys(summary.providers).length > 0 && (
        <Col xs={24}>
          <Card
            size="small"
            style={{
              background: token.colorFillQuaternary,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
            }}
            styles={{ body: { padding: "10px 16px" } }}
          >
            <Flex align="center" gap={12} wrap="wrap">
              <Text type="secondary" style={{ fontSize: 12 }}>Provider:</Text>
              {Object.entries(summary.providers).map(([provider, count]) => (
                <Tag key={provider} style={{ fontSize: 12 }}>
                  {provider}: <Text strong>{count}</Text>
                </Tag>
              ))}
              <Text type="secondary" style={{ fontSize: 12, marginLeft: "auto" }}>
                ไม่มี Profile: {summary.byStatus.no_profile} คน
              </Text>
            </Flex>
          </Card>
        </Col>
      )}
    </Row>
  );
}
