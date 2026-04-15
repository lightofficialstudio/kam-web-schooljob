"use client";

// ✨ Stats Section — KPI cards จาก live data (Supabase + Prisma)
import {
  BankOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  ProjectOutlined,
  RiseOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Flex, Row, Skeleton, Statistic, Tooltip, Typography, theme } from "antd";
import { useDashboardStore } from "../_state/dashboard-store";

const { Text } = Typography;

export function StatsSection() {
  const { token } = theme.useToken();
  const { data, isLoading } = useDashboardStore();
  const s = data?.stats;

  const cards = [
    {
      title: "ผู้ใช้ทั้งหมด",
      value: s?.users.total ?? 0,
      suffix: "คน",
      icon: <TeamOutlined />,
      color: token.colorPrimary,
      sub: `ยืนยันแล้ว ${s?.users.verified ?? 0} · ยังไม่ยืนยัน ${s?.users.unverified ?? 0}`,
      subColor: token.colorTextSecondary,
    },
    {
      title: "ครู",
      value: s?.users.byRole.EMPLOYEE ?? 0,
      suffix: "คน",
      icon: <UserOutlined />,
      color: token.colorSuccess,
      sub: `ใหม่ 7 วัน: ${s?.users.newLast7Days ?? 0} คน`,
      subColor: token.colorSuccess,
    },
    {
      title: "โรงเรียน",
      value: s?.users.byRole.EMPLOYER ?? 0,
      suffix: "แห่ง",
      icon: <BankOutlined />,
      color: token.colorWarning,
      sub: `สมัครใหม่ 30 วัน: ${s?.users.newLast30Days ?? 0}`,
      subColor: token.colorWarning,
    },
    {
      title: "งานที่เปิดรับ",
      value: s?.jobs.open ?? 0,
      suffix: "ตำแหน่ง",
      icon: <ProjectOutlined />,
      color: "#722ed1",
      sub: `Draft ${s?.jobs.draft ?? 0} · ปิดแล้ว ${s?.jobs.closed ?? 0}`,
      subColor: token.colorTextSecondary,
    },
    {
      title: "ใบสมัครทั้งหมด",
      value: s?.applications.total ?? 0,
      suffix: "ใบ",
      icon: <FileTextOutlined />,
      color: token.colorInfo,
      sub: `Pending ${s?.applications.pending ?? 0} · รับ ${s?.applications.accepted ?? 0}`,
      subColor: token.colorInfo,
    },
    {
      title: "สมัครใหม่ 7 วัน",
      value: s?.users.newLast7Days ?? 0,
      suffix: "คน",
      icon: <RiseOutlined />,
      color: "#13c2c2",
      sub: `30 วัน: ${s?.users.newLast30Days ?? 0} คน`,
      subColor: "#13c2c2",
    },
    {
      title: "ใบสมัครรอพิจารณา",
      value: s?.applications.pending ?? 0,
      suffix: "ใบ",
      icon: <CheckCircleOutlined />,
      color:
        (s?.applications.stalePending ?? 0) > 0
          ? token.colorError
          : token.colorTextSecondary,
      sub:
        (s?.applications.stalePending ?? 0) > 0
          ? `⚠️ ค้างนาน > 14 วัน: ${s?.applications.stalePending} ใบ`
          : "ปกติ",
      subColor:
        (s?.applications.stalePending ?? 0) > 0
          ? token.colorError
          : token.colorTextSecondary,
    },
    {
      title: "ผู้ดูแลระบบ",
      value: s?.users.byRole.ADMIN ?? 0,
      suffix: "คน",
      icon: <TeamOutlined />,
      color: token.colorError,
      sub: "Admin accounts",
      subColor: token.colorTextSecondary,
    },
  ];

  return (
    <Row gutter={[12, 12]}>
      {cards.map((c) => (
        <Col xs={12} sm={8} md={6} key={c.title}>
          <Card
            style={{
              background: token.colorBgContainer,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
              borderTop: `3px solid ${c.color}`,
            }}
            styles={{ body: { padding: "14px 18px" } }}
          >
            {isLoading ? (
              <Flex vertical gap={6}>
                <Skeleton.Input active size="small" style={{ width: 80, height: 14 }} />
                <Skeleton.Input active size="large" style={{ width: 100, height: 30 }} />
                <Skeleton.Input active size="small" style={{ width: 120, height: 12 }} />
              </Flex>
            ) : (
              <Flex vertical gap={4}>
                <Flex align="center" gap={6}>
                  <Text style={{ color: c.color, fontSize: 15 }}>{c.icon}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{c.title}</Text>
                </Flex>
                <Statistic
                  value={c.value}
                  suffix={<Text style={{ fontSize: 13, color: c.color }}>{c.suffix}</Text>}
                  styles={{ content: { fontSize: 26, fontWeight: 700, color: c.color } }}
                />
                <Tooltip title={c.sub}>
                  <Text style={{ fontSize: 11, color: c.subColor }} ellipsis>
                    {c.sub}
                  </Text>
                </Tooltip>
              </Flex>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  );
}
