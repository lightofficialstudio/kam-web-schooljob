"use client";

// ✨ PackageBanner — แสดง Package ปัจจุบัน + Quota Usage แบบ real-time
// ข้อมูลทั้งหมดดึงจาก DB → Admin เปลี่ยน plan/quota จากหลังบ้านได้ทันที ไม่มี hardcode
import {
  CheckCircleFilled,
  CrownOutlined,
  LockOutlined,
  Space,
  ThunderboltOutlined,
  UpCircleOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Flex,
  Progress,
  Skeleton,
  Tag,
  theme,
  Tooltip,
  Typography,
} from "antd";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const { Text } = Typography;

interface PackageInfo {
  plan: string;
  planLabel: string;
  planColor: string;
  planPrice: number;
  planFeatures: string[];
  jobQuotaMax: number;
  jobQuotaUsed: number;
  jobQuotaRemaining: number;
  quotaUsagePercent: number;
  isAtLimit: boolean;
  isNearLimit: boolean;
}

// ✨ Icon ตาม plan — Admin config ผ่าน badgeIcon field ใน PACKAGE_DEFINITIONS
const PlanIcon: React.FC<{ plan: string; size?: number }> = ({
  plan,
  size = 14,
}) => {
  if (plan === "enterprise")
    return <CrownOutlined style={{ fontSize: size }} />;
  if (plan === "premium")
    return <ThunderboltOutlined style={{ fontSize: size }} />;
  return null;
};

