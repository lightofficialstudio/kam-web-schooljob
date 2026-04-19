"use client";

// ✨ Recent Signups Card — 5 ผู้ใช้ล่าสุด ดึงจาก live data
import {
  BankOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Card, Empty, Flex, Skeleton, Tag, Typography, theme } from "antd";
import Link from "next/link";
import { useDashboardStore } from "../_state/dashboard-store";

const { Text } = Typography;

// ✨ แปลง role → Tag
function RoleTag({ role }: { role: string }) {
  if (role === "EMPLOYER") {
    return (
      <Tag icon={<BankOutlined />} color="gold" style={{ fontSize: 11, margin: 0 }}>
        โรงเรียน
      </Tag>
    );
  }
  if (role === "ADMIN") {
    return (
      <Tag color="red" style={{ fontSize: 11, margin: 0 }}>
        Admin
      </Tag>
    );
  }
  return (
    <Tag icon={<UserOutlined />} color="blue" style={{ fontSize: 11, margin: 0 }}>
      ครู
    </Tag>
  );
}

// ✨ แปลง provider → ป้าย
function ProviderTag({ provider }: { provider: string }) {
  if (provider === "google") {
    return <Tag color="default" style={{ fontSize: 10, margin: 0 }}>Google</Tag>;
  }
  return <Tag color="default" style={{ fontSize: 10, margin: 0 }}>Email</Tag>;
}

// ✨ แปลงเวลาเป็น relative (เช่น 3 นาทีที่แล้ว)
function relativeTime(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "เพิ่งสมัคร";
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ชั่วโมงที่แล้ว`;
  const days = Math.floor(hrs / 24);
  return `${days} วันที่แล้ว`;
}

export function RecentSignupsCard() {
  const { token } = theme.useToken();
  const { data, isLoading } = useDashboardStore();

  const signups = data?.recentSignups ?? [];

  return (
    <Card
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        height: "100%",
      }}
      styles={{ body: { padding: "16px 20px" } }}
      title={
        <Flex align="center" gap={8}>
          <UserAddOutlined style={{ color: token.colorPrimary }} />
          <Text strong>สมัครใหม่ล่าสุด</Text>
          <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
            (5 คนล่าสุด)
          </Text>
        </Flex>
      }
      extra={
        <Link
          href="/pages/admin/user-management"
          style={{ fontSize: 12, color: token.colorPrimary }}
        >
          ดูทั้งหมด →
        </Link>
      }
    >
      {isLoading ? (
        <Flex vertical gap={12}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Flex key={i} align="center" gap={10}>
              <Skeleton.Avatar active size={36} />
              <Flex vertical gap={4} style={{ flex: 1 }}>
                <Skeleton.Input active size="small" style={{ width: "60%", height: 12 }} />
                <Skeleton.Input active size="small" style={{ width: "40%", height: 10 }} />
              </Flex>
            </Flex>
          ))}
        </Flex>
      ) : signups.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<Text type="secondary" style={{ fontSize: 13 }}>ยังไม่มีผู้ใช้ใหม่</Text>}
          style={{ padding: "12px 0" }}
        />
      ) : (
        <Flex vertical gap={10}>
          {signups.map((user) => (
            <Flex
              key={user.id}
              align="center"
              gap={10}
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                background: token.colorFillQuaternary,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              {/* ✨ Avatar + badge ยืนยันอีเมล */}
              <Badge
                dot
                color={user.isEmailVerified ? "#52c41a" : "#faad14"}
                offset={[-2, 2]}
              >
                <Avatar
                  src={user.profileImageUrl ?? undefined}
                  size={36}
                  style={{ background: token.colorPrimary, flexShrink: 0 }}
                >
                  {(user.fullName ?? user.email)[0]?.toUpperCase()}
                </Avatar>
              </Badge>

              {/* ✨ ข้อมูลหลัก */}
              <Flex vertical gap={3} style={{ flex: 1, minWidth: 0 }}>
                <Flex align="center" gap={6} wrap="wrap">
                  <Text strong style={{ fontSize: 13 }} ellipsis>
                    {user.fullName ?? user.email.split("@")[0]}
                  </Text>
                  <RoleTag role={user.role} />
                  <ProviderTag provider={user.provider} />
                </Flex>
                <Flex align="center" gap={6}>
                  <Text type="secondary" style={{ fontSize: 11 }} ellipsis>
                    {user.email}
                  </Text>
                  {user.isEmailVerified ? (
                    <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 11 }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: "#faad14", fontSize: 11 }} />
                  )}
                </Flex>
                {user.schoolName && (
                  <Text type="secondary" style={{ fontSize: 11 }} ellipsis>
                    <BankOutlined style={{ marginRight: 4 }} />
                    {user.schoolName}
                  </Text>
                )}
              </Flex>

              {/* ✨ เวลาสมัคร */}
              <Text type="secondary" style={{ fontSize: 11, flexShrink: 0, textAlign: "right" }}>
                {relativeTime(user.createdAt)}
              </Text>
            </Flex>
          ))}
        </Flex>
      )}
    </Card>
  );
}
