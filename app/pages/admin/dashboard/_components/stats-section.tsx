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
import {
  Card,
  Col,
  Flex,
  Row,
  Skeleton,
  Statistic,
  Tooltip,
  Typography,
  theme,
} from "antd";
import { useDashboardStore } from "../_state/dashboard-store";
import { SummaryCard } from "@/app/components/card/summary-card.component";

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
      color: token.colorInfo,
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
      color: token.colorPrimary,
      sub: `30 วัน: ${s?.users.newLast30Days ?? 0} คน`,
      subColor: token.colorPrimary,
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
          {/* 3. Summary Card */}
          <SummaryCard
            title={c.title}
            value={c.value}
            unit={c.suffix}
            icon={c.icon}
            color={c.color}
            subtitle={c.sub}
            tooltip={c.sub}
            isLoading={isLoading}
            size="md"
          />
        </Col>
      ))}
    </Row>
  );
}