export const PackageBanner: React.FC<{ userId: string }> = ({ userId }) => {
  const { token } = theme.useToken();
  const [pkg, setPkg] = useState<PackageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    axios
      .get(`/api/v1/employer/package/read?user_id=${userId}`)
      .then((res) => {
        if (res.data.status_code === 200) setPkg(res.data.data);
      })
      .catch(() => {
        /* silent — banner ไม่ critical */
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  if (isLoading) {
    return (
      <Card
        variant="borderless"
        style={{ borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      >
        <Skeleton active paragraph={{ rows: 1 }} />
      </Card>
    );
  }

  if (!pkg) return null;

  // ✨ สีและ stroke color ของ Progress — dynamic ตาม quota usage
  const progressColor = pkg.isAtLimit
    ? token.colorError
    : pkg.isNearLimit
      ? token.colorWarning
      : pkg.planColor;

  return (
    <Flex vertical gap={12}>
      {/* ─── Banner หลัก ─── */}
      <Card
        variant="borderless"
        style={{
          borderRadius: 16,
          border: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
        styles={{ body: { padding: "20px 24px" } }}
      >
        <Flex align="center" gap={20} wrap="wrap">
          {/* ─── Plan Badge ─── */}
          <Flex align="center" gap={10} style={{ flexShrink: 0 }}>
            <Flex
              align="center"
              justify="center"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: `${pkg.planColor}18`,
                border: `1.5px solid ${pkg.planColor}40`,
                color: pkg.planColor,
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {pkg.plan === "enterprise" ? (
                <CrownOutlined />
              ) : pkg.plan === "premium" ? (
                <ThunderboltOutlined />
              ) : (
                <CheckCircleFilled />
              )}
            </Flex>
            <Flex vertical gap={2}>
              <Flex align="center" gap={6}>
                <Tag
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 12,
                    borderRadius: 6,
                    padding: "2px 10px",
                    border: `1.5px solid ${pkg.planColor}`,
                    background: `${pkg.planColor}18`,
                    color: pkg.planColor,
                  }}
                >
                  <PlanIcon plan={pkg.plan} /> {pkg.planLabel}
                </Tag>
                {pkg.planPrice > 0 && (
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    ฿{pkg.planPrice.toLocaleString()}/เดือน
                  </Text>
                )}
                {pkg.planPrice === 0 && (
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    ฟรี
                  </Text>
                )}
              </Flex>
              <Text type="secondary" style={{ fontSize: 11 }}>
                แผนปัจจุบันของโรงเรียน
              </Text>
            </Flex>
          </Flex>

          {/* ─── Divider ─── */}
          <div
            style={{
              width: 1,
              height: 40,
              background: token.colorBorderSecondary,
              flexShrink: 0,
            }}
            className="hidden-mobile"
          />

          {/* ─── Quota Usage ─── */}
          <Flex vertical gap={6} style={{ minWidth: 260, flex: 2, padding: "4px 0" }}>
            <Flex align="center" justify="space-between">
              <Space gap={6} align="center">
                <Text style={{ fontSize: 13, fontWeight: 700 }}>Job Quota</Text>
                <Tag color={pkg.isAtLimit ? "error" : "primary"} style={{ margin: 0, fontSize: 10, borderRadius: 4 }}>
                  {pkg.jobQuotaUsed} / {pkg.jobQuotaMax === 999 ? "∞" : pkg.jobQuotaMax}
                </Tag>
              </Space>
              <Text type="secondary" style={{ fontSize: 11 }}>
                การใช้งานประกาศงาน
              </Text>
            </Flex>
            <Progress
              <Flex align="center" gap={6}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: progressColor,
                  }}
                >
                  {pkg.jobQuotaUsed}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  / {pkg.jobQuotaMax === 999 ? "∞" : pkg.jobQuotaMax} ประกาศ
                </Text>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  ({pkg.quotaUsagePercent}%)
                </Text>
              </Flex>
            </Flex>
            <Progress
              percent={pkg.quotaUsagePercent}
              size="small"
              showInfo={false}
              strokeColor={progressColor}
              railColor={token.colorFillQuaternary}
              strokeWidth={8}
            />
            <Flex align="center" justify="space-between">
              <Text type="secondary" style={{ fontSize: 11 }}>
                {pkg.isAtLimit
                  ? "ใช้ quota ครบแล้ว — ต้องอัปเกรดเพื่อลงประกาศเพิ่ม"
                  : `เหลืออีก ${pkg.jobQuotaRemaining} ตำแหน่งที่ลงได้`}
              </Text>
              <Text style={{ fontSize: 11, fontWeight: 700, color: progressColor }}>
                {pkg.quotaUsagePercent}%
              </Text>
            </Flex>
          </Flex>

          {/* ─── Features (tooltip) ─── */}
          <Tooltip
            title={
              <Flex vertical gap={4}>
                <Text style={{ color: "white", fontSize: 12, fontWeight: 600 }}>
                  สิทธิ์ใน {pkg.planLabel} Plan
                </Text>
                {pkg.planFeatures.map((f) => (
                  <Flex key={f} align="center" gap={6}>
                    <CheckCircleFilled
                      style={{ color: "#52c41a", fontSize: 11 }}
                    />
                    <Text
                      style={{ color: "rgba(255,255,255,0.85)", fontSize: 11 }}
                    >
                      {f}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            }
            placement="left"
          >
            <Button
              size="small"
              type="text"
              style={{
                color: token.colorTextTertiary,
                fontSize: 11,
                padding: "0 4px",
                flexShrink: 0,
              }}
            >
              ดูสิทธิ์ทั้งหมด
            </Button>
          </Tooltip>
        </Flex>
      </Card>

      {/* ─── Alert: ใกล้เต็ม quota ─── */}
      {pkg.isNearLimit && !pkg.isAtLimit && (
        <Alert
          type="warning"
          showIcon
          message={
            <Flex align="center" justify="space-between" wrap="wrap" gap={8}>
              <Text style={{ fontSize: 13 }}>
                ใช้ Job Quota ไปแล้ว <b>{pkg.quotaUsagePercent}%</b> — เหลืออีก{" "}
                <b>{pkg.jobQuotaRemaining} ตำแหน่ง</b> พิจารณาอัปเกรด Package
              </Text>
              <Link href="/pages/employer/account-setting">
                <Button
                  size="small"
                  icon={<UpCircleOutlined />}
                  type="default"
                  style={{ borderRadius: 6, fontWeight: 600 }}
                >
                  ดู Package
                </Button>
              </Link>
            </Flex>
          }
          style={{ borderRadius: 10 }}
        />
      )}

      {/* ─── Alert: เต็ม quota แล้ว — บล็อกการลงประกาศ ─── */}
      {pkg.isAtLimit && (
        <Alert
          type="error"
          showIcon
          icon={<LockOutlined />}
          title={
            <Flex align="center" justify="space-between" wrap="wrap" gap={8}>
              <Text style={{ fontSize: 13 }}>
                <b>ใช้ Job Quota ครบแล้ว</b> —
                ไม่สามารถลงประกาศงานเพิ่มได้จนกว่าจะปิดประกาศเดิม หรืออัปเกรด
                Package
              </Text>
              <Link href="/pages/employer/account-setting">
                <Button
                  size="small"
                  type="primary"
                  danger
                  icon={<CrownOutlined />}
                  style={{ borderRadius: 6, fontWeight: 600 }}
                >
                  อัปเกรด Package
                </Button>
              </Link>
            </Flex>
          }
          style={{ borderRadius: 10 }}
        />
      )}
    </Flex>
  );
};
